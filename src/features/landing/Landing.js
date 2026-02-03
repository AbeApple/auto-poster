import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>Welcome to Auto Poster</h1>

        <div className="instructions">
          <h2>How to Use</h2>
          <ol className="steps">
            <li>Click "Create New" to add a new car</li>
            <li>Add registration number and mileage</li>
            <li>Add pictures using camera or file upload</li>
            <li>View and manage your cars in the search page</li>
          </ol>

          <div className="additional-info">
            <p>Click on any car to view or modify its details</p>
            <p>Download images with the reg number as the folder name for organization</p>
          </div>
        </div>

        <button className="cta-button" onClick={() => navigate('/search')}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Landing;
