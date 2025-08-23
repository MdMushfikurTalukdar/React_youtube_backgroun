// In your AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('authToken');
    const expiration = localStorage.getItem('tokenExpiration');
    const userData = localStorage.getItem('userData');
    
    if (token && expiration && userData) {
      // Check if token is still valid
      if (new Date().getTime() < parseInt(expiration)) {
        setAuthToken(token);
        setCurrentUser(JSON.parse(userData));
      } else {
        // Token expired, clear storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('tokenExpiration', new Date().getTime() + (24 * 60 * 60 * 1000));
    localStorage.setItem('userData', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('userData');
  };

  const value = {
    currentUser,
    authToken,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};