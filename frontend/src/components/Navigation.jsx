import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import ItemSearchBar from './ItemSearchBar';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Collection', href: '/items' },
    { name: 'Map', href: '/map' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
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
                  className={`text-gray-700 px-4 py-2 mx-1 text-sm font-medium border-b-2 transition-all rounded-lg
                  ${location.pathname === item.href 
                    ? 'border-amber-400 text-indigo-700 bg-indigo-50' 
                    : 'border-transparent hover:border-amber-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block relative">
              <ItemSearchBar className="w-56" />
            </div>
            
            {isAuthenticated ? (
              <div className="hidden sm:block relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                    {user?.username?.charAt(0)?.toUpperCase() || user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-gray-700 font-medium">{user?.username || user?.first_name || 'User'}</span>
                  <svg className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180 transform' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none animate-fadeIn">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</Link>
                      <Link to="/items/new" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Add New Item</Link>
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex space-x-3">
                <Link to="/login" className="text-indigo-700 hover:text-indigo-900 font-medium px-4 py-2 border border-transparent hover:border-indigo-200 rounded-full transition-all">Log in</Link>
                <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white hover:from-indigo-700 hover:to-indigo-900 px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Sign up
                </Link>
              </div>
            )}
            
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
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white shadow-lg px-4 py-6 border-t border-gray-100 animate-fadeIn">
          <ItemSearchBar className="mb-4" />
          
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block py-3 font-medium border-b border-gray-100 transition-all
              ${location.pathname === item.href 
                ? 'text-indigo-600 pl-2' 
                : 'text-gray-700 hover:text-indigo-600 hover:pl-2'}`}
            >
              {item.name}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <div className="mt-6 space-y-3">
              <Link to="/profile" className="flex items-center py-3 text-gray-700 hover:text-indigo-600">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium mr-3">
                  {user?.username?.charAt(0)?.toUpperCase() || user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span>Your Profile</span>
              </Link>
              <Link to="/items/new" className="block text-indigo-700 hover:text-indigo-900 font-medium py-3 border border-indigo-100 rounded-lg text-center hover:bg-gray-50">
                Add New Item
              </Link>
              <button onClick={handleLogout} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700">
                Sign out
              </button>
            </div>
          ) : (
            <div className="mt-6 flex flex-col space-y-3">
              <Link to="/login" className="block text-indigo-700 hover:text-indigo-900 font-medium py-3 border border-indigo-100 rounded-lg text-center hover:bg-gray-50">Log in</Link>
              <Link to="/register" className="block bg-gradient-to-r from-indigo-600 to-indigo-800 text-white hover:from-indigo-700 hover:to-indigo-300 py-3 rounded-lg font-medium text-center shadow-md">
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;