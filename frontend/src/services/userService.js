import api from './api';

class UserService {
  async getUserProfile(userId) {
    return api.get(`/api/v1/users/${userId}`);
  }

  async updateUserProfile(userId, userData) {
    return api.put(`/api/v1/users/${userId}`, userData);
  }
}

const userService = new UserService();
export default userService;
