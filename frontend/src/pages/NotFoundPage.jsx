import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
      <a href="/" className="btn btn-primary">
        Go Back Home
      </a>
    </div>
  );
};

export default NotFoundPage;
