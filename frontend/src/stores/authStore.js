import { create } from 'zustand';
import authService from '../services/authService';

const API_URL = import.meta.env.VITE_API_URL;

const loadInitialState = () => {
  const token = localStorage.getItem('token') || null;
  const user = JSON.parse(localStorage.getItem('user')) || null;
  
  return { 
    token, 
    user,
    isAuthenticated: !!token && !!user,
    isLoading: false,
    error: null
  };
};

const useAuthStore = create((set, get) => ({
  ...loadInitialState(),
  
  setToken: (token) => {
    localStorage.setItem('token', token);
    set(() => ({ token, isAuthenticated: !!token }));
  },
  
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set(() => ({ user }));
  },
  
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.login(credentials);
      
      if (!response || !response.access_token) {
        throw new Error('Invalid response from server');
      }

      let userData = response.user;
      
      if (!userData && response.access_token) {
        try {
          userData = await authService.getUserProfile(response.access_token);
        } catch (profileError) {
          console.error('Failed to fetch user profile:', profileError);
          userData = { username: credentials.username || credentials.email };
        }
      }
      
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      set({ 
        token: response.access_token, 
        user: userData,
        isAuthenticated: true,
        isLoading: false 
      });
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      set({ 
        error: error.message || 'Authentication failed', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
  
  register: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const formattedData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name || userData.username
      };
      
      const response = await authService.register(formattedData);
      set({ isLoading: false });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Registration failed';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw error;
    }
  },
  
  fetchUser: async () => {
    const { token, logout, setUser } = get();
    if (!token) return;
    
    set({ isLoading: true });
    
    try {
      const response = await fetch(`${API_URL}/general/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const userData = await response.json();
        setUser(userData);
      } else if (response.status === 401) {
        // Token expired or invalid
        logout();
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch user profile',
        isLoading: false 
      });
      console.error('Error fetching user profile:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.updateUserProfile(profileData);
      const updatedUser = { ...get().user, ...response };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ 
        user: updatedUser,
        isLoading: false 
      });
      
      return updatedUser;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to update profile', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  changePassword: async (passwordData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.changePassword(passwordData);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to change password', 
        isLoading: false 
      });
      throw error;
    }
  },
}));

export default useAuthStore;

