import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setViewingImageId, setAddingImagesToCarId, setDeletingImage, setSelectedCarData, triggerRefresh, setImageSourceMode } from '../../global/redux/slices/DisplaySlice';
import { supabase } from '../../global/supabase/Client';
import AutoSaveInput from '../../util/AutoSaveInput';
import Confirm from '../../util/Confirm';
import ImageSourceDialog from '../../util/ImageSourceDialog';
import './ItemDisplay.css';

const ItemDisplay = () => {
  const selectedCarData = useSelector(state => state.display.selectedCarData);
  const refreshTrigger = useSelector(state => state.display.refreshTrigger);
  const dispatch = useDispatch();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImageSourceDialog, setShowImageSourceDialog] = useState(false);

  console.log('ItemDisplay: selectedCarData:', selectedCarData);

  useEffect(() => {
    if (selectedCarData) {
      console.log('ItemDisplay: selectedCarData exists, setting car state');
      // Start with initial data for instant display
      setCar(selectedCarData);
      setFormData({
        registration: selectedCarData.registration || '',
        make: selectedCarData.make || '',
        model: selectedCarData.model || '',
        year: selectedCarData.year || '',
        color: selectedCarData.color || '',
        miles: selectedCarData.miles || '',
        price: selectedCarData.price || '',
        fuel_type: selectedCarData.fuel_type || '',
        transmission: selectedCarData.transmission || '',
        description: selectedCarData.description || '',
        note: selectedCarData.note || '',
      });
      setLoading(false);
    }
  }, [selectedCarData]);

  useEffect(() => {
    if (selectedCarData?.id) {
      // Load full data from database when selectedCarData.id changes or refresh is triggered
      loadCarDetails();
    }
  }, [selectedCarData?.id, refreshTrigger]);

  const loadCarDetails = async () => {
    console.log('ItemDisplay: Loading car details for id:', selectedCarData?.id);
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', selectedCarData?.id)
      .single();

    if (error) {
      console.error('ItemDisplay: Error loading car', error);
    } else {
      console.log('ItemDisplay: Loaded car', data);
      console.log('ItemDisplay: Car images:', data.images);
      setCar(data);
    }
    setLoading(false);
  };

  const handleClose = () => {
    console.log('ItemDisplay: Closing');
    dispatch(setSelectedCarData(null));
    dispatch(triggerRefresh());
  };

  const handleImageClick = (imageUrl) => {
    console.log('ItemDisplay: Image clicked', imageUrl);
    dispatch(setViewingImageId(imageUrl));
  };

  const handleAddImages = () => {
    console.log('ItemDisplay: Opening image source dialog for car:', selectedCarData?.id);
    setShowImageSourceDialog(true);
  };

  const handleImageSourceUpload = () => {
    console.log('ItemDisplay: User selected upload option');
    setShowImageSourceDialog(false);
    dispatch(setAddingImagesToCarId(selectedCarData?.id));
    dispatch(setImageSourceMode('upload'));
    console.log('ItemDisplay: Set imageSourceMode to upload');
  };

  const handleImageSourceCamera = () => {
    console.log('ItemDisplay: User selected camera option');
    setShowImageSourceDialog(false);
    dispatch(setAddingImagesToCarId(selectedCarData?.id));
    dispatch(setImageSourceMode('camera'));
    console.log('ItemDisplay: Set imageSourceMode to camera');
  };

  const handleDeleteImage = (imageUrl) => {
    console.log('ItemDisplay: Deleting image:', imageUrl);
    dispatch(setDeletingImage({ carId: selectedCarData?.id, imageUrl }));
  };

  const handleSaveField = async (field, value) => {
    console.log(`ItemDisplay: Saving ${field}: ${value}`);
    try {
      const { data, error } = await supabase
        .from('cars')
        .update({ [field]: value })
        .eq('id', selectedCarData?.id)
        .select()
        .single();

      if (error) {
        console.error(`ItemDisplay: Error saving ${field}`, error);
      } else {
        console.log(`ItemDisplay: ${field} saved successfully`, data);
        setCar(data);
        dispatch(setSelectedCarData(data));
      }
    } catch (error) {
      console.error(`ItemDisplay: Error saving ${field}`, error);
    }
  };

  const handleDeleteRecord = async () => {
    console.log('ItemDisplay: Deleting record', selectedCarData?.id);
    try {
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;

      if (userId && car?.images) {
        console.log('ItemDisplay: Deleting images for car', car.images);
        for (const imageUrl of car.images) {
          try {
            const fileName = imageUrl.split('/').pop();
            const filePath = `${userId}/${selectedCarData?.id}/${fileName}`;
            await supabase.storage.from('car-images').remove([filePath]);
            console.log('ItemDisplay: Deleted image', filePath);
          } catch (error) {
            console.error('ItemDisplay: Error deleting image', error);
          }
        }
      }

      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', selectedCarData?.id);

      if (error) {
        console.error('ItemDisplay: Error deleting record', error);
      } else {
        console.log('ItemDisplay: Record deleted successfully');
        dispatch(triggerRefresh());
        handleClose();
      }
    } catch (error) {
      console.error('ItemDisplay: Error deleting record', error);
    }
  };

  if (!selectedCarData) {
    console.log('ItemDisplay: Not displaying - selectedCarData is null');
    return null;
  }

  console.log('ItemDisplay: Displaying detail view for car:', selectedCarData.id);

  return (
    <div className="item-display-overlay">
      <div className="item-display-content">
        <div className="item-display-header">
          <h2 className="item-display-title">Car Details</h2>
          <button className="close-button" onClick={handleClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading...</p>
          </div>
        ) : car ? (
          <div className="item-display-body">
            <div className="item-display-images">
              <div className="images-header">
                <h3>Images</h3>
                <button className="add-images-button" onClick={handleAddImages}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Images
                </button>
              </div>
              {car.images && car.images.length > 0 ? (
                <div className="image-gallery">
                  {car.images.map((image, index) => (
                    <div key={index} className="image-item" onClick={() => handleImageClick(image)}>
                      <img src={image} alt={`Car image ${index + 1}`} />
                      <button className="delete-image-button" onClick={(e) => { e.stopPropagation(); handleDeleteImage(image); }}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="placeholder-images">
                  <p>No images yet</p>
                </div>
              )}
            </div>

            <div className="item-display-details">
              <div className="detail-group">
                <label htmlFor="registration">Registration</label>
                <AutoSaveInput
                  id="registration"
                  value={formData.registration || ''}
                  location="registration"
                  onSave={(value) => handleSaveField('registration', value)}
                  className="detail-input"
                />
              </div>

              <div className="detail-group">
                <label htmlFor="price">Price</label>
                <AutoSaveInput
                  id="price"
                  value={formData.price || ''}
                  location="price"
                  onSave={(value) => handleSaveField('price', value)}
                  className="detail-input"
                />
              </div>

              <div className="detail-group">
                <label htmlFor="make">Make</label>
                <AutoSaveInput
                  id="make"
                  value={formData.make || ''}
                  location="make"
                  onSave={(value) => handleSaveField('make', value)}
                  className="detail-input"
                />
              </div>

              <div className="detail-group">
                <label htmlFor="model">Model</label>
                <AutoSaveInput
                  id="model"
                  value={formData.model || ''}
                  location="model"
                  onSave={(value) => handleSaveField('model', value)}
                  className="detail-input"
                />
              </div>

              <div className="detail-group">
                <label htmlFor="year">Year</label>
                <AutoSaveInput
                  id="year"
                  value={formData.year || ''}
                  location="year"
                  onSave={(value) => handleSaveField('year', value)}
                  className="detail-input"
                />
              </div>

              <div className="detail-group">
                <label htmlFor="miles">Miles</label>
                <AutoSaveInput
                  id="miles"
                  value={formData.miles || ''}
                  location="miles"
                  onSave={(value) => handleSaveField('miles', value)}
                  className="detail-input"
                />
              </div>

              <div className="detail-group">
                <label htmlFor="color">Color</label>
                <AutoSaveInput
                  id="color"
                  value={formData.color || ''}
                  location="color"
                  onSave={(value) => handleSaveField('color', value)}
                  className="detail-input"
                />
              </div>

              <div className="detail-group">
                <label htmlFor="transmission">Transmission</label>
                <AutoSaveInput
                  id="transmission"
                  value={formData.transmission || ''}
                  location="transmission"
                  onSave={(value) => handleSaveField('transmission', value)}
                  className="detail-input"
                />
              </div>

              <div className="detail-group">
                <label htmlFor="fuel-type">Fuel Type</label>
                <AutoSaveInput
                  id="fuel-type"
                  value={formData.fuel_type || ''}
                  location="fuel_type"
                  onSave={(value) => handleSaveField('fuel_type', value)}
                  className="detail-input"
                />
              </div>

              <div className="detail-group full-width">
                <label htmlFor="description">Description</label>
                <AutoSaveInput
                  id="description"
                  value={formData.description || ''}
                  location="description"
                  onSave={(value) => handleSaveField('description', value)}
                  className="detail-textarea"
                  type="textarea"
                  rows={4}
                />
              </div>

              <div className="detail-group full-width">
                <label htmlFor="note">Note</label>
                <AutoSaveInput
                  id="note"
                  value={formData.note || ''}
                  location="note"
                  onSave={(value) => handleSaveField('note', value)}
                  className="detail-textarea"
                  type="textarea"
                  rows={2}
                />
              </div>
            </div>
            <div className="detail-actions">
              <button className="delete-record-button" onClick={() => setShowDeleteConfirm(true)}>Delete</button>
              <button className="done-button" onClick={handleClose}>Done</button>
            </div>
            {showDeleteConfirm && (
              <Confirm
                message="Are you sure you want to delete this record?"
                onConfirm={handleDeleteRecord}
                onCancel={() => setShowDeleteConfirm(false)}
              />
            )}
            {showImageSourceDialog && (
              <ImageSourceDialog
                isOpen={showImageSourceDialog}
                onUpload={handleImageSourceUpload}
                onCamera={handleImageSourceCamera}
                onCancel={() => setShowImageSourceDialog(false)}
              />
            )}
          </div>
        ) : (
          <div className="error-state">
            <p>Failed to load car details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDisplay;
