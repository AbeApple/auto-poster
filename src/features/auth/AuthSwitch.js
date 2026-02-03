import React from 'react';
import { useSelector } from 'react-redux';
import AuthPage from './AuthPage';

const AuthSwitch = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  console.log('AuthSwitch: Checking user state', { user });

  if (!user) {
    console.log('AuthSwitch: No user found, showing auth page');
    return <AuthPage />;
  }

  console.log('AuthSwitch: User found, showing protected content');
  return <>{children}</>;
};

export default AuthSwitch;
