import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      // This would be an API call in a real application
      // For now, simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUser = {
        id: 1,
        username: credentials.email.split('@')[0],
        email: credentials.email,
        first_name: 'Demo',
        last_name: 'User',
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-jwt-token');
      
      set({ 
        user: mockUser,
        isAuthenticated: true,
        isLoading: false 
      });
      
      return true;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to log in. Please check your credentials.',
        isLoading: false 
      });
      return false;
    }
  },
  
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      // This would be an API call in a real application
      // For now, simulate a successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: 1,
        username: userData.username,
        email: userData.email,
        first_name: userData.firstName || '',
        last_name: userData.lastName || '',
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-jwt-token');
      
      set({ 
        user: mockUser,
        isAuthenticated: true,
        isLoading: false 
      });
      
      return true;
    } catch (error) {
      set({ 
        error: error.message || 'Registration failed. Please try again.',
        isLoading: false 
      });
      return false;
    }
  },
  
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ 
      user: null,
      isAuthenticated: false 
    });
  },
  
  updateUser: (userData) => {
    const updatedUser = { ...useAuthStore.getState().user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },
  
  clearError: () => set({ error: null })
}));

export default useAuthStore;

