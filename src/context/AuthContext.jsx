import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    // If token changes (e.g. login or logout), update state
    setIsAuthenticated(!!token);
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }, [token]);

  const login = (accessToken, refreshToken) => {
    setToken(accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  };

  const logout = async () => {
    // Keep a reference to the token if the API needs it
    const currentToken = localStorage.getItem('access_token');
    
    // Instantly clear client-side state so UI updates immediately
    setToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    try {
      await api.post('/api/logout', {}, {
        headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : {}
      });
    } catch (error) {
      console.error('Logout API failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
