import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/login/', {
        username,
        password
      });
      
      console.log("API Full Response:", response);
      console.log("API Data:", response.data);

      // The API actually returns { access_token, refresh_token }
      if (response.data && response.data.access_token) {
        login(response.data.access_token, response.data.refresh_token);
        navigate('/dashboard');
      } else {
        setError('Login succeeded but token format is unrecognized. Check console for API response details.');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Show error from backend if available, otherwise generic
      setError(err.response?.data?.detail || err.response?.data?.error || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-card">
      {/* shield icon */}
      <div className="shield-wrap">
        <div className="shield-circle">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="42" height="42">
            <path d="M24 4L8 10V22C8 31.9 15.2 41.2 24 44C32.8 41.2 40 31.9 40 22V10L24 4Z" fill="#1a56db"/>
            <rect x="18" y="22" width="12" height="10" rx="2" fill="white"/>
            <path d="M21 22V19C21 17.3 22.3 16 24 16C25.7 16 27 17.3 27 19V22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="24" cy="27" r="1.5" fill="#1a56db"/>
          </svg>
        </div>
      </div>

      <h2 className="card-title">Welcome Back</h2>
      <p className="card-sub">Sign in to continue to Reyaansh Living PG</p>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      {/* form */}
      <form onSubmit={handleLogin}>
        <div className="field">
          <label className="field-label">Email or Mobile Number</label>
          <div className="input-wrap">
            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <input
              type="text"
              className="input"
              placeholder="Enter email address or 10-digit mobile number"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="field-label">Password</label>
          <div className="input-wrap">
            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="7" y="11" width="10" height="8" rx="2"/>
              <path d="M15 11V8a3 3 0 0 0-6 0v3"/>
            </svg>
            <input
              type={showPassword ? 'text' : 'password'}
              className="input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <button type="submit" className="login-btn" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
          {isLoading ? (
            'Logging in...'
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <rect x="7" y="11" width="10" height="8" rx="2"/>
                <path d="M15 11V8a3 3 0 0 0-6 0v3"/>
              </svg>
              Login Securely
            </>
          )}
        </button>
      </form>

      <div className="card-footer">
        <div className="ssl">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
          SSL Protected
        </div>
        <span className="sep">|</span>
        <span>Version 1.0</span>
      </div>
    </div>
  );
};

export default Login;
