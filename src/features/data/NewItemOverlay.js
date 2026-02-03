import React from 'react';
import './NewItemOverlay.css';

const NewItemOverlay = ({ onClose, onAddCar }) => {
  const handleSubmit = () => {
    const name = document.querySelector('#name')?.value || '';
    const make = document.querySelector('#make')?.value || '';
    const year = document.querySelector('#year')?.value || '';
    console.log('NewItemOverlay: Submitting new car', { name, make, year });
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-header">
          <h2 className="overlay-title">Add New Car</h2>
          <button className="close-button" onClick={onClose}>
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

        <div className="overlay-form">
          <div className="form-group">
            <label htmlFor="name">Car Name</label>
            <input
              type="text"
              id="name"
              placeholder="e.g., Mustang GT"
            />
          </div>

          <div className="form-group">
            <label htmlFor="make">Make</label>
            <input
              type="text"
              id="make"
              placeholder="e.g., Ford"
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input
              type="text"
              id="year"
              placeholder="e.g., 2024"
            />
          </div>

          <div className="form-actions">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button className="submit-button" onClick={handleSubmit}>
              Add Car
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewItemOverlay;
