import { create } from 'zustand';
import authService from '../services/authService';

// Helper function to initialize auth state from localStorage
const loadInitialState = () => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    return {
      token,
      user,
      isAuthenticated: !!token,
      isLoading: false,
      error: null
    };
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    };
  }
};

const useAuthStore = create((set, get) => ({
  ...loadInitialState(),

  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login(credentials);
      
      const { access_token, user } = response;
      
      localStorage.setItem('token', access_token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      set({
        token: access_token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return user;
    } catch (error) {
      set({ error: error.message || 'Authentication failed', isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ 
      token: null, 
      user: null, 
      isAuthenticated: false, 
      error: null 
    });
  },

  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.register(userData);
      const { access_token, user } = response;
      set({ 
        token: access_token, 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return user;
    } catch (error) {
      set({ 
        error: error.message || 'Registration failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  fetchUser: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch user';
      console.error('Error fetching user:', error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateProfile: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const updatedUser = await authService.updateProfile(userData);
      set({ user: updatedUser, isLoading: false });
      return updatedUser;
    } catch (error) {
      const errorMessage = error.message || 'Failed to update profile';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  changePassword: async ({ currentPassword, newPassword }) => {
    try {
      set({ isLoading: true, error: null });
      await authService.changePassword({ currentPassword, newPassword });
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message || 'Failed to change password', isLoading: false });
      throw error;
    }
  },

  requestPasswordReset: async (email) => {
    try {
      set({ isLoading: true, error: null });
      await authService.requestPasswordReset(email);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message || 'Failed to request password reset', isLoading: false });
      throw error;
    }
  },
  
  resetPassword: async (token, newPassword) => {
    try {
      set({ isLoading: true, error: null });
      await authService.resetPassword(token, newPassword);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message || 'Failed to reset password', isLoading: false });
      throw error;
    }
  }
}));

export default useAuthStore;

