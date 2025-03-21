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
    return (
      <div className="rounded-lg bg-gray-50 p-6 text-center">
        <p className="text-gray-500 font-medium">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {comments.map(comment => (
        <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0 hover:bg-gray-50 rounded-lg transition-colors duration-200 p-4">
          <div className="flex">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white font-semibold text-lg">
                {comment.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{comment.user.name}</h4>
                  <time className="text-xs text-gray-500 flex items-center">
                    <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {formatTimestamp(comment.timestamp)}
                  </time>
                </div>
                {currentUser?.id === comment.user.id && (
                  <div className="flex space-x-2">
                    <button
                      className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                      title="Edit comment"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                      title="Delete comment"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-3 text-gray-700 whitespace-pre-wrap bg-white p-3 rounded-lg border border-gray-100 shadow-sm">{comment.text}</p>
              <div className="mt-3 flex space-x-4">
                <button className="text-xs font-medium text-gray-500 hover:text-blue-600 flex items-center transition-colors duration-200 py-1 px-2 rounded-full hover:bg-blue-50">
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Reply
                </button>
                {comment.replies?.length > 0 && (
                  <button
                    onClick={() => toggleReplies(comment.id)}
                    className="text-xs font-medium text-gray-500 hover:text-blue-600 flex items-center transition-colors duration-200 py-1 px-2 rounded-full hover:bg-blue-50"
                  >
                    <svg className={`h-4 w-4 mr-1 transition-transform duration-200 ${expandedReplies[comment.id] ? 'rotate-180 transform' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {expandedReplies[comment.id] ? 'Hide' : 'Show'} {comment.replies.length} repl{comment.replies.length === 1 ? 'y' : 'ies'}
                  </button>
                )}
              </div>
              {expandedReplies[comment.id] && comment.replies.length > 0 && (
                <div className="mt-4 pl-6 border-l-2 border-indigo-200">
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