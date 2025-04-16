import { API_BASE_URL } from './config';

const apiClient = {
  // Base fetch method with authentication and error handling
  async fetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };
    
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options.headers || {})
      }
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions);
      
      if (!response.ok) {
        // Try to parse error message
        const errorData = await response.json().catch(() => ({
          detail: `Request failed with status ${response.status}`
        }));
        
        throw new Error(errorData.detail || errorData.message || `Request failed with status ${response.status}`);
      }
      
      // Check if response is empty (e.g. for DELETE requests)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      console.error(`API Error: ${error.message}`);
      throw error;
    }
  },
  
  // Cultural items endpoints
  culturalItems: {
    getAll(params = {}) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      const queryString = queryParams.toString();
      return apiClient.fetch(`/api/v1/cultural-items${queryString ? `?${queryString}` : ''}`)
        .catch(error => {
          console.error('Error fetching cultural items:', error);
          return []; // Return empty array instead of throwing
        });
    },
    
    getFeatured() {
      return apiClient.fetch('/api/v1/cultural-items/featured')
        .catch(error => {
          console.error('Error fetching featured items:', error);
          return []; // Return empty array instead of throwing
        });
    },
    
    getRecent(limit = 3) {
      return apiClient.fetch(`/api/v1/cultural-items?sort_by=created_at&limit=${limit}`)
        .catch(error => {
          console.error('Error fetching recent items:', error);
          return []; // Return empty array instead of throwing
        });
    },
    
    getById(id) {
      return apiClient.fetch(`/api/v1/cultural-items/${id}`);
    },
    
    search(params = {}) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      const queryString = queryParams.toString();
      return apiClient.fetch(`/api/v1/cultural-items/search${queryString ? `?${queryString}` : ''}`);
    }
  },
  
  // Community endpoints
  communities: {
    getAll() {
      return apiClient.fetch('/api/v1/communities');
    },
    
    getById(id) {
      return apiClient.fetch(`/api/v1/communities/${id}`);
    },
    
    getBySlug(slug) {
      return apiClient.fetch(`/api/v1/communities/slug/${slug}`);
    },
    
    getDiscussions(id, params = {}) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      const queryString = queryParams.toString();
      const endpoint = `/api/v1/communities/${id}/discussions${queryString ? `?${queryString}` : ''}`;
      
      return apiClient.fetch(endpoint);
    }
  },
  
  // Discussion endpoints
  discussions: {
    getById(id) {
      return apiClient.fetch(`/api/v1/communities/discussions/${id}`);
    },
    
    create(communityId, data) {
      return apiClient.fetch(`/api/v1/communities/${communityId}/discussions`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    
    update(id, data) {
      return apiClient.fetch(`/api/v1/communities/discussions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    
    delete(id) {
      return apiClient.fetch(`/api/v1/communities/discussions/${id}`, {
        method: 'DELETE'
      });
    }
  },
  
  // Comment endpoints
  comments: {
    getForDiscussion(discussionId) {
      return apiClient.fetch(`/api/v1/communities/discussions/${discussionId}/comments`);
    },
    
    create(discussionId, data) {
      return apiClient.fetch(`/api/v1/communities/discussions/${discussionId}/comments`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    
    update(commentId, data) {
      return apiClient.fetch(`/api/v1/communities/comments/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    
    delete(commentId) {
      return apiClient.fetch(`/api/v1/communities/comments/${commentId}`, {
        method: 'DELETE'
      });
    }
  },
  
  // Blog endpoints
  blog: {
    getAll(params = {}) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      const queryString = queryParams.toString();
      return apiClient.fetch(`/api/v1/blog${queryString ? `?${queryString}` : ''}`);
    },
    
    getCategories() {
      return apiClient.fetch('/api/v1/blog/categories');
    },

    getById(id) {
      return apiClient.fetch(`/api/v1/blog/${id}`);
    }
  }
};

export default apiClient;
