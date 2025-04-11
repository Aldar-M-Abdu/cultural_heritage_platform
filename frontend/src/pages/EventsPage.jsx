import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Fallback data to use when API fails
const fallbackEvents = [
  {
    id: "e1b5e9c0-1c5d-4e3f-9b4a-8c2d7f5a6e3b",
    title: "Ancient Egypt Exhibition",
    description: "Explore the treasures of Ancient Egypt in this special exhibition featuring artifacts on loan from the Cairo Museum.",
    start_date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    end_date: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    location: "National Museum of History",
    image_url: "https://images.unsplash.com/photo-1608425029454-6427b5fbe635?auto=format&fit=crop&q=80",
    is_free: true,
    event_type: "Exhibition"
  },
  {
    id: "a2c3e4f5-6d7e-8f9a-0b1c-2d3e4f5a6b7c",
    title: "Cultural Heritage Preservation Workshop",
    description: "A hands-on workshop teaching techniques for preserving and restoring cultural artifacts. Led by conservation experts.",
    start_date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    end_date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Same day
    location: "City Cultural Center",
    image_url: "https://images.unsplash.com/photo-1579762593175-20226054cad0?auto=format&fit=crop&q=80",
    is_free: false,
    event_type: "Workshop"
  },
  {
    id: "f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c",
    title: "Indigenous Art and Music Festival",
    description: "Celebrating the rich artistic traditions of indigenous cultures with performances, exhibitions, and interactive demonstrations.",
    start_date: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    end_date: new Date(new Date().getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days ago
    location: "Community Heritage Park",
    image_url: "https://images.unsplash.com/photo-1560095215-54da28f7833b?auto=format&fit=crop&q=80",
    is_free: true,
    event_type: "Festival"
  }
];

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const eventsPerPage = 6;
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Create AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const url = `${API_BASE_URL}/api/v1/events/?page=${currentPage}&limit=${eventsPerPage}&filter_type=${activeFilter}`;
        
        // First attempt - primary endpoint
        let response;
        try {
          response = await fetch(url, { signal: controller.signal });
        } catch (fetchError) {
          console.warn('Primary endpoint fetch failed:', fetchError);
          
          // Try alternative endpoint if first one fails or times out
          try {
            response = await fetch(`${API_BASE_URL}/events/?page=${currentPage}&limit=${eventsPerPage}&filter_type=${activeFilter}`, { 
              signal: AbortSignal.timeout(5000) 
            });
          } catch (altFetchError) {
            console.warn('Alternative endpoint fetch failed:', altFetchError);
            throw new Error('All endpoints failed');
          }
        }
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Event data received:', data);
        
        // Process the response data based on its structure
        let processedEvents = [];
        let totalItems = 0;
        
        // Handle array response
        if (Array.isArray(data)) {
          processedEvents = data;
          totalItems = data.length > eventsPerPage ? eventsPerPage * 2 : data.length; // Estimate total
        } 
        // Handle paginated response with items array
        else if (data && data.items && Array.isArray(data.items)) {
          processedEvents = data.items;
          totalItems = data.total || data.count || processedEvents.length;
        }
        // Handle other response structures
        else {
          // Try to extract events from other common response formats
          processedEvents = data.events || data.data || data.results || [];
          totalItems = data.total_count || data.count || processedEvents.length;
        }
        
        // Standardize the event data structure
        const normalizedEvents = processedEvents.map(event => ({
          id: event.id,
          title: event.title || 'Untitled Event',
          description: event.description || '',
          start_date: event.start_date || event.startDate || event.start_time || new Date().toISOString(),
          end_date: event.end_date || event.endDate || event.end_time,
          location: event.location || 'Online Event',
          image_url: event.image_url || event.imageUrl || event.image,
          is_free: event.is_free || event.isFree || false,
          event_type: event.event_type || event.type || event.category || 'Event'
        }));
        
        setEvents(normalizedEvents);
        setTotalPages(Math.ceil(totalItems / eventsPerPage) || 1);
        
      } catch (err) {
        console.error('Error fetching events:', err);
        
        // Filter fallback data based on the active filter
        let filteredFallbackEvents = [...fallbackEvents];
        const now = new Date();
        
        if (activeFilter === 'upcoming') {
          filteredFallbackEvents = fallbackEvents.filter(event => 
            new Date(event.start_date) > now
          );
        } else if (activeFilter === 'past') {
          filteredFallbackEvents = fallbackEvents.filter(event => 
            new Date(event.start_date) <= now
          );
        }
        
        setEvents(filteredFallbackEvents);
        setTotalPages(Math.ceil(filteredFallbackEvents.length / eventsPerPage) || 1);
        setError('Unable to connect to the server. Showing sample events instead.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [activeFilter, currentPage, eventsPerPage, API_BASE_URL]);
  
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
    try {
      const options = { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      console.error('Date formatting error:', e);
      return 'Date unavailable';
    }
  };
  
  // Check if an event is happening today
  const isToday = (dateString) => {
    try {
      const today = new Date();
      const eventDate = new Date(dateString);
      return eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear();
    } catch (e) {
      return false;
    }
  };

  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80";
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
        
        {/* Error message display */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-lg mb-8">
            <div className="flex">
              <svg className="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
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
                          onError={handleImageError}
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
