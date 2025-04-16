import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './utils/api'; // Import API utilities with global fetch wrapper
import './index.css';

// Polyfill for CustomEvent in older browsers
(function () {
  if (typeof window.CustomEvent === "function") return false;
  
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: null };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  
  window.CustomEvent = CustomEvent;
})();

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Check if it's an auth error
  if (event.reason && 
      (event.reason.message?.includes('session expired') || 
       event.reason.message?.includes('authentication failed') ||
       event.reason.status === 401)) {
    console.warn('Authentication error detected in unhandled rejection');
    window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);