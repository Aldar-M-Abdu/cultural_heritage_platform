import api from './api';

class AuthService {
  async login(credentials) {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await api.request('/auth/login', 'POST', formData, {
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    
    return response;
  }

  async register(userData) {
    return await api.post('/auth/user/create', userData);
  }

  async getCurrentUser() {
    return await api.get('/auth/me'); // Ensure this matches the backend endpoint
  }

  async logout() {
    try {
      await api.delete('/auth/logout');
    } catch (error) {
      // Log detailed error information
      console.error('Logout API call failed:', error.response?.data || error.message || error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async updateProfile(userData) {
    return await api.put('/auth/profile', userData);
  }

  async changePassword(passwordData) {
    return await api.post('/auth/change-password', passwordData);
  }

  async requestPasswordReset(email) {
    return await api.post('/auth/reset-password/request', { email });
  }

  async resetPassword(token, newPassword) {
    return await api.post('/auth/reset-password/confirm', { token, new_password: newPassword });
  }
}

const authService = new AuthService();
export default authService;


