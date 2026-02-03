import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedCarData } from '../../global/redux/slices/DisplaySlice';
import './SearchList.css';

const SearchList = ({ car }) => {
  const dispatch = useDispatch();
  const firstImage = car.images && car.images.length > 0 ? car.images[0] : null;

  const handleClick = () => {
    console.log('SearchList: List item clicked, dispatching setSelectedCarData:', car);
    dispatch(setSelectedCarData(car));
  };

  return (
    <div className="car-list-item" onClick={handleClick}>
      <div className="car-list-cell reg-cell">{car.registration || '-'}</div>
      <div className="car-list-cell price-cell">{car.price ? `$${car.price}` : '-'}</div>
      <div className="car-list-cell make-cell">{car.make || '-'}</div>
      <div className="car-list-cell model-cell">{car.model || '-'}</div>
      <div className="car-list-cell year-cell">{car.year || '-'}</div>
      <div className="car-list-cell miles-cell">{car.miles ? `${car.miles}` : '-'}</div>
      <div className="car-list-cell color-cell">{car.color || '-'}</div>
      <div className="car-list-cell note-cell">{car.note || '-'}</div>
    </div>
  );
};

export default SearchList;
