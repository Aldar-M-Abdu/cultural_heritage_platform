import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { API_BASE_URL } from '../config';

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
  const navigate = useNavigate();

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
            <LoadingSpinner size="lg" color="indigo" />
          </div>
        ) : error ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
            <p className="text-gray-500">We couldn't find any {activeFilter} events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <div 
                key={event.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 hover:shadow-lg cursor-pointer"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                {/* Event image */}
                <div className="relative h-48 bg-indigo-100 overflow-hidden">
                  {isToday(event.start_date) && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 font-medium text-sm z-10">
                      Today
                    </div>
                  )}
                  <img 
                    src={event.image_url || "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80"} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
                
                {/* Event details */}
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.is_free ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {event.is_free ? 'Free Entry' : 'Paid Event'}
                    </span>
                    {event.event_type && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {event.event_type}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{formatEventDate(event.start_date)}</p>
                  
                  {event.location && (
                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                  
                  <div className="line-clamp-3 text-sm text-gray-600 mb-4">
                    {event.description || 'No description available for this event.'}
                  </div>
                  
                  <button
                    className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/events/${event.id}`);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
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
