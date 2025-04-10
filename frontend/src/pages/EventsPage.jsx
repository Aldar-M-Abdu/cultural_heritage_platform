import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const eventsPerPage = 6;

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
        // Use AbortController for better timeout control
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const url = `${API_BASE_URL}/api/v1/events/?page=${currentPage}&limit=${eventsPerPage}&filter_type=${activeFilter}`;
        
        try {
          const response = await fetch(url, {
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.status}`);
          }
          
          const data = await response.json();
          
          // If the API returns an array directly
          if (Array.isArray(data)) {
            setEvents(data);
            // Estimate total pages based on whether we got a full page of events
            setTotalPages(data.length < eventsPerPage ? currentPage : currentPage + 1);
          } 
          // If the API returns an object with data and pagination info
          else if (data && data.items && Array.isArray(data.items)) {
            setEvents(data.items);
            setTotalPages(Math.ceil(data.total / eventsPerPage) || 1);
          }
          // Fallback for unexpected response format
          else {
            console.warn('Unexpected API response format:', data);
            setEvents([]);
            setTotalPages(1);
          }
        } catch (fetchError) {
          if (fetchError.name === 'AbortError') {
            throw new Error('Request timed out. Please try again later.');
          }
          throw fetchError;
        }
      } catch (err) {
        console.error('Error in fetchEvents:', err);
        setError('Failed to load events. Please try again later.');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [activeFilter, currentPage, eventsPerPage]);
  
  const handleFilterChange = (filter) => {
    if (filter !== activeFilter) {
      setActiveFilter(filter);
      setCurrentPage(1);
    }
  };
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Format date for display
  const formatEventDate = (dateString) => {
    const options = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Check if an event is happening today
  const isToday = (dateString) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    return eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-800 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-serif font-bold tracking-tight sm:text-5xl">Events & Programs</h1>
          <p className="mt-4 max-w-3xl text-xl text-purple-100">
            Join us for exhibitions, workshops, and special programs exploring cultural heritage from around the world.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter controls */}
        <div className="flex space-x-4 mb-8">
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              activeFilter === 'upcoming'
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => handleFilterChange('upcoming')}
          >
            Upcoming Events
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              activeFilter === 'past'
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => handleFilterChange('past')}
          >
            Past Events
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              activeFilter === 'all'
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => handleFilterChange('all')}
          >
            All Events
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : events.length > 0 ? (
          <>
            {/* Events grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <article 
                  key={event.id} 
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Link to={`/events/${event.id}`}>
                    <div className="relative h-48 bg-gray-200">
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-100">
                          <svg className="h-16 w-16 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Event badges */}
                      <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        {isToday(event.start_date) && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Today
                          </span>
                        )}
                        {event.is_free && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Free
                          </span>
                        )}
                        {event.event_type && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {event.event_type}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="text-sm text-indigo-600 mb-2">
                        {formatEventDate(event.start_date)}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {event.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {event.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.location || 'Online Event'}</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages).keys()].map(page => (
                    <button
                      key={page + 1}
                      onClick={() => handlePageChange(page + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page + 1
                          ? 'bg-indigo-100 text-indigo-800 font-medium'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-gray-500">
              {activeFilter === 'upcoming'
                ? "There are no upcoming events scheduled at this time. Please check back later."
                : activeFilter === 'past'
                ? "There are no past events in our records."
                : "No events found matching your criteria."}
            </p>
          </div>
        )}
      </div>
      
      {/* CTA Section */}
      <div className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl p-8 md:p-12 shadow-xl text-white">
            <div className="md:flex items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-2xl font-bold mb-2">Stay Updated on Events</h2>
                <p className="text-indigo-100">
                  Subscribe to our newsletter to get notified about upcoming exhibitions, workshops, and cultural events.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  to="/newsletter"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white"
                >
                  Subscribe Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
