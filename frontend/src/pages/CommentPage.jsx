import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import CommentList from '../components/CommentList';
import useAuthStore from '../stores/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { API_BASE_URL } from '../config';

// Local API helper
const commentsApi = {
  request(endpoint, method = 'GET', data = null) {
    const baseURL = API_BASE_URL;
    const token = localStorage.getItem('token') || useAuthStore.getState().token;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      credentials: 'include',
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    return fetch(`${baseURL}${endpoint}`, options)
      .then(response => {
        if (response.status === 401) {
          window.dispatchEvent(new Event('auth:sessionExpired'));
          throw new Error('Session expired');
        }
        
        if (!response.ok) {
          return response.json()
            .catch(() => ({}))
            .then(errorData => {
              throw errorData.detail ? new Error(errorData.detail) : new Error('API request failed');
            });
        }
        
        return response.status !== 204 ? response.json() : null;
      });
  },

  getComments: (itemId) => {
    return commentsApi.request(`/api/v1/comments/${itemId}`);
  },

  addComment: (commentData) => {
    return commentsApi.request('/api/v1/comments', 'POST', commentData);
  },

  deleteComment: (commentId) => {
    return commentsApi.request(`/api/v1/comments/${commentId}`, 'DELETE');
  },

  replyToComment: (commentId, replyData) => {
    return commentsApi.request(`/api/v1/comments/${commentId}/replies`, 'POST', replyData);
  },
};

const CommentPage = () => {
  const { itemId } = useParams();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const MAX_CHARS = 500;
  const MIN_CHARS = 5;
  
  const { user, isAuthenticated } = useAuthStore();
  const currentUser = user || { id: 'guest', name: 'Guest User' };

  useEffect(() => {
    setCharCount(comment.length);
  }, [comment]);

  useEffect(() => {
    if (itemId) {
      fetchComments();
    }
  }, [itemId]);

  const fetchComments = () => {
    setIsLoading(true);
    
    if (itemId) {
      commentsApi.getComments(itemId)
        .then(data => {
          setComments(data || []);
        })
        .catch(err => {
          setError('Failed to load comments');
          console.error('Error fetching comments:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      return new Promise(resolve => setTimeout(resolve, 500))
        .then(() => {
          setComments([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleCommentChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setComment(value);
      setError('');
    }
  }, []);

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError('Please sign in to post comments');
      return;
    }

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

    if (itemId) {
      commentsApi.addComment({
        itemId,
        text: comment,
        userId: currentUser.id
      })
      .then(newComment => {
        setComments(prev => [newComment, ...prev]);
        setComment('');
      })
      .catch(err => {
        setError(err.detail || 'Failed to submit comment');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
    } else {
      const newComment = {
        id: Date.now(),
        text: comment,
        timestamp: new Date().toISOString(),
        user: { ...currentUser },
        replies: []
      };
      
      new Promise(resolve => setTimeout(resolve, 500))
        .then(() => {
          setComments(prev => [newComment, ...prev]);
          setComment('');
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  const handleDeleteComment = (commentId) => {
    commentsApi.deleteComment(commentId)
      .then(() => {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      })
      .catch(err => {
        setError('Failed to delete comment');
      });
  };

  const handleReplyToComment = (commentId, replyText) => {
    if (!isAuthenticated) {
      setError('Please sign in to reply to comments');
      return Promise.resolve(false);
    }
    
    return commentsApi.replyToComment(commentId, {
      text: replyText,
      userId: currentUser.id
    })
    .then(newReply => {
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      });
      
      setComments(updatedComments);
      return true;
    })
    .catch(err => {
      setError('Failed to add reply');
      return false;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-4">Community Discussion</h1>
        <p className="text-xl text-gray-700">Share your thoughts and insights with our global community</p>
        <div className="h-1 w-24 bg-teal-500 mt-6"></div>
      </header>

      <section className="bg-white shadow-lg rounded-xl p-8 mb-12 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center">
          <svg className="h-6 w-6 text-teal-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Add a Comment
        </h2>
        
        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded relative mb-4" role="alert">
            <p>You are not signed in. <a href="/login" className="font-medium underline">Sign in</a> to post comments.</p>
          </div>
        )}
        
        <form onSubmit={handleCommentSubmit}>
          <div className="space-y-6">
            <div className="relative">
              <textarea
                id="comment-input"
                className={`
                  w-full border rounded-xl shadow-sm p-4 text-gray-700
                  focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                  transition-all duration-300
                  ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                  ${charCount > MAX_CHARS * 0.9 ? 'border-red-300' : 'border-gray-300'}
                `}
                rows="4"
                placeholder="Share your thoughts, insights, or questions here..."
                value={comment}
                onChange={handleCommentChange}
                maxLength={MAX_CHARS}
                disabled={isSubmitting}
                aria-describedby="char-count error-message"
              />
              <div className="absolute bottom-3 right-3">
                <span 
                  className={`
                    text-sm px-2 py-1 rounded-md
                    ${charCount > MAX_CHARS * 0.9 
                      ? 'text-red-700 bg-red-50' 
                      : 'text-gray-600 bg-gray-100'
                    }
                  `}
                >
                  {charCount}/{MAX_CHARS}
                </span>
              </div>
            </div>
            {error && (
              <p id="error-message" className="text-sm text-red-600 flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </p>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                className={`
                  px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md
                  hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                  disabled:bg-indigo-300 disabled:cursor-not-allowed
                  transition-all duration-300 flex items-center
                `}
                disabled={isSubmitting || !comment.trim() || comment.length < MIN_CHARS || !isAuthenticated}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit Comment
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="bg-white shadow-lg rounded-xl p-8 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center">
          <svg className="h-6 w-6 text-teal-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          Community Conversation <span className="text-teal-600 ml-2 text-lg">({comments.length})</span>
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" color="teal" />
          </div>
        ) : comments.length > 0 ? (
          <CommentList 
            comments={comments} 
            currentUser={currentUser} 
            onDelete={handleDeleteComment}
            onReply={handleReplyToComment}
          />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-600 text-lg">Be the first to start the conversation!</p>
            <p className="text-gray-500 mt-2">Share your insights and expertise with our community.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CommentPage;