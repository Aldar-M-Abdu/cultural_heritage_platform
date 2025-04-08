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

      login: async ({ email, password, rememberMe }) => {
        set({ isLoading: true, error: null });
        
        try {
          // Use the correct endpoint (/token instead of /login)
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            // Use URLSearchParams to format data as form fields
            // Also, send email as username since backend expects 'username'
            body: new URLSearchParams({
              'username': email, // Map email to username parameter
              'password': password,
            }),
            credentials: 'include'
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            // Create error with status code
            const error = new Error(data.detail || data.message || 'Invalid email or password. Please try again.');
            error.status = response.status;
            error.data = data;
            throw error;
          }
          
          // Extract token from the response
          const { access_token, token } = data;
          const authToken = access_token || token || data.access;
          
          if (!authToken) {
            throw new Error('No token received from server');
          }
          
          // Store token in localStorage if rememberMe is true
          if (rememberMe) {
            localStorage.setItem('token', authToken);
            localStorage.setItem('persistAuth', 'true');
          } else {
            localStorage.removeItem('persistAuth');
          }
          
          // Update state
          set({ 
            token: authToken, 
            isAuthenticated: true,
            isLoading: false
          });
          
          // Fetch user data
          await get().fetchUser();
          
          return true;
        } catch (error) {
          // Make sure error always has a status
          if (!error.status) {
            error.status = error.name === 'TypeError' ? 'network_error' : 'unknown';
          }
          
          set({ 
            isLoading: false, 
            error: error.message || 'Authentication failed',
            isAuthenticated: false,
            token: null,
            user: null
          });
          
          throw error;
        }
      },

      fetchUser: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoading: true, error: null });
        try {
            // Try multiple possible API endpoints
            const endpoints = [
                `${API_BASE_URL}/api/v1/users/me`,
                `${API_BASE_URL}/api/v1/auth/current-user`,
                `${API_BASE_URL}/users/me`
            ];
            
            let userData = null;
            let responseError = null;
            
            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(endpoint, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (response.ok) {
                        userData = await response.json();
                        break;
                    } else if (response.status === 401) {
                        get().logout();
                        throw new Error('Session expired. Please login again.');
                    } else {
                        responseError = `Failed to fetch user data from ${endpoint}`;
                    }
                } catch (err) {
                    responseError = err.message;
                    console.error(`Error fetching from ${endpoint}:`, err);
                    // Continue to the next endpoint
                }
            }
            
            if (userData) {
                set({ 
                    user: userData,
                    isAuthenticated: true,
                    error: null 
                });
                return userData;
            } else {
                throw new Error(responseError || 'Failed to fetch user data from any endpoint');
            }
        } catch (err) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ isLoading: false });
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
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return false;
        }

        try {
          await get().fetchUser();
          return true;
        } catch (error) {
          return false;
        }
      },

      logout: async () => {
        // Try to revoke the token on the server
        try {
          const { token } = get();
          if (token) {
            await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
          }
        } catch (error) {
          console.error("Error during logout:", error);
        }

        // Always clear local state regardless of server response
        localStorage.removeItem('token');
        localStorage.removeItem('persistAuth');
        set({ 
          token: null, 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
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
            `${API_BASE_URL}/notifications/unread-count`
          ];
          
          let countData = null;
          
          for (const endpoint of endpoints) {
            try {
              const response = await fetch(endpoint, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              if (response.ok) {
                const data = await response.json();
                set({ unreadNotificationsCount: data.unread_count });
                return data.unread_count;
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
      partialize: (state) => {
        const persistAuth = localStorage.getItem('persistAuth') === 'true';
        return {
          token: persistAuth ? state.token : null
        };
      }
    }
  )
);

export default useAuthStore;

