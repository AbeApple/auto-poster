import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedCarData } from '../../global/redux/slices/DisplaySlice';
import './SearchTile.css';

const SearchTile = ({ car }) => {
  const dispatch = useDispatch();
  const firstImage = car.images && car.images.length > 0 ? car.images[0] : null;

  const handleClick = () => {
    console.log('SearchTile: Tile clicked, dispatching setSelectedCarData:', car);
    dispatch(setSelectedCarData(car));
  };

  return (
    <div className="car-tile" onClick={handleClick}>
      <div className="car-tile-image">
        {firstImage ? (
          <img src={firstImage} alt={car.registration} onError={(e) => console.error('SearchTile: Image load error:', e)} />
        ) : (
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--primary-color)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        )}
      </div>
      <div className="car-tile-bar">
        <p className="car-tile-reg">{car.registration || 'N/A'}</p>
        <p className="car-tile-name">{car.make || 'Unknown'} {car.year || ''}</p>
      </div>
    </div>
  );
};

export default SearchTile;
