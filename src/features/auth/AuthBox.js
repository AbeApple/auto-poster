import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../global/supabase/Client';
import "./AuthBox.css"

const AuthBox = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('AuthBox: Starting authentication...', { isLogin, email });

    try {
      if (isLogin) {
        console.log('AuthBox: Attempting login...');
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        console.log('AuthBox: Login successful', data);
        navigate('/search');
      } else {
        console.log('AuthBox: Attempting sign up...');
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        console.log('AuthBox: Sign up successful', data);
        navigate('/search');
      }
    } catch (err) {
      console.error('AuthBox: Authentication error', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-box">
      <h2>{isLogin ? 'Log In' : 'Create Account'}</h2>
      <form onSubmit={handleAuth}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Log In' : 'Create Account'}
        </button>
      </form>
      <p>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          type="button"
          className="switch-button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
        >
          {isLogin ? 'Create Account' : 'Log In'}
        </button>
      </p>
    </div>
  );
};

export default AuthBox;
