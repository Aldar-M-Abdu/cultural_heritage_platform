import { create } from 'zustand';
import { API_BASE_URL } from '../config';

const useCommunityStore = create((set, get) => ({
  communities: [],
  discussions: [],
  selectedCommunity: null,
  selectedDiscussion: null,
  comments: [],
  isLoading: false,
  error: null,

  // Fetch all communities
  fetchCommunities: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/communities`);
      
      if (response.ok) {
        const data = await response.json();
        set({ communities: data, isLoading: false });
      } else {
        const errorText = await response.text();
        console.error('Error fetching communities:', errorText);
        set({ 
          error: `Failed to load communities: ${response.status}`, 
          isLoading: false,
          communities: []
        });
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
      set({ 
        error: `Failed to load communities: ${error.message}`, 
        isLoading: false,
        communities: []
      });
    }
  },

  // Fetch a single community by ID
  fetchCommunity: async (communityId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/communities/${communityId}`);
      
      if (response.ok) {
        const data = await response.json();
        set({ selectedCommunity: data, isLoading: false });
      } else {
        const errorText = await response.text();
        console.error(`Error fetching community ${communityId}:`, errorText);
        set({ 
          error: `Failed to load community: ${response.status}`, 
          isLoading: false 
        });
      }
    } catch (error) {
      console.error(`Error fetching community ${communityId}:`, error);
      set({ 
        error: `Failed to load community: ${error.message}`, 
        isLoading: false 
      });
    }
  },

  // Fetch discussions for a community
  fetchDiscussions: async (communityId, filters = {}) => {
    set({ isLoading: true, error: null });
    
    const { category, search } = filters;
    let queryParams = '';
    
    if (category) queryParams += `&category=${category}`;
    if (search) queryParams += `&search=${encodeURIComponent(search)}`;
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/communities/${communityId}/discussions?${queryParams}`
      );
      
      if (response.ok) {
        const data = await response.json();
        set({ discussions: data, isLoading: false });
      } else {
        const errorText = await response.text();
        console.error(`Error fetching discussions for community ${communityId}:`, errorText);
        set({ 
          error: `Failed to load discussions: ${response.status}`, 
          isLoading: false,
          discussions: []
        });
      }
    } catch (error) {
      console.error(`Error fetching discussions for community ${communityId}:`, error);
      set({ 
        error: `Failed to load discussions: ${error.message}`, 
        isLoading: false,
        discussions: []
      });
    }
  },

  // Fetch a single discussion by ID with its comments
  fetchDiscussion: async (discussionId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Fetch both the discussion and its comments in parallel
      const [discussionResponse, commentsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/discussions/${discussionId}`),
        fetch(`${API_BASE_URL}/api/v1/discussions/${discussionId}/comments`)
      ]);
      
      if (discussionResponse.ok && commentsResponse.ok) {
        const [discussionData, commentsData] = await Promise.all([
          discussionResponse.json(),
          commentsResponse.json()
        ]);
        
        set({ 
          selectedDiscussion: discussionData, 
          comments: commentsData,
          isLoading: false 
        });
      } else {
        // Handle error from either request
        const errorResponse = !discussionResponse.ok ? discussionResponse : commentsResponse;
        const errorText = await errorResponse.text();
        console.error(`Error fetching discussion ${discussionId}:`, errorText);
        set({ 
          error: `Failed to load discussion: ${errorResponse.status}`, 
          isLoading: false 
        });
      }
    } catch (error) {
      console.error(`Error fetching discussion ${discussionId}:`, error);
      set({ 
        error: `Failed to load discussion: ${error.message}`, 
        isLoading: false 
      });
    }
  },

  // Create a new discussion
  createDiscussion: async (communityId, discussionData) => {
    set({ isLoading: true, error: null });
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ 
          error: 'Authentication required', 
          isLoading: false 
        });
        return null;
      }
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/communities/${communityId}/discussions`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(discussionData)
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        // Add the new discussion to the list
        set(state => ({ 
          discussions: [data, ...state.discussions],
          isLoading: false 
        }));
        return data;
      } else {
        const errorText = await response.text();
        console.error('Error creating discussion:', errorText);
        set({ 
          error: `Failed to create discussion: ${response.status}`, 
          isLoading: false 
        });
        return null;
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
      set({ 
        error: `Failed to create discussion: ${error.message}`, 
        isLoading: false 
      });
      return null;
    }
  },

  // Add a comment to a discussion
  addComment: async (discussionId, commentData) => {
    set({ isLoading: true, error: null });
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ 
          error: 'Authentication required', 
          isLoading: false 
        });
        return null;
      }
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/discussions/${discussionId}/comments`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(commentData)
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        // Add the new comment to the list
        set(state => {
          // If it's a reply, add it to the parent's replies
          if (data.parent_id) {
            const updatedComments = state.comments.map(comment => {
              if (comment.id === data.parent_id) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), data]
                };
              }
              return comment;
            });
            return { 
              comments: updatedComments,
              isLoading: false 
            };
          } else {
            // Otherwise add it as a top-level comment
            return { 
              comments: [...state.comments, data],
              isLoading: false 
            };
          }
        });
        return data;
      } else {
        const errorText = await response.text();
        console.error('Error adding comment:', errorText);
        set({ 
          error: `Failed to add comment: ${response.status}`, 
          isLoading: false 
        });
        return null;
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      set({ 
        error: `Failed to add comment: ${error.message}`, 
        isLoading: false 
      });
      return null;
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    set({ isLoading: true, error: null });
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ 
          error: 'Authentication required', 
          isLoading: false 
        });
        return false;
      }
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/discussions/comments/${commentId}`, 
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        // Remove the comment from the list
        set(state => {
          // First check if it's a top-level comment
          const updatedComments = state.comments.filter(comment => comment.id !== commentId);
          
          // If the length is the same, it might be a reply
          if (updatedComments.length === state.comments.length) {
            // Remove from replies
            return {
              comments: state.comments.map(comment => ({
                ...comment,
                replies: (comment.replies || []).filter(reply => reply.id !== commentId)
              })),
              isLoading: false
            };
          }
          
          return { 
            comments: updatedComments,
            isLoading: false 
          };
        });
        return true;
      } else {
        const errorText = await response.text();
        console.error('Error deleting comment:', errorText);
        set({ 
          error: `Failed to delete comment: ${response.status}`, 
          isLoading: false 
        });
        return false;
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      set({ 
        error: `Failed to delete comment: ${error.message}`, 
        isLoading: false 
      });
      return false;
    }
  },

  // Clear selected items
  clearSelectedCommunity: () => set({ selectedCommunity: null }),
  clearSelectedDiscussion: () => set({ selectedDiscussion: null, comments: [] }),
  
  // Clear error
  clearError: () => set({ error: null })
}));

export default useCommunityStore;
