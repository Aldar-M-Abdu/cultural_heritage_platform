import React, { createContext, useContext, useEffect, useState } from 'react';
import useAuthStore from '../stores/authStore';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { 
    user, 
    isAuthenticated, 
    isLoading: storeLoading, 
    error: storeError, 
    checkAuth,
    login: storeLogin,
    logout: storeLogout,
    register: storeRegister,
    updateProfile: storeUpdateProfile,
    changePassword: storeChangePassword,
    fetchUser
  } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize authentication state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        await checkAuth();
      } catch (err) {
        console.error('Authentication initialization failed:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      return await storeLogin(credentials);
    } catch (err) {
      // Format the error message consistently
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          err.message || 
                          'Login failed';
      
      setError(errorMessage);
      
      // Add better error classification for logging
      if (err.response?.status === 401) {
        console.error('Authentication error: Invalid credentials', { status: err.response.status });
      } else if (err.response?.status === 404) {
        console.error('User not found error', { status: err.response.status });
      } else if (!err.response && err.message) {
        console.error('Network error during login:', err.message);
      } else {
        console.error('Unexpected login error:', err);
      }
      
      // Ensure we always have status in error objects we throw
      const errorStatus = err.status || 
                          err.response?.status || 
                          (err.name === 'TypeError' ? 'network_error' : 'unknown');
      
      throw Object.assign(new Error(errorMessage), { 
        originalError: err,
        status: errorStatus
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      return await storeRegister(userData);
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await storeLogout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      return await storeUpdateProfile(userData);
    } catch (err) {
      setError(err.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      return await storeChangePassword(passwordData);
    } catch (err) {
      setError(err.message || 'Password change failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    role: user?.role,
    loading: loading || storeLoading,
    error: error || storeError,
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    fetchUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};