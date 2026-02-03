import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTopMenuOpen } from '../global/redux/slices/DisplaySlice';
import './TopMenu.css';

const TopMenu = () => {
  const topMenuOpen = useSelector(state => state.display.topMenuOpen);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    dispatch(setTopMenuOpen(false));
  };

  return (
    <div className={`top-menu ${topMenuOpen ? 'top-menu-open' : ''}`}>
      <div className="top-menu-content">
        <div className="top-menu-header">
          <h2 className="top-menu-title">Menu</h2>
          <button className="top-menu-close" onClick={handleClose}>
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
        <div className="top-menu-items">
          <button className="top-menu-item" onClick={() => { navigate('/search'); handleClose(); }}>
            Search
          </button>
          {user ? (
            <button className="top-menu-item" onClick={() => { navigate('/profile'); handleClose(); }}>
              Profile
            </button>
          ) : (
            <button className="top-menu-item" onClick={() => { navigate('/auth'); handleClose(); }}>
              Log In / Sign Up
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopMenu;
