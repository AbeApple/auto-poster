import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../global/supabase/Client';
import './AutoLogin.css';

const AutoLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const email = searchParams.get('email');
    const password = searchParams.get('password');

    if (!email || !password) {
      console.log('AutoLogin: Missing email or password, redirecting to auth');
      navigate('/auth');
      return;
    }

    console.log('AutoLogin: Attempting auto-login for', email);

    const performLogin = async () => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('AutoLogin: Login failed', error);
          navigate('/auth?error=login_failed');
        } else {
          console.log('AutoLogin: Login successful', data);
          navigate('/search');
        }
      } catch (error) {
        console.error('AutoLogin: Login error', error);
        navigate('/auth?error=login_error');
      }
    };

    performLogin();
  }, [searchParams, navigate]);

  return (
    <div className="auto-login">
      <div className="auto-login-content">
        <div className="loading-spinner"></div>
        <p>Logging in...</p>
      </div>
    </div>
  );
};

export default AutoLogin;
