import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCreatingNew, triggerRefresh, setSelectedCarData } from '../../global/redux/slices/DisplaySlice';
import { supabase } from '../../global/supabase/Client';
import './Search.css';
import NewItem from '../data/NewItem';
import ItemDisplay from '../data/ItemDisplay';
import SearchTile from './SearchTile';
import SearchList from './SearchList';
import SearchControls from './SearchControls';
import ImageViewer from '../data/ImageViewer';
import AddImages from '../data/AddImages';
import DeleteImage from '../data/DeleteImage';
import SearchPager from './SearchPager';
import DownloadDialog from '../../util/DownloadDialog';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('tile');
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(19);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const creatingNew = useSelector(state => state.display.creatingNew);
  const selectedCarData = useSelector(state => state.display.selectedCarData);
  const refreshTrigger = useSelector(state => state.display.refreshTrigger);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    loadCars();
  }, [refreshTrigger]);

  const loadCars = async () => {
    console.log('Search: Loading cars from database');
    if (!user) {
      console.log('Search: No user logged in');
      setCars([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Search: Error loading cars', error);
    } else {
      console.log('Search: Loaded cars', data);
      setCars(data || []);
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log('Search: Performing search for', searchTerm);
    setLoading(true);
    
    if (!user) {
      console.log('Search: No user logged in');
      setCars([]);
      setLoading(false);
      return;
    }
    
    if (!searchTerm.trim()) {
      await loadCars();
      return;
    }

    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('user_id', user.id)
      .or(`make.ilike.%${searchTerm}%,registration.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Search: Error searching cars', error);
    } else {
      console.log('Search: Search results', data);
      setCars(data || []);
    }
    setPageStart(0);
    setPageEnd(19);
    setLoading(false);
  };

  const handleNewTile = () => {
    console.log('Search: Opening new item overlay');
    dispatch(setCreatingNew(true));
  };

  const handleDownload = async (option) => {
    console.log('Search: Download option selected:', option);
    setShowDownloadDialog(false);
    setDownloading(true);

    try {
      switch (option) {
        case 'all-data':
          await downloadAllData();
          break;
        case 'all-images':
          await downloadAllImages();
          break;
        case 'search-images':
          await downloadSearchImages();
          break;
        case 'search-data':
          await downloadSearchData();
          break;
      }
    } catch (error) {
      console.error('Search: Download error:', error);
    } finally {
      setDownloading(false);
    }
  };

  const downloadAllData = async () => {
    const { data: allCars } = await supabase.from('cars').select('*');
    const csv = convertToCSV(allCars);
    downloadCSV(csv, 'all-cars.csv');
  };

  const downloadSearchData = async () => {
    const csv = convertToCSV(cars);
    downloadCSV(csv, 'search-results.csv');
  };

  const downloadAllImages = async () => {
    const { data: allCars } = await supabase.from('cars').select('*');
    await downloadImages(allCars);
  };

  const downloadSearchImages = async () => {
    await downloadImages(cars);
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    const headers = ['Reg #', 'Price', 'Make', 'Model', 'Year', 'Miles', 'Color', 'Transmission', 'Fuel Type', 'Description', 'Note'];
    const rows = data.map(car => [
      car.registration || '',
      car.price || '',
      car.make || '',
      car.model || '',
      car.year || '',
      car.miles || '',
      car.color || '',
      car.transmission || '',
      car.fuel_type || '',
      car.description || '',
      car.note || ''
    ]);
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadImages = async (carsToDownload) => {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    if (!userId) return;

    // Dynamically import JSZip
    const JSZip = await import('jszip');
    const zip = new JSZip.default();

    // Track registrations to handle duplicates
    const regCount = {};

    for (const car of carsToDownload) {
      if (!car.images || car.images.length === 0) continue;

      const reg = car.registration || 'unknown';
      // Handle duplicate registrations
      if (regCount[reg]) {
        regCount[reg]++;
        const folderName = `${reg}${regCount[reg]}`;
        const folder = zip.folder(`CarImages/${folderName}`);
        for (const imageUrl of car.images) {
          try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const fileName = imageUrl.split('/').pop();
            folder.file(fileName, blob);
          } catch (error) {
            console.error('Search: Error downloading image:', error);
          }
        }
      } else {
        regCount[reg] = 1;
        const folder = zip.folder(`CarImages/${reg}`);
        for (const imageUrl of car.images) {
          try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const fileName = imageUrl.split('/').pop();
            folder.file(fileName, blob);
          } catch (error) {
            console.error('Search: Error downloading image:', error);
          }
        }
      }
    }

    // Generate ZIP file
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'car-images.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="search-page">
      <div className="search-top-bar">
        <SearchControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onExport={() => setShowDownloadDialog(true)}
        />
      </div>

      {loading && (
        <div className="auto-login">
          <div className="auto-login-content">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      )}
      {downloading && (
        <div className="auto-login">
          <div className="auto-login-content">
            <div className="loading-spinner"></div>
            <p>Downloading...</p>
          </div>
        </div>
      )}

      <div className={`cars-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
        {viewMode === 'list' && (
          <button className="list-new-button" onClick={handleNewTile}>+ Add New Car</button>
        )}
        {viewMode !== 'list' && (
          <div className="car-tile new-tile" onClick={handleNewTile}>
            <div className="car-tile-image">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--primary-color)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            <div className="car-tile-bar">
              <p className="new-tile-text">Add New Car</p>
            </div>
          </div>
        )}
        {viewMode === 'list' && (
          <div className="list-view-container list-view">
            <div className="car-list-header">
              <div className="car-list-header-cell">Reg #</div>
              <div className="car-list-header-cell">Price</div>
              <div className="car-list-header-cell">Make</div>
              <div className="car-list-header-cell">Model</div>
              <div className="car-list-header-cell">Year</div>
              <div className="car-list-header-cell">Miles</div>
              <div className="car-list-header-cell">Color</div>
              <div className="car-list-header-cell">Note</div>
            </div>
            {cars.slice(pageStart, pageEnd).map((car) =>
              <div key={car.id} className="car-list-item">
                <div className="car-list-cell">{car.registration || '-'}</div>
                <div className="car-list-cell">{car.price ? `$${car.price}` : '-'}</div>
                <div className="car-list-cell">{car.make || '-'}</div>
                <div className="car-list-cell">{car.model || '-'}</div>
                <div className="car-list-cell">{car.year || '-'}</div>
                <div className="car-list-cell">{car.miles ? `${car.miles}` : '-'}</div>
                <div className="car-list-cell">{car.color || '-'}</div>
                <div className="car-list-cell">{car.note || '-'}</div>
              </div>
            )}
          </div>
        )}
        {viewMode !== 'list' && cars.slice(pageStart, pageEnd).map((car) =>
          <SearchTile key={car.id} car={car} />
        )}
      </div>

      <SearchPager
        pageStart={pageStart}
        pageEnd={pageEnd}
        totalItems={cars.length}
        setPageStart={setPageStart}
        setPageEnd={setPageEnd}
      />

      {creatingNew && <NewItem />}
      {selectedCarData && <ItemDisplay />}
      <ImageViewer />
      <AddImages />
      <DeleteImage />
      <DownloadDialog
        isOpen={showDownloadDialog}
        onClose={() => setShowDownloadDialog(false)}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default Search;
