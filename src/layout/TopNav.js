import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTopMenuOpen } from '../global/redux/slices/DisplaySlice';
import './TopNav.css';

const TopNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <nav className="top-nav">
      <div className="nav-content">
        <h1 className="nav-logo" onClick={() => navigate('/')}>
          Auto Poster
        </h1>
        <div className="nav-right">
          <div className="topnav-button" onClick={() => dispatch(setTopMenuOpen(true))}>
            ☰
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
