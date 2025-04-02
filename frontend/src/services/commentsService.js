import api from './api';

const commentsService = {
  getComments: async (itemId) => {
    return await api.get(`/cultural-items/${itemId}/comments`);
  },

  addComment: async (commentData) => {
    return await api.post('/comments', commentData);
  },

  deleteComment: async (commentId) => {
    return await api.delete(`/comments/${commentId}`);
  },

  replyToComment: async (commentId, replyData) => {
    return await api.post(`/comments/${commentId}/replies`, replyData);
  },
};

export { commentsService };
export default commentsService;
