import { API_BASE_URL, fetchWithAuth } from '../config';

// Polyfill for AbortSignal.timeout for browsers that don't support it
if (!AbortSignal.timeout) {
  AbortSignal.timeout = function timeout(ms) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  };
}

// Register fetchWithAuth globally for easy access
window.fetchWithAuth = fetchWithAuth;

// Utility function to try multiple endpoint formats
export const tryMultipleEndpoints = async (endpointFormats, params = {}, options = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const queryPart = queryString ? `?${queryString}` : '';
  
  let lastError = null;
  
  for (const format of endpointFormats) {
    try {
      const endpoint = `${format}${queryPart}`;
      
      // Add timeout to prevent hanging requests
      const signal = options.signal || AbortSignal.timeout(10000);
      const response = await fetchWithAuth(endpoint, { ...options, signal });
      
      return response;
    } catch (error) {
      lastError = error;
      // Continue to next endpoint format
    }
  }
  
  // If we get here, all endpoints failed
  throw lastError || new Error('All endpoints failed');
};

// Error handler function that catches common API errors
export const handleApiError = (error, entityName = 'resource') => {
  console.error(`API error while fetching ${entityName}:`, error);
  
  // Network errors
  if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
    return `Unable to connect to server. Please check your connection and try again.`;
  }
  
  // Timeout errors
  if (error.name === 'AbortError' || error.message.includes('timeout')) {
    return `Request timed out. The server is taking too long to respond.`;
  }
  
  // Authentication errors
  if (error.status === 401) {
    return `Authentication error. Please log in again.`;
  }
  
  if (error.status === 403) {
    return `You don't have permission to access this ${entityName}.`;
  }
  
  // Server errors
  if (error.status >= 500) {
    return `Server error. Our team has been notified and is working on a fix.`;
  }
  
  // Fallback error message
  return error.message || `Failed to load ${entityName}. Please try again later.`;
};

// Export for direct use in components
export { fetchWithAuth, API_BASE_URL };

export default {
  fetch: fetchWithAuth,
  tryMultipleEndpoints,
  handleApiError,
  baseUrl: API_BASE_URL
};
