import useAuthStore from '../stores/authStore';

class ApiService {
  constructor() {
    this.baseURL = '/api/v1';
  }

  getHeaders(customHeaders = {}) {
    // Get token from localStorage for requests
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request(endpoint, method = 'GET', data = null, customHeaders = {}) {
    const url = `${this.baseURL}${endpoint}`; // Ensure baseURL is correct
    const options = {
      method,
      headers: this.getHeaders(customHeaders),
      credentials: 'include',
    };

    if (data) {
      if (options.headers['Content-Type'] === 'application/json') {
        options.body = JSON.stringify(data);
      } else {
        options.body = data;
      }
    }

    try {
      const response = await fetch(url, options);

      // Handle session expiration
      if (response.status === 401) {
        window.dispatchEvent(new Event('auth:sessionExpired'));
        return Promise.reject(new Error('Session expired'));
      }

      if (!response.ok) {
        const contentType = response.headers.get('Content-Type');
        let errorData;

        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json().catch(() => ({}));
        } else {
          errorData = { message: await response.text() };
        }

        console.error(`API Error: ${response.status} - ${response.statusText}`, errorData);
        return Promise.reject(errorData);
      }

      // For responses with no content
      if (response.status === 204) {
        return;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      return Promise.reject(error);
    }
  }

  // Helper methods for different request types
  async get(endpoint, customHeaders = {}) {
    return this.request(endpoint, 'GET', null, customHeaders);
  }

  async post(endpoint, data, customHeaders = {}) {
    return this.request(endpoint, 'POST', data, customHeaders);
  }

  async put(endpoint, data, customHeaders = {}) {
    return this.request(endpoint, 'PUT', data, customHeaders);
  }

  async delete(endpoint, customHeaders = {}) {
    try {
      return await this.request(endpoint, 'DELETE', null, customHeaders);
    } catch (error) {
      // Ensure error details are propagated
      if (error instanceof Response) {
        const errorData = await error.json().catch(() => ({}));
        return Promise.reject({ status: error.status, ...errorData });
      }
      return Promise.reject(error);
    }
  }
}

export default new ApiService();
