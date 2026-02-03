import React from 'react';
import AuthBox from './AuthBox';
import './AuthPage.css';

const AuthPage = () => {
  console.log('AuthPage: Rendering auth page');
  return (
    <div className="auth-page">
      <AuthBox />
    </div>
  );
};

export default AuthPage;
