import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import ItemSearchBar from './ItemSearchBar';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { 
    isAuthenticated, 
    user, 
    logout,
    unreadNotificationsCount, 
    fetchUnreadNotificationsCount,
    fetchNotifications, 
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useAuthStore();
  
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setUserMenuOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  // Fetch unread notifications count with better error handling
  useEffect(() => {
    if (isAuthenticated) {
      // Initial fetch of notification count
      const fetchCount = async () => {
        try {
          await fetchUnreadNotificationsCount();
        } catch (error) {
          console.error("Failed to fetch notification count:", error);
          // No need to show error UI here as it's not critical
        }
      };
      
      fetchCount();
      
      // Use simpler interval approach with exponential backoff for errors
      let intervalId;
      let currentInterval = 30000; // Start with 30 seconds
      let consecutiveErrors = 0;
      
      const setupInterval = () => {
        clearInterval(intervalId);
        
        intervalId = setInterval(async () => {
          try {
            await fetchUnreadNotificationsCount();
            // If successful after errors, gradually decrease interval back to normal
            if (consecutiveErrors > 0) {
              consecutiveErrors = Math.max(0, consecutiveErrors - 1);
              if (consecutiveErrors === 0 && currentInterval > 30000) {
                currentInterval = Math.max(30000, currentInterval / 2);
                setupInterval();
              }
            }
          } catch (error) {
            consecutiveErrors++;
            // Implement exponential backoff
            if (consecutiveErrors > 2) {
              currentInterval = Math.min(300000, currentInterval * 1.5); // Max 5 minutes
              setupInterval();
            }
          }
        }, currentInterval);
      };
      
      setupInterval();
      
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, fetchUnreadNotificationsCount]);

  // Close notifications panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNotificationsToggle = async () => {
    if (!notificationsOpen && notifications.length === 0) {
      await fetchNotifications();
    }
    setNotificationsOpen(!notificationsOpen);
  };

  const handleNotificationClick = async (notification) => {
    // Mark notification as read if it's not already
    if (!notification.is_read) {
      await markNotificationAsRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.cultural_item_id) {
      navigate(`/items/${notification.cultural_item_id}`);
    } else if (notification.comment_id) {
      navigate(`/comments/${notification.comment_id}`);
    }
    
    setNotificationsOpen(false);
  };

  const formatNotificationTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
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
              <div className="hidden sm:flex items-center space-x-2">
                {/* Notifications bell */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={handleNotificationsToggle}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                  
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
                      <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                        {unreadNotificationsCount > 0 && (
                          <button 
                            onClick={() => markAllNotificationsAsRead()}
                            className="text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(notification => (
                            <div 
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.is_read ? 'bg-blue-50' : ''}`}
                            >
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mr-3">
                                  {notification.media_thumbnail ? (
                                    <div className="w-8 h-8 rounded overflow-hidden">
                                      <img 
                                        src={notification.media_thumbnail} 
                                        alt=""
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.style.display = 'none';
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                      notification.notification_type === 'comment' ? 'bg-green-100' : 
                                      notification.notification_type === 'favorite' ? 'bg-amber-100' : 
                                      notification.notification_type === 'contribution' ? 'bg-purple-100' : 'bg-blue-100'
                                    }`}>
                                      {notification.notification_type === 'comment' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                      ) : notification.notification_type === 'favorite' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                      ) : notification.notification_type === 'contribution' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                      ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-800">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{formatNotificationTime(notification.created_at)}</p>
                                </div>
                                {!notification.is_read && (
                                  <div className="flex-shrink-0 ml-2">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            No notifications
                          </div>
                        )}
                      </div>
                      <div className="p-2 border-t border-gray-100 bg-gray-50">
                        <Link 
                          to="/notifications" 
                          className="block text-center text-xs text-indigo-600 hover:text-indigo-800"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User menu */}
                <div className="hidden sm:block relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium overflow-hidden">
                      {user?.profile_image ? (
                        <img 
                          src={user.profile_image} 
                          alt={user?.username || 'Profile'}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'U')}&background=6366f1&color=fff`;
                          }}
                        />
                      ) : (
                        user?.username?.charAt(0)?.toUpperCase() || 'U'
                      )}
                    </div>
                    <span className="text-gray-700 font-medium">
                      {user?.full_name || user?.username || 'User'}
                    </span>
                    <svg className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180 transform' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {userMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none animate-fadeIn">
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</Link>
                        <Link to="/user/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Settings</Link>
                        <Link to="/user/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Saved Items</Link>
                        <Link to="/items/new" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Add New Item</Link>
                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</button>
                      </div>
                    </div>
                  )}
                </div>
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
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium mr-3 overflow-hidden">
                  {user?.profile_image ? (
                    <img 
                      src={user.profile_image} 
                      alt={user?.username || 'Profile'}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'U')}&background=6366f1&color=fff`;
                      }}
                    />
                  ) : (
                    user?.username?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                <span>
                  {user?.full_name || user?.username || 'User'}
                </span>
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