import React, { useState } from 'react';

const CommentList = ({ comments = [], currentUser }) => {
  const [expandedReplies, setExpandedReplies] = useState({});

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'
    });
  };

  const toggleReplies = (id) => {
    setExpandedReplies(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!comments.length) {
    return <p className="text-gray-500">No comments yet. Be the first to comment!</p>;
  }

  return (
    <div className="space-y-6">
      {comments.map(comment => (
        <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
          <div className="flex">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-800 font-medium">
                {comment.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{comment.user.name}</h4>
                  <time className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</time>
                </div>
                {currentUser?.id === comment.user.id && (
                  <button
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete comment"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{comment.text}</p>
              <div className="mt-2 flex space-x-4">
                <button className="text-xs text-gray-500 hover:text-blue-600 flex items-center">
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Reply
                </button>
                {comment.replies?.length > 0 && (
                  <button
                    onClick={() => toggleReplies(comment.id)}
                    className="text-xs text-gray-500 hover:text-blue-600 flex items-center"
                  >
                    <svg className={`h-4 w-4 mr-1 ${expandedReplies[comment.id] ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {expandedReplies[comment.id] ? 'Hide' : 'Show'} {comment.replies.length} repl{comment.replies.length === 1 ? 'y' : 'ies'}
                  </button>
                )}
              </div>
              {expandedReplies[comment.id] && comment.replies.length > 0 && (
                <div className="mt-4 pl-6 border-l-2 border-gray-200">
                  <CommentList comments={comment.replies} currentUser={currentUser} />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;