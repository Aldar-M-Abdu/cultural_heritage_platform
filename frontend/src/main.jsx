import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import App from './App'
import './index.css'
import { API_BASE_URL, fetchWithAuth } from './config'

// Configure API base URL - make sure this matches your backend
window.API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Add global fetch helper for authenticated requests
window.fetchWithAuth = fetchWithAuth;

// Add API request interceptor to handle session expiration
const originalFetch = window.fetch;
window.fetch = async function(url, options = {}) {
  try {
    const response = await originalFetch(url, options);
    
    // Check for 401 Unauthorized responses
    if (response.status === 401 && !url.includes('/auth/token')) {
      // Dispatch session expired event
      window.dispatchEvent(new Event('auth:sessionExpired'));
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)