import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../../global/redux/slices/UserSlice';
import Confirm from '../../util/Confirm';
import './Profile.css';

const Profile = () => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    console.log('Profile: Logging out');
    dispatch(clearUser());
    setShowLogoutConfirm(false);
  };

  const handleGoToSearch = () => {
    console.log('Profile: Going to search page');
    navigate('/search');
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      {user ? (
        <div className="profile-content">
          <p className="profile-text">Logged in as: <span className="profile-email">{user.email}</span></p>
          <div>
            <button className="profile-button" onClick={() => setShowLogoutConfirm(true)}>Logout</button>
          </div>
          <div>
            <button className="profile-button" onClick={handleGoToSearch}>Go to Search</button>
          </div>
        </div>
      ) : (
        <div className="profile-content">
          <p className="profile-text">Not logged in</p>
        </div>
      )}
      {showLogoutConfirm && (
        <Confirm
          message="Are you sure you want to logout?"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  );
};

export default Profile;
