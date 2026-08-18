import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // If the user is already logged in, redirect them to the dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
