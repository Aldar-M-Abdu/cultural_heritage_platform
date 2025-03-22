import React, { useState } from 'react';

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  return (
    <header className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2 group">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-amber-500 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute h-14 w-14 -bottom-1 -right-1 text-white"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                  />
                </svg>
              </div>
              <div className="text-slate-800 font-serif">
                <span className="text-xl font-bold">Cultural</span>
                <span className="text-xl font-bold text-amber-500">Heritage</span>
                <span className="block text-xs text-slate-500 tracking-wider uppercase -mt-0.5">Preserve • Discover • Connect</span>
              </div>
            </a>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block flex-grow max-w-md mx-6">
            <form className="relative">
              <input
                type="search"
                name="search"
                placeholder="Search artifacts, collections, topics..."
                className={`w-full bg-white h-11 pl-5 pr-12 rounded-full text-sm border ${
                  isSearchFocused 
                    ? 'border-amber-400 ring-2 ring-amber-100' 
                    : 'border-slate-200 shadow-sm'
                } transition-all duration-200 focus:outline-none`}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 mt-2.5 mr-4 text-slate-400 hover:text-amber-500 transition-colors"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Authentication Links */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="/login" 
              className="text-slate-600 hover:text-indigo-700 font-medium px-3 py-2 transition-colors"
            >
              Log in
            </a>
            <a 
              href="/register" 
              className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Sign up
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              className="flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;