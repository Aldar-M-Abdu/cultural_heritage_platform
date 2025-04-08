// Configuration file for frontend settings

// API base URL - use environment variable if available, otherwise fallback to default
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Add other configuration constants as needed
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Cultural Heritage Platform';
export const API_TIMEOUT = 30000; // 30 seconds timeout for API calls
