import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] bg-white flex flex-col justify-center items-center px-6 py-24">
      <div className="text-center">
        <p className="text-base font-semibold text-amber-600">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page Not Found</h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-md bg-amber-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-600"
          >
            Go back home
          </Link>
          <Link to="/items" className="text-sm font-semibold text-gray-900 hover:text-amber-600 transition-colors">
            Browse collection <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        
        <div className="mt-16 flex justify-center">
          <div className="relative">
            <img
              src="/broken-artifact.png"
              alt="Broken ancient artifact illustration"
              className="h-64"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;