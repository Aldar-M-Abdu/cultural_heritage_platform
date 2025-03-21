import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 text-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 border border-slate-200 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-100 rounded-full opacity-50"></div>
        
        {/* Error code */}
        <div className="relative">
          <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">404</h1>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Page Not Found</h2>
          
          <div className="w-16 h-1 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
          
          <p className="text-slate-600 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="px-5 py-3 text-white bg-indigo-600 rounded-lg font-medium shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-150"
            >
              Back to Home
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="px-5 py-3 text-indigo-700 bg-indigo-50 rounded-lg font-medium hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-150"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-slate-500 text-sm">
        If you believe this is an error, please contact support.
      </p>
    </div>
  );
};

export default NotFoundPage;