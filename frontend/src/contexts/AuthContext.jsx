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
    changePassword: storeChangePassword
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

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      return await storeLogin({ email, password });
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
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
    changePassword
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