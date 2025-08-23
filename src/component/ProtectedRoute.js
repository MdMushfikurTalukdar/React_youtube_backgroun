// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { authToken } = useAuth();
  
  // Check if token exists and is valid
  const token = localStorage.getItem('authToken');
  const expiration = localStorage.getItem('tokenExpiration');
  
  const isAuthenticated = token && expiration && new Date().getTime() < parseInt(expiration);
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;