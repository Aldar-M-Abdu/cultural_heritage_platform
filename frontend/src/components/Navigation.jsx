import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Collection', href: '/items' },
    { name: 'Map', href: '/map' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Comments', href: '/comments' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-900 hover:text-indigo-700 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span className="font-serif">Cultural<span className="text-amber-500">Heritage</span></span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-indigo-600 px-4 py-2 mx-1 text-sm font-medium border-b-2 border-transparent hover:border-amber-400 transition-all rounded-lg hover:bg-indigo-50"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <form className="hidden sm:block relative">
              <input
                type="search"
                placeholder="Search artifacts..."
                className="w-56 bg-gray-100 text-gray-700 rounded-full pl-5 pr-12 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 bg-white rounded-full p-1 shadow">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </button>
            </form>
            <div className="hidden sm:flex space-x-3">
              <Link to="/login" className="text-indigo-700 hover:text-indigo-900 font-medium px-4 py-2 border border-transparent hover:border-indigo-200 rounded-full transition-all">Log in</Link>
              <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white hover:from-indigo-700 hover:to-indigo-900 px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Sign up
              </Link>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 text-gray-600 hover:text-indigo-600 focus:outline-none bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white shadow-lg px-4 py-6 border-t border-gray-100 animate-fadeIn">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="block py-3 text-gray-700 hover:text-indigo-600 font-medium border-b border-gray-100 hover:pl-2 transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-6 flex flex-col space-y-3">
            <form className="relative mb-4">
              <input
                type="search"
                placeholder="Search artifacts..."
                className="w-full bg-gray-100 text-gray-700 rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </button>
            </form>
            <Link to="/login" className="block text-indigo-700 hover:text-indigo-900 font-medium py-3 border border-indigo-100 rounded-lg text-center hover:bg-gray-50">Log in</Link>
            <Link to="/register" className="block bg-gradient-to-r from-indigo-600 to-indigo-800 text-white hover:from-indigo-700 hover:to-indigo-300 py-3 rounded-lg font-medium text-center shadow-md">
              Sign up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;