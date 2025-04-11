// Configuration file for frontend settings

// API base URL - use environment variable if available, otherwise fallback to default
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Add other configuration constants as needed
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Cultural Heritage Platform';
export const API_TIMEOUT = 30000; // 30 seconds timeout for API calls

// Helper function for API requests with authentication
export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    credentials: 'include' // Always include credentials
  };

  try {
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(fullUrl, config);
    
    // Handle token expiration
    if (response.status === 401) {
      // Clear auth state only if it's not a login endpoint
      if (!endpoint.includes('/auth/token')) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('auth:sessionExpired'));
        throw new Error('Session expired. Please login again.');
      }
    }
    
    // Handle other error responses
    if (!response.ok) {
      // Get detailed error message from response
      let errorMessage;
      try {
        if (response.headers.get('Content-Type')?.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || `Request failed with status: ${response.status}`;
        } else {
          errorMessage = `Request failed with status: ${response.status} ${response.statusText}`;
        }
      } catch (parseError) {
        errorMessage = `Request failed with status: ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }
    
    // Return appropriate response format
    if (response.status === 204) {
      return null; // No content
    } else if (response.headers.get('Content-Type')?.includes('application/json')) {
      return await response.json();
    }
    
    return response;
  } catch (error) {
    // Improve error classification
    if (error.message === 'Failed to fetch') {
      console.error('Network error:', error);
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};
