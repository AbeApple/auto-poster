import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../global/redux/slices/UserSlice';
import './Profile.css';

const Profile = () => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    console.log('Profile: Logging out');
    dispatch(clearUser());
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      {user ? (
        <div className="profile-content">
          <p className="profile-text">Logged in as: <span className="profile-email">{user.email}</span></p>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="profile-content">
          <p className="profile-text">Not logged in</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
