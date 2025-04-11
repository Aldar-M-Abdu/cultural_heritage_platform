import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useToast from '../hooks/useToast';

const NotificationsPage = () => {
  const { 
    isAuthenticated, 
    fetchNotifications, 
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/notifications');
      return;
    }
    
    const loadNotifications = () => {
      setIsLoading(true);
      // Use consistent endpoint from the authStore
      fetchNotifications(filter === 'unread', page)
        .then(allNotifications => {
          setNotifications(prev => page === 1 ? [...(allNotifications || [])] : [...prev, ...(allNotifications || [])]);
          setHasMore(allNotifications && allNotifications.length > 0);
          setError(null);
        })
        .catch(err => {
          console.error('Failed to fetch notifications:', err);
          setError('Failed to load notifications. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    
    loadNotifications();
  }, [isAuthenticated, fetchNotifications, navigate, page, filter]);
  
  const handleMarkAsRead = (notificationId) => {
    markNotificationAsRead(notificationId)
      .then(success => {
        if (success) {
          // Update local state to reflect change
          setNotifications(prev => 
            prev.map(notification => 
              notification.id === notificationId 
                ? { ...notification, is_read: true } 
                : notification
            )
          );
        }
      })
      .catch(err => {
        console.error('Failed to mark notification as read:', err);
        toast.error('Failed to update notification status');
      });
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      const success = await markAllNotificationsAsRead();
      if (success) {
        // Update all notifications in local state
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, is_read: true }))
        );
        toast.success('All notifications marked as read');
      }
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      toast.error('Failed to update notification status');
    }
  };
  
  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.cultural_item_id) {
      navigate(`/items/${notification.cultural_item_id}`);
    } else if (notification.comment_id) {
      navigate(`/comments/${notification.comment_id}`);
    }
  };
  
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };
  
  // Format notification time
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
  
  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.is_read;
    if (filter === 'read') return notification.is_read;
    return true;
  });
  
  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.created_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let groupKey = date.toLocaleDateString();
    
    // Check if the date is today or yesterday
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Yesterday';
    } else {
      // For other dates, use the month and day
      groupKey = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    
    groups[groupKey].push(notification);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter === 'all' ? 'bg-white shadow' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter === 'unread' ? 'bg-white shadow' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setFilter('unread')}
                >
                  Unread
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter === 'read' ? 'bg-white shadow' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setFilter('read')}
                >
                  Read
                </button>
              </div>
              
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-indigo-600 hover:text-indigo-800"
                disabled={!notifications.some(n => !n.is_read)}
              >
                Mark all as read
              </button>
            </div>
          </div>
          
          <div>
            {isLoading && page === 1 ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-600">
                <p>{error}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0018 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any notifications yet. We'll notify you when there's activity related to your contributions.
                </p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <h3 className="text-lg font-medium text-gray-900">No {filter} notifications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === 'unread' 
                    ? "You've read all your notifications." 
                    : "No notifications match the current filter."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
                  <div key={date} className="px-6 py-4">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{date}</h2>
                    <ul className="space-y-3">
                      {dateNotifications.map((notification) => (
                        <li 
                          key={notification.id} 
                          className={`p-3 rounded-lg cursor-pointer ${
                            notification.is_read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3">
                              {notification.media_thumbnail ? (
                                <div className="w-12 h-12 rounded-lg overflow-hidden">
                                  <img 
                                    src={notification.media_thumbnail} 
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      // Fall back to icon if image fails to load
                                      e.target.style.display = 'none';
                                      e.target.parentNode.classList.add(`bg-${
                                        notification.notification_type === 'comment' ? 'green' : 
                                        notification.notification_type === 'favorite' ? 'amber' : 
                                        notification.notification_type === 'contribution' ? 'purple' : 'blue'
                                      }-100`);
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  notification.notification_type === 'comment' ? 'bg-green-100' : 
                                  notification.notification_type === 'favorite' ? 'bg-amber-100' : 
                                  notification.notification_type === 'contribution' ? 'bg-purple-100' : 'bg-blue-100'
                                }`}>
                                  {notification.notification_type === 'comment' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${notification.is_read ? 'text-green-600' : 'text-green-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                  ) : notification.notification_type === 'favorite' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${notification.is_read ? 'text-amber-600' : 'text-amber-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                  ) : notification.notification_type === 'contribution' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${notification.is_read ? 'text-purple-600' : 'text-purple-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${notification.is_read ? 'text-blue-600' : 'text-blue-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${notification.is_read ? 'text-gray-800' : 'text-gray-900 font-medium'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatNotificationTime(notification.created_at)}
                              </p>
                            </div>
                            {!notification.is_read && (
                              <div className="ml-3">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                
                {/* Load more button */}
                {hasMore && (
                  <div className="px-6 py-4 text-center">
                    <button 
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium focus:outline-none"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </span>
                      ) : (
                        'Load more notifications'
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
