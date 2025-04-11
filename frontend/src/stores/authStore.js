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
        set({ isLoading: true, error: null });
        
        return fetch(`${API_BASE_URL}/api/v1/auth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            'username': credentials.email,
            'password': credentials.password,
          }),
          credentials: 'include'
        })
        .then(response => {
          // First check if the response is ok
          if (!response.ok) {
            // Parse the error response
            return response.json().then(data => {
              const errorMessage = data.detail || data.message || 'Invalid email or password. Please try again.';
              set({ 
                error: errorMessage, 
                isLoading: false,
                user: null,
                token: null,
                isAuthenticated: false
              });
              throw new Error(errorMessage);
            }).catch(err => {
              // If JSON parsing fails, use status text
              const errorMessage = `Authentication failed (${response.status}): ${response.statusText}`;
              set({ 
                error: errorMessage, 
                isLoading: false,
                user: null,
                token: null,
                isAuthenticated: false
              });
              throw new Error(errorMessage);
            });
          }
          
          // For successful response, parse the JSON
          return response.json();
        })
        .then(data => {
          // Handle successful login with database token
          const token = data.access_token;
          
          // Validate token format before storing
          if (!token || typeof token !== 'string' || token.length < 10) {
            const errorMessage = 'Invalid token received from server';
            set({ 
              error: errorMessage, 
              isLoading: false,
              user: null,
              token: null,
              isAuthenticated: false
            });
            throw new Error(errorMessage);
          }
          
          // Store token in localStorage
          localStorage.setItem('token', token);
          
          // Fetch user data with the token
          return fetch(`${API_BASE_URL}/api/v1/auth/current-user`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          })
          .then(userResponse => {
            if (!userResponse.ok) {
              // Clear token if user data fetch fails
              localStorage.removeItem('token');
              const status = userResponse.status;
              if (status === 401) {
                throw new Error('Token authentication failed. Please login again.');
              }
              throw new Error(`Failed to fetch user details (${status})`);
            }
            return userResponse.json();
          })
          .then(userData => {
            // Ensure we have user data before confirming authentication
            if (!userData || !userData.id) {
              localStorage.removeItem('token');
              throw new Error('Invalid user data received');
            }
            
            // Set authentication state
            set({ 
              user: userData,
              token: token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            
            console.log('Authentication successful:', { userId: userData.id, tokenPresent: !!token });
            return { user: userData, token: token };
          });
        })
        .catch(err => {
          console.error('Login error:', err);
          // Ensure authentication state is cleared on error
          set({ 
            error: err.message || 'An error occurred during login. Please try again.', 
            isLoading: false,
            token: null,
            user: null,
            isAuthenticated: false
          });
          throw err;
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
        const { token } = get();
        if (!token) return;

        set({ isLoading: true, error: null });
        try {
            const endpoint = `${API_BASE_URL}/api/v1/auth/current-user`;
            
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
                
            if (!response.ok) {
                if (response.status === 401) {
                    get().logout();
                    throw new Error('Session expired. Please login again.');
                } else {
                    throw new Error(`Failed to fetch user data: ${response.status}`);
                }
            }

            const userData = await response.json();
            set({ 
                user: userData, 
                isAuthenticated: true,
                isLoading: false 
            });
            return userData;
        } catch (err) {
            console.error('Error fetching user data:', err);
            set({ 
                error: err.message || 'Failed to fetch user data',
                isLoading: false 
            });
            if (err.message.includes('expired') || err.message.includes('401')) {
                get().logout();
            }
        }
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
        // Check if token exists
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return false;
        }
        
        // Set token from localStorage
        set({ token });
        
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

