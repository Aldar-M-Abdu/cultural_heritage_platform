import axios from 'axios';

const API_URL ='http://localhost:8090/v1';

const authService = {
  // Login method
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data && response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        const userProfile = await authService.getUserProfile(response.data.access_token);
        localStorage.setItem('user', JSON.stringify(userProfile));
        return userProfile;
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error.response || error);
      throw error;
    }
  },
  
  // Register method
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response || error);
      throw error;
    }
  },
  
  // Get user profile
  getUserProfile: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get user profile error:', error.response || error);
      throw error;
    }
  },
  
  // Update user profile
  updateUserProfile: async (profileData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `${API_URL}/users/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error.response || error);
      throw error;
    }
  },
  
  // Change password
  changePassword: async (passwordData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${API_URL}/auth/change-password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Change password error:', error.response || error);
      throw error;
    }
  },
  
  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService;


