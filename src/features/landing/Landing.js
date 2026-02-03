import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>Welcome to Auto Poster</h1>
        <p>Add cars with images to a database in a simple, streamlined way</p>
        <button className="cta-button" onClick={() => navigate('/search')}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Landing;
