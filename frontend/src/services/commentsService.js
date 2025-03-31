import api from './api';

class CommentsService {
  async getComments(itemId) {
    try {
      const response = await api.get(`/comments/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      throw error;
    }
  }

  async addComment(commentData) {
    try {
      const response = await api.post('/comments', commentData);
      return response.data;
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  }

  async deleteComment(commentId) {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete comment:', error);
      throw error;
    }
  }
}

export const commentsService = new CommentsService();
export default commentsService;
