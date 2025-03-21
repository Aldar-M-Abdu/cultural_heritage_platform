import React, { useState, useEffect, useCallback } from 'react';
import CommentList from '../components/CommentList';

const CommentPage = () => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const MAX_CHARS = 500;
  const MIN_CHARS = 5;

  // Simulated current user (in real app, this would come from auth context)
  const currentUser = { id: 'user1', name: 'Current User' };

  useEffect(() => {
    setCharCount(comment.length);
  }, [comment]);

  const handleCommentChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setComment(value);
      setError('');
    }
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    if (comment.length < MIN_CHARS) {
      setError(`Comment must be at least ${MIN_CHARS} characters`);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const newComment = {
        id: Date.now(),
        text: comment,
        timestamp: new Date().toISOString(),
        user: { ...currentUser },
        replies: []
      };
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API
      setComments(prev => [newComment, ...prev]);
      setComment('');
    } catch (err) {
      setError('Failed to submit comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discussion</h1>
        <p className="text-gray-600 mt-2">Join the conversation below</p>
      </header>

      <section className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add a Comment</h2>
        <form onSubmit={handleCommentSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <textarea
                id="comment-input"
                className={`
                  w-full border rounded-md shadow-sm p-3
                  focus:ring-blue-500 focus:border-blue-500
                  ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                  ${charCount > MAX_CHARS * 0.9 ? 'border-red-300' : 'border-gray-300'}
                `}
                rows="4"
                placeholder="Write your comment here..."
                value={comment}
                onChange={handleCommentChange}
                maxLength={MAX_CHARS}
                disabled={isSubmitting}
                aria-describedby="char-count error-message"
              />
              <div className="absolute bottom-2 right-2">
                <span className={`text-xs ${charCount > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
                  {charCount}/{MAX_CHARS}
                </span>
              </div>
            </div>
            {error && (
              <p id="error-message" className="text-sm text-red-500">{error}</p>
            )}
            <button
              type="submit"
              className={`
                w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md
                hover:bg-blue-700 focus:ring-2 focus:ring-blue-500
                disabled:bg-blue-400 disabled:cursor-not-allowed
                transition-colors
              `}
              disabled={isSubmitting || !comment.trim() || comment.length < MIN_CHARS}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Comment'}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Comments ({comments.length})</h2>
        <CommentList comments={comments} currentUser={currentUser} />
      </section>
    </div>
  );
};

export default CommentPage;