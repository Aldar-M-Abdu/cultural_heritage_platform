// Configuration file for frontend settings

// API base URL - use environment variable if available, otherwise fallback to default
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Add other configuration constants as needed
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Cultural Heritage Platform';
export const API_TIMEOUT = 30000; // 30 seconds timeout for API calls

// Polyfill for AbortSignal.timeout for browsers that don't support it
if (typeof AbortSignal !== 'undefined' && !AbortSignal.timeout) {
  AbortSignal.timeout = function timeout(ms) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  };
}

// Helper function for API requests with authentication
export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Log a warning when trying to access protected routes without token
  if (!token && !endpoint.includes('/auth/token') && !endpoint.includes('/login') && !endpoint.includes('/register')) {
    console.warn('Attempting authenticated request without token:', endpoint);
  }
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  // For auth endpoints, respect the provided headers (needed for form data)
  const isAuthEndpoint = endpoint.includes('/auth/token') || 
                        endpoint.includes('/login') || 
                        endpoint.includes('/register');
  
  // For login/register endpoints, don't override headers if they were provided
  const finalHeaders = isAuthEndpoint && options.headers ? 
    options.headers : // Use provided headers for auth endpoints
    { ...defaultHeaders, ...options.headers }; // Merge headers for other endpoints

  const config = {
    ...options,
    headers: finalHeaders,
    credentials: 'include',
    mode: 'cors'
  };

  try {
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    // Add request timeout if not already provided
    let controller;
    let timeoutId;
    
    if (!options.signal) {
      controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
      config.signal = controller.signal;
    }
    
    // Only log in development mode
    if (import.meta.env.DEV) {
      console.log(`Fetching: ${fullUrl}`);
    }
    
    const response = await fetch(fullUrl, config);
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Handle token expiration
    if (response.status === 401 && !isAuthEndpoint) {
      console.warn('Authentication failed for request:', fullUrl);
      // Set flag to clear token after all validation attempts fail
      localStorage.setItem('clearToken', 'true');
      // Dispatch session expired event
      window.dispatchEvent(new Event('auth:sessionExpired'));
      throw new Error('Session expired. Please login again.');
    }
    
    // Handle other error responses
    if (!response.ok) {
      let errorMessage;
      
      try {
        // Try to parse error response as JSON
        if (response.headers.get('Content-Type')?.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || `Error (${response.status}): ${response.statusText}`;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || `Error (${response.status}): ${response.statusText}`;
        }
      } catch (e) {
        errorMessage = `Error (${response.status}): ${response.statusText}`;
      }
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }
    
    // Return appropriate response format
    if (response.status === 204) {
      return null; // No content
    }
    
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else if (contentType && contentType.includes('text/')) {
      return await response.text();
    }
    
    return response;
  } catch (error) {
    // Handle network errors and timeouts
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Request timed out. Please try again later.');
      timeoutError.status = 'timeout';
      throw timeoutError;
    }
    
    if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
      console.error('Network error:', error);
      const networkError = new Error('Network error. Please check your connection and try again.');
      networkError.status = 'network_error';
      throw networkError;
    }
    
    throw error;
  }
};
