import api from './api';

const itemsService = {
  getItems: async (params = {}) => {
    // Filter out empty query parameters
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== "")
    );
    const query = new URLSearchParams(filteredParams).toString();
    return await api.get(`/cultural-items?${query}`);
  },

  getItem: async (id) => {
    // Renamed from getItemById to match the call in ItemDetailPage
    return await api.get(`/cultural-items/${id}`);
  },

  createItem: async (itemData) => {
    return await api.post('/cultural-items', itemData);
  },

  updateItem: async (id, itemData) => {
    return await api.put(`/cultural-items/${id}`, itemData);
  },

  deleteItem: async (id) => {
    return await api.delete(`/cultural-items/${id}`);
  },

  getFeaturedItems: async () => {
    return await api.get('/cultural-items/featured');
  },
};

export { itemsService };
export default itemsService;
