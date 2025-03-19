import React from 'react';

const Pagination = () => {
  return (
    <nav className="inline-flex rounded-md shadow-sm">
      <button
        className="relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
      >
        <span className="sr-only">Previous</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>
      
      <span
        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
      >
        ...
      </span>
      
      <button
        className="relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
      >
        1
      </button>
      
      <button
        className="relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
      >
        <span className="sr-only">Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;