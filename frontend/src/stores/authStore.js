import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Get API base URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      notifications: [],
      unreadNotificationsCount: 0,

      login: (credentials) => {
        // Multiple endpoint formats to try for login
        const loginEndpoints = [
          `${API_BASE_URL}/api/v1/auth/token`,
          `${API_BASE_URL}/auth/token`,
          `${API_BASE_URL}/api/auth/token`,
          `/api/v1/auth/token`
        ];
        
        // Create AbortController for the entire login process
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const tryLogin = async () => {
          let response = null;
          let lastError = null;
          
          // Try each endpoint until one works
          for (const endpoint of loginEndpoints) {
            try {
              console.log(`Trying login endpoint: ${endpoint}`);
              
              response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                  'username': credentials.email,
                  'password': credentials.password,
                }),
                credentials: 'include',
                signal: controller.signal
              });
              
              if (!response.ok) {
                // Handle specific HTTP status codes with custom messages
                if (response.status === 401) {
                  throw new Error('Invalid email or password. Please try again.');
                } else if (response.status === 403) {
                  throw new Error('Your account is locked. Please contact support.');
                } else if (response.status === 429) {
                  throw new Error('Too many login attempts. Please try again later.');
                } else if (response.status >= 500) {
                  throw new Error('Server error. Please try again later.');
                }
                
                // Try to get error details from response
                try {
                  const errorData = await response.json();
                  throw new Error(errorData?.detail || errorData?.message || `Error (${response.status}): ${response.statusText}`);
                } catch (jsonError) {
                  throw new Error(`Error (${response.status}): ${response.statusText}`);
                }
              }
              
              // If we get here, the endpoint worked
              break;
            } catch (error) {
              lastError = error;
              // If this isn't a server error, try the next endpoint
              if (!error.message.includes('Server error')) {
                console.warn(`Login endpoint ${endpoint} failed:`, error);
                continue;
              }
              throw error; // Rethrow server errors
            }
          }
          
          if (!response || !response.ok) {
            throw lastError || new Error('All login endpoints failed');
          }
          
          // Parse the successful response
          const data = await response.json();
          const token = data.access_token || data.token;
          
          if (!token) {
            throw new Error('Invalid response from server: missing token');
          }
          
          // Store token in localStorage and state
          localStorage.setItem('token', token);
          
          // Clear any previous auth errors
          set({ error: null, token });
          
          // Now fetch the user info
          const userEndpoints = [
            `${API_BASE_URL}/api/v1/auth/current-user`,
            `${API_BASE_URL}/api/v1/users/me`,
            `${API_BASE_URL}/api/v1/auth/me`,
            `/api/v1/users/me`
          ];
          
          let userData = null;
          
          for (const userEndpoint of userEndpoints) {
            try {
              console.log(`Trying user endpoint: ${userEndpoint}`);
              
              const userResponse = await fetch(userEndpoint, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                credentials: 'include',
                signal: controller.signal
              });
              
              if (!userResponse.ok) {
                if (userResponse.status === 401) {
                  localStorage.removeItem('token');
                  throw new Error('Authentication failed. Please login again.');
                } else if (userResponse.status === 404) {
                  localStorage.removeItem('token');
                  throw new Error('User account not found.');
                } else if (userResponse.status >= 500) {
                  // For server errors, we can still keep the token but report the error
                  throw new Error('Error loading user profile. Please try refreshing the page.');
                }
                throw new Error(`Failed to fetch user details (${userResponse.status})`);
              }
              
              userData = await userResponse.json();
              
              if (!userData || !userData.id) {
                localStorage.removeItem('token');
                throw new Error('Invalid user data received');
              }
              
              // Success! Break out of the loop
              break;
            } catch (error) {
              console.warn(`User endpoint ${userEndpoint} failed:`, error);
              // Continue to next endpoint unless it's an auth error
              if (error.message.includes('Authentication failed') || 
                  error.message.includes('User account not found') ||
                  error.message.includes('Invalid user data')) {
                throw error;
              }
            }
          }
          
          if (!userData) {
            throw new Error('Failed to fetch user profile. Please try again.');
          }
          
          // Set authentication state
          set({ 
            user: userData,
            token: token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return { user: userData, token: token };
        };
        
        set({ isLoading: true, error: null });
        
        return tryLogin()
          .catch(err => {
            console.error('Login error:', err);
            
            // Clear authentication state on error
            localStorage.removeItem('token');
            set({ 
              error: err.message || 'An error occurred during login. Please try again.', 
              isLoading: false,
              token: null,
              user: null,
              isAuthenticated: false
            });
            
            throw err;
          })
          .finally(() => {
            clearTimeout(timeoutId);
          });
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Create FormData object for multipart form data (needed for profile image)
          const formData = new FormData();
          formData.append('username', userData.username);
          formData.append('email', userData.email);
          formData.append('password', userData.password);
          
          if (userData.full_name) {
            formData.append('full_name', userData.full_name);
          }
          
          // Add profile image if provided
          if (userData.profileImage) {
            formData.append('profile_image', userData.profileImage);
          }
          
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
            method: 'POST',
            body: formData,
            // Don't set Content-Type header - browser will set it with boundary for FormData
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            const errorMessage = data.detail || data.message || 'Registration failed. Please try again.';
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
          }
          
          // Registration returns user data and automatically logs in
          localStorage.setItem('token', data.access_token);
          
          set({
            user: data,
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false
          });
          
          return data;
        } catch (err) {
          if (!err.response && !err.message.includes('failed')) {
            set({ error: 'Network error. Please check your connection.', isLoading: false });
            throw new Error('Network error. Please check your connection.');
          }
          
          set({ error: err.message || 'Registration failed', isLoading: false });
          throw err;
        }
      },

      fetchUser: async () => {
        const token = get().token || localStorage.getItem('token');
        if (!token) return;

        set({ isLoading: true, error: null });
        
        // Array of endpoints to try with improved error handling
        const endpoints = [
          `${API_BASE_URL}/api/v1/auth/current-user`,
          `${API_BASE_URL}/api/v1/auth/me`,
          `${API_BASE_URL}/api/v1/users/me`,
          // Add more fallbacks if needed
        ];
        
        let lastError = null;
        let userDataFetched = false;
        
        // Try each endpoint until one works
        for (const endpoint of endpoints) {
          if (userDataFetched) break;
          
          try {
            console.log(`Attempting to fetch user data from: ${endpoint}`);
            
            const response = await fetch(endpoint, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              credentials: 'include'
            });
                
            if (!response.ok) {
              const status = response.status;
              console.warn(`Failed response from ${endpoint}: ${status}`);
              
              // Special handling for 401 errors
              if (status === 401) {
                console.warn(`Unauthorized response from ${endpoint}: Token may be invalid`);
                
                // Try to get response text for better debugging
                const errorText = await response.text().catch(() => null);
                console.warn(`Error response content: ${errorText || 'No error content'}`);
                
                lastError = new Error(`Session expired. Please login again. (${endpoint})`);
                
                // Mark token for clearing upon failure of all endpoints
                localStorage.setItem('clearToken', 'true');
                continue; // Try next endpoint
              } else {
                lastError = new Error(`Failed to fetch user data: ${status} (${endpoint})`);
                continue; // Try next endpoint
              }
            }

            const userData = await response.json();
            console.log(`Successfully fetched user data from ${endpoint}`);
            
            if (!userData || !userData.id) {
              console.warn(`Invalid user data from ${endpoint}: missing ID`);
              lastError = new Error(`Invalid user data from ${endpoint}`);
              continue; // Try next endpoint
            }
            
            // Clear token removal marker if we succeed
            localStorage.removeItem('clearToken');
            
            set({ 
              user: userData, 
              isAuthenticated: true,
              token: token,
              isLoading: false,
              error: null
            });
            
            userDataFetched = true;
            return userData;
          } catch (err) {
            console.error(`Error fetching user data from ${endpoint}:`, err);
            lastError = err;
            // Continue to next endpoint
          }
        }
        
        // If we get here, all endpoints failed
        console.error('All user data endpoints failed');
        set({ 
          error: lastError?.message || 'Failed to fetch user data',
          isLoading: false 
        });
        
        if (localStorage.getItem('clearToken') === 'true' || 
            lastError?.message.includes('expired') || 
            lastError?.message.includes('401')) {
          localStorage.removeItem('token');
          localStorage.removeItem('clearToken');
          get().logout();
        }
        
        throw lastError || new Error('Failed to fetch user data');
      },

      uploadProfileImage: async (imageFile) => {
        const { user, token } = get();
        if (!user || !token) {
          throw new Error('You must be logged in to upload a profile image');
        }
        
        set({ isLoading: true, error: null });
        
        const formData = new FormData();
        formData.append('profile_image', imageFile);
        
        try {
          // Try multiple possible API endpoints
          const endpoints = [
            `${API_BASE_URL}/api/v1/users/${user.id}/profile-image`,
            `${API_BASE_URL}/api/v1/users/me/profile-image`,
            `${API_BASE_URL}/users/${user.id}/profile-image`
          ];
          
          let userData = null;
          let responseError = null;
          
          for (const endpoint of endpoints) {
            try {
              const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`
                },
                body: formData
              });
              
              if (response.ok) {
                userData = await response.json();
                break;
              } else {
                responseError = `Failed to upload profile image to ${endpoint}`;
              }
            } catch (err) {
              responseError = err.message;
              console.error(`Error uploading to ${endpoint}:`, err);
              // Continue to the next endpoint
            }
          }
          
          if (userData) {
            set({ 
              user: userData,
              error: null 
            });
            return userData;
          } else {
            throw new Error(responseError || 'Failed to upload profile image to any endpoint');
          }
        } catch (err) {
          set({ error: err.message });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      checkAuth: async () => {
        // Check if token exists in state or localStorage
        const token = get().token || localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return false;
        }
        
        // Set token from localStorage to state if not already there
        if (!get().token) {
          set({ token });
        }
        
        try {
          // Verify token by fetching current user
          await get().fetchUser();
          return true;
        } catch (error) {
          console.error('Token validation failed:', error);
          return false;
        }
      },

      logout: async () => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            // Try to revoke the token on the server
            await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }).catch(err => console.error('Logout error:', err));
          }
        } finally {
          // Always clear local state regardless of server response
          localStorage.removeItem('token');
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false,
            error: null
          });
        }
      },

      clearError: () => set({ error: null }),

      fetchNotifications: async (unreadOnly = false, page = 1, limit = 20) => {
        const { isAuthenticated, token } = get();
        if (!isAuthenticated || !token) return [];
        
        try {
          set({ isLoading: true });
          const queryParams = `unread_only=${unreadOnly}&skip=${(page-1)*limit}&limit=${limit}`;
          
          const response = await fetch(`${API_BASE_URL}/api/v1/notifications/?${queryParams}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const notifications = await response.json();
            const notificationsWithMedia = await Promise.all(notifications.map(async notification => {
              if (notification.cultural_item_id) {
                try {
                  const mediaResponse = await fetch(
                    `${API_BASE_URL}/api/v1/cultural-items/${notification.cultural_item_id}/media?limit=1`,
                    {
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    }
                  );
                  if (mediaResponse.ok) {
                    const media = await mediaResponse.json();
                    if (media && media.length > 0) {
                      return { ...notification, media_thumbnail: media[0].url };
                    }
                  }
                } catch (mediaError) {
                  console.error('Error fetching media for notification:', mediaError);
                }
              }
              return notification;
            }));
            
            set({ notifications: notificationsWithMedia, isLoading: false });
            return notificationsWithMedia;
          } else {
            console.error('Failed to fetch notifications. Status:', response.status);
            set({ isLoading: false });
            return [];
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
          set({ isLoading: false });
          return [];
        }
      },

      fetchUnreadNotificationsCount: async () => {
        const { isAuthenticated, token } = get();
        if (!isAuthenticated || !token) return 0;
        
        try {
          // Try multiple possible endpoints for notifications count
          const endpoints = [
            `${API_BASE_URL}/api/v1/notifications/unread-count`,
            `${API_BASE_URL}/api/v1/users/notifications/unread-count`,
            `${API_BASE_URL}/notifications/unread-count`,
            // Add these additional endpoints to try
            `${API_BASE_URL}/api/v1/notifications/count`,
            `${API_BASE_URL}/api/v1/user/notifications/count`
          ];
          
          let countData = null;
          
          for (const endpoint of endpoints) {
            try {
              console.log(`Attempting to fetch notification count from: ${endpoint}`);
              const response = await fetch(endpoint, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              if (response.ok) {
                const data = await response.json();
                set({ unreadNotificationsCount: data.unread_count || data.count || 0 });
                console.log(`Successfully fetched notification count from ${endpoint}`);
                return data.unread_count || data.count || 0;
              } else {
                console.warn(`Failed to fetch from ${endpoint}: ${response.status} ${response.statusText}`);
              }
            } catch (error) {
              console.error(`Error fetching notification count from ${endpoint}:`, error);
              // Continue to the next endpoint
            }
          }
          
          return get().unreadNotificationsCount || 0; // Return existing count if all endpoints fail
        } catch (error) {
          console.error('Error fetching notification count:', error);
          return get().unreadNotificationsCount || 0;
        }
      },

      fetchNotificationPreferences: async () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) return null;
        
        try {
          let response;
          let error;
          
          try {
            response = await fetch(`${API_BASE_URL}/api/v1/users/notification-preferences`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              return data;
            }
          } catch (e) {
            error = e;
          }
          
          try {
            response = await fetch(`${API_BASE_URL}/api/v1/user/notification-preferences`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              return data;
            }
          } catch (e) {
            error = error || e;
          }
          
          try {
            response = await fetch(`${API_BASE_URL}/api/v1/notifications/preferences`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              return data;
            }
          } catch (e) {
            error = error || e;
          }
          
          console.warn('Could not fetch notification preferences, using defaults');
          return {
            emailNotifications: true,
            pushNotifications: true,
            commentNotifications: true,
            favoriteNotifications: true,
            systemUpdates: true
          };
        } catch (error) {
          console.error('Error fetching notification preferences:', error);
          return {
            emailNotifications: true,
            pushNotifications: true,
            commentNotifications: true,
            favoriteNotifications: true,
            systemUpdates: true
          };
        }
      },

      updateNotificationPreferences: async (preferences) => {
        let response;
        let error = null;
        
        try {
          try {
            response = await fetch(`${API_BASE_URL}/api/v1/users/notification-preferences`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(preferences)
            });
            
            if (response.ok) return true;
          } catch (e) {
            error = e;
          }
          
          try {
            response = await fetch(`${API_BASE_URL}/api/v1/user/notification-preferences`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(preferences)
            });
            
            if (response.ok) return true;
          } catch (e) {
            error = error || e;
          }
          
          try {
            response = await fetch(`${API_BASE_URL}/api/v1/notifications/preferences`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(preferences)
            });
            
            if (response.ok) return true;
            
            // If we reach here, none of the endpoints succeeded with an OK response
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.detail || errorData.message || 'Failed to update notification preferences';
            const error = new Error(errorMessage);
            error.status = response.status;
            error.data = errorData;
            throw error;
          } catch (e) {
            // Add status from response object if available
            if (response && !e.status) {
              e.status = response.status;
            }
            throw error || e;
          }
        } catch (error) {
          // Ensure error always has a status property
          if (!error.status && response) {
            error.status = response.status;
          }
          throw error;
        }
      },

      markNotificationAsRead: async (notificationId) => {
        const { isAuthenticated, fetchUnreadNotificationsCount } = get();
        if (!isAuthenticated) return false;
        
        try {
          let response = await fetch(`${API_BASE_URL}/api/v1/notifications/${notificationId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ is_read: true })
          });
          
          if (response.status === 404) {
            response = await fetch(`${API_BASE_URL}/api/v1/users/notifications/${notificationId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ is_read: true })
            });
          }
          
          if (!response.ok) return false;
          
          const { notifications } = get();
          const updatedNotifications = notifications.map(n => 
            n.id === notificationId ? { ...n, is_read: true } : n
          );
          set({ notifications: updatedNotifications });
          
          await fetchUnreadNotificationsCount();
          return true;
        } catch (error) {
          console.error('Error marking notification as read:', error);
          return false;
        }
      },

      markAllNotificationsAsRead: async () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) return false;
        
        try {
          let response = await fetch(`${API_BASE_URL}/api/v1/notifications/mark-all-read`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.status === 404) {
            response = await fetch(`${API_BASE_URL}/api/v1/users/notifications/mark-all-read`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
          }
          
          if (!response.ok) return false;
          
          const { notifications } = get();
          const updatedNotifications = notifications.map(n => ({ ...n, is_read: true }));
          set({ 
            notifications: updatedNotifications, 
            unreadNotificationsCount: 0 
          });
          
          return true;
        } catch (error) {
          console.error('Error marking all notifications as read:', error);
          return false;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;

