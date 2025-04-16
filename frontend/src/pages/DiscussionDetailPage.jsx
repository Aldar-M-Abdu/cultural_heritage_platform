import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CommentList from '../components/CommentList';
import useAuthStore from '../stores/authStore';
import useCommunityStore from '../stores/communityStore';

const DiscussionDetailPage = () => {
  const { discussionId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { 
    currentDiscussion, 
    comments, 
    isLoading, 
    error, 
    fetchDiscussion, 
    createComment 
  } = useCommunityStore();
  
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');
  
  // Fetch discussion when component mounts
  useEffect(() => {
    if (discussionId) {
      fetchDiscussion(discussionId);
    }
  }, [discussionId]);
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }
    
    if (!isAuthenticated) {
      setCommentError('You must be logged in to post a comment');
      return;
    }
    
    setIsSubmitting(true);
    setCommentError('');
    
    try {
      await createComment(discussionId, { content: commentText, discussion_id: discussionId });
      setCommentText('');
    } catch (error) {
      setCommentError(error.message || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReply = async (commentId, replyText) => {
    if (!isAuthenticated) {
      return Promise.resolve(false);
    }
    
    try {
      await createComment(discussionId, { 
        content: replyText, 
        discussion_id: discussionId,
        parent_id: commentId 
      });
      return true;
    } catch (error) {
      console.error('Failed to post reply:', error);
      return false;
    }
  };
  
  if (isLoading && !currentDiscussion) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (error && !currentDiscussion) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => navigate('/community')}
          className="text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Community
        </button>
      </div>
    );
  }
  
  return currentDiscussion ? (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation breadcrumbs */}
        <div className="mb-6 flex items-center text-sm text-gray-500">
          <Link to="/community" className="hover:text-indigo-600">
            Community
          </Link>
          <svg className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link to={`/community/${currentDiscussion.community_id}`} className="hover:text-indigo-600">
            {currentDiscussion.category || 'Discussion'}
          </Link>
          <svg className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="truncate">{currentDiscussion.title}</span>
        </div>
        
        {/* Discussion card */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          {/* Discussion header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                {currentDiscussion.is_pinned && (
                  <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                )}
                {currentDiscussion.title}
              </h1>
              <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 font-medium">
                {currentDiscussion.category || 'General'}
              </span>
            </div>
            
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <img
                className="h-8 w-8 rounded-full mr-2"
                src={currentDiscussion.author?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentDiscussion.author?.username || 'User')}&background=6366f1&color=fff`}
                alt={currentDiscussion.author?.username || 'User'}
              />
              <span className="font-medium text-gray-700">
                {currentDiscussion.author?.full_name || currentDiscussion.author?.username || 'Anonymous'}
              </span>
              <span className="mx-2">•</span>
              <span>
                {new Date(currentDiscussion.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {currentDiscussion.view_count} views
              </span>
            </div>
          </div>
          
          {/* Discussion content */}
          <div className="px-6 py-6">
            <div className="prose max-w-none">
              {currentDiscussion.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        
        {/* Comment form */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Add your thoughts
            </h2>
          </div>
          
          <div className="px-6 py-4">
            {!isAuthenticated ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Authentication required
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Please <Link to={`/login?redirect=/community/discussions/${discussionId}`} className="font-medium text-yellow-800 underline">sign in</Link> to join the conversation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCommentSubmit}>
                <div>
                  <label htmlFor="comment" className="sr-only">Comment</label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows="4"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Write your comment here..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                {commentError && (
                  <p className="mt-2 text-sm text-red-600">{commentError}</p>
                )}
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    disabled={isSubmitting || !commentText.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Posting...
                      </>
                    ) : 'Post Comment'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        {/* Comments section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Comments ({comments.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="md" />
              </div>
            ) : comments.length > 0 ? (
              <CommentList
                comments={comments.map(comment => ({
                  id: comment.id,
                  text: comment.content,
                  user: {
                    id: comment.author?.id,
                    name: comment.author?.full_name || comment.author?.username || 'Anonymous',
                  },
                  timestamp: comment.created_at,
                  replies: comment.replies?.map(reply => ({
                    id: reply.id,
                    text: reply.content,
                    user: {
                      id: reply.author?.id,
                      name: reply.author?.full_name || reply.author?.username || 'Anonymous',
                    },
                    timestamp: reply.created_at,
                  })) || []
                }))}
                currentUser={user ? { id: user.id, name: user.full_name || user.username } : null}
                onReply={handleReply}
              />
            ) : (
              <div className="px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No comments yet</h3>
                <p className="mt-1 text-sm text-gray-500">Be the first to share your thoughts on this discussion.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default DiscussionDetailPage;
