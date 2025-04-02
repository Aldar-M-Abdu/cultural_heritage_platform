import React, { createContext, useContext } from 'react';
import authService from '../services/authService';
import useAuthStore from '../stores/authStore';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, isAuthenticated, role } = useAuthStore();

  const login = async (email, password) => {
    return await authService.login(email, password);
  };

  const logout = () => {
    authService.logout();
  };

  const updateProfile = async (userData) => {
    return await authService.updateUserProfile(userData);
  };

  const changePassword = async (passwordData) => {
    return await authService.changePassword(passwordData);
  };

  const value = {
    user,
    isAuthenticated,
    role,
    login,
    logout,
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