import React, { useState, useEffect } from 'react';
import CommentList from '../components/CommentList';

const CommentPage = () => {
  const [comment, setComment] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MAX_CHARS = 500;

  useEffect(() => {
    setCharCount(comment.length);
  }, [comment]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (comment.trim()) {
      setIsSubmitting(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('New Comment:', comment);
        
        // Clear input after successful submission
        setComment('');
        // Show success feedback (you could add a toast notification here)
      } catch (error) {
        console.error('Error submitting comment:', error);
        // Show error feedback
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Discussion</h1>
      <p className="text-gray-600 mb-8">Join the conversation and share your thoughts below.</p>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add a comment</h2>
        <form onSubmit={handleCommentSubmit}>
          <div className="mb-2">
            <label htmlFor="comment-input" className="sr-only">
              Write your comment
            </label>
            <textarea
              id="comment-input"
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
              rows="4"
              placeholder="Write your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={MAX_CHARS}
              aria-describedby="char-count"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span 
              id="char-count" 
              className={`text-sm ${charCount > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-gray-500'}`}
            >
              {charCount}/{MAX_CHARS} characters
            </span>
            
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              disabled={!comment.trim() || isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : 'Submit Comment'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <CommentList />
      </div>
    </div>
  );
};

export default CommentPage;