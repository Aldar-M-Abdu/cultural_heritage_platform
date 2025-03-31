import api from './api';

class ItemsService {
  async getAllItems(params = {}) {
    try {
      const response = await api.get('/items', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch items:', error);
      throw error;
    }
  }

  async getItemById(id) {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch item with id ${id}:`, error);
      throw error;
    }
  }

  async createItem(itemData) {
    try {
      const response = await api.post('/items', itemData);
      return response.data;
    } catch (error) {
      console.error('Failed to create item:', error);
      throw error;
    }
  }

  async updateItem(id, itemData) {
    try {
      const response = await api.put(`/items/${id}`, itemData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update item with id ${id}:`, error);
      throw error;
    }
  }

  async deleteItem(id) {
    try {
      const response = await api.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete item with id ${id}:`, error);
      throw error;
    }
  }

  async getUserContributions(userId) {
    try {
      const response = await api.get(`/items/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch user contributions:`, error);
      throw error;
    }
  }
}

export const itemsService = new ItemsService();
export default itemsService;
