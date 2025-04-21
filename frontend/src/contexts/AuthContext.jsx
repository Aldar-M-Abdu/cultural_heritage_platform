import React, { createContext, useContext, useEffect, useState } from 'react';
import useAuthStore from '../stores/authStore';
import { API_BASE_URL } from '../config';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { 
    user, 
    isAuthenticated, 
    isLoading: storeLoading, 
    error: storeError, 
    checkAuth,
    login: storeLogin,
    logout: storeLogout,
    register: storeRegister,
    updateProfile: storeUpdateProfile,
    changePassword: storeChangePassword,
    fetchUser
  } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add a utility function to verify and refresh token status
  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Array of endpoints to try - prioritize endpoints in this order
      const endpoints = [
        `${API_BASE_URL}/api/v1/auth/me`,
        `${API_BASE_URL}/api/v1/users/me`,
        `${API_BASE_URL}/api/v1/auth/current-user`,
        `${API_BASE_URL}/api/v1/auth/validate-token`
      ];
      
      // Try each endpoint with a short timeout
      for (const endpoint of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
          
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            try {
              const userData = await response.json();
              if (userData && userData.id) {
                useAuthStore.setState({ 
                  user: userData,
                  isAuthenticated: true,
                  token: token,
                  error: null
                });
                return true;
              } else {
                console.warn(`Response OK but invalid user data from ${endpoint}`);
              }
            } catch (jsonError) {
              console.warn(`Error parsing response from ${endpoint}:`, jsonError);
              // Continue to next endpoint
            }
          } else if (response.status === 422) {
            // Special handling for 422 Unprocessable Content errors which may indicate routing issues
            console.warn(`Received 422 from ${endpoint}, trying different endpoint`);
            continue;
          } else {
            // For debugging - try to get error content
            try {
              const errorText = await response.text();
              console.warn(`Error content from ${endpoint}:`, errorText);
            } catch (e) { /* ignore */ }
          }
          // If response not OK, continue to next endpoint
        } catch (error) {
          console.warn(`Error verifying token at ${endpoint}:`, error);
          // Continue to next endpoint
        }
      }
      
      // If we get here, all endpoints failed
      console.error('All token validation endpoints failed');
      
      // Only clear token if we received a clear 401/403 from an endpoint
      if (localStorage.getItem('clearToken') === 'true') {
        localStorage.removeItem('token');
        localStorage.removeItem('clearToken');
        useAuthStore.setState({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          error: 'Your session has expired. Please login again.'
        });
      }
      
      return false;
    } catch (error) {
      console.error('Error in verifyToken function:', error);
      
      // Don't clear token on network errors to allow retrying
      if (error.name === 'AbortError') {
        console.warn('Token verification timed out, will retry later');
        return false;
      }
      
      return false;
    }
  };

  // Initialize authentication state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          // Verify the token is still valid
          await verifyToken();
        }
      } catch (err) {
        console.error('Authentication initialization failed:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
    
    // Listen for auth expiration events
    const handleAuthExpired = () => {
      useAuthStore.setState({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        error: 'Your session has expired. Please login again.'
      });
    };
    
    window.addEventListener('auth:sessionExpired', handleAuthExpired);
    
    return () => {
      window.removeEventListener('auth:sessionExpired', handleAuthExpired);
    };
  }, [checkAuth]);

  const login = (credentials) => {
    try {
      setLoading(true);
      setError(null);
      return storeLogin(credentials)
        .catch(err => {
          // Format the error message consistently
          const errorMessage = err.response?.data?.detail || 
                            err.response?.data?.message || 
                            err.message || 
                            'Login failed';
          
          setError(errorMessage);
          
          // Add better error classification for logging
          if (err.response?.status === 401) {
            console.error('Authentication error: Invalid credentials', { status: err.response.status });
          } else if (err.response?.status === 404) {
            console.error('User not found error', { status: err.response.status });
          } else if (!err.response && err.message) {
            console.error('Network error during login:', err.message);
          } else {
            console.error('Unexpected login error:', err);
          }
          
          // Ensure we always have status in error objects we throw
          const errorStatus = err.status || 
                            err.response?.status || 
                            (err.name === 'TypeError' ? 'network_error' : 'unknown');
          
          throw Object.assign(new Error(errorMessage), { 
            originalError: err,
            status: errorStatus
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const register = (userData) => {
    try {
      setLoading(true);
      setError(null);
      return storeRegister(userData)
        .catch(err => {
          setError(err.message || 'Registration failed');
          throw err;
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    try {
      return storeLogout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateProfile = (userData) => {
    try {
      setLoading(true);
      setError(null);
      return storeUpdateProfile(userData)
        .catch(err => {
          setError(err.message || 'Profile update failed');
          throw err;
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const changePassword = (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      return storeChangePassword(passwordData)
        .catch(err => {
          setError(err.message || 'Password change failed');
          throw err;
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const value = {
    user,
    isAuthenticated,
    role: user?.role,
    loading: loading || storeLoading,
    error: error || storeError,
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    fetchUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};