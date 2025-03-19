import React from 'react';

// CommentList Component
const CommentList = () => {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="border-b border-gray-200 pb-4">
          <div className="flex">
            {/* User Avatar */}
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-800 font-medium">A</span>
            </div>

            {/* Comment Content */}
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Anonymous</h4>
                  <p className="text-xs text-gray-500">Date and Time</p>
                </div>
                <button
                  className="text-sm text-gray-400 hover:text-red-600"
                  title="Delete comment"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="mt-2 text-sm text-gray-700">
                <p>Comment content goes here...</p>
              </div>

              {/* Comment Actions */}
              <div className="mt-2 flex space-x-4">
                <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Reply
                </button>
                <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Show replies
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;