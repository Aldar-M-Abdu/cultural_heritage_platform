import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../stores/authStore';
import { API_BASE_URL, fetchWithAuth } from '../config';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);

  useEffect(() => {
    const fetchEventData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch the event by ID
        const response = await fetch(`${API_BASE_URL}/api/v1/events/${id}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const eventData = await response.json();
        setEvent(eventData);
        
        // Optionally fetch related events (same event_type)
        if (eventData.event_type) {
          try {
            const relatedResponse = await fetch(
              `${API_BASE_URL}/api/v1/events/?limit=3&filter_type=${eventData.event_type !== 'all' ? 'all' : 'upcoming'}`
            );
            
            if (relatedResponse.ok) {
              const relatedData = await relatedResponse.json();
              // Filter out the current event and limit to 3 items
              const filteredEvents = relatedData.items
                ? relatedData.items.filter(item => item.id !== id).slice(0, 3)
                : [];
              setRelatedEvents(filteredEvents);
            }
          } catch (relatedErr) {
            console.error('Failed to fetch related events:', relatedErr);
            // Non-critical error, don't set main error state
          }
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details. It may have been removed or you may not have permission to view it.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEventData();
  }, [id]);

  // Format date with proper handling of invalid dates
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Date not specified';
      const date = new Date(dateString);
      return format(date, 'EEEE, MMMM do, yyyy h:mm a');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };
  
  const formatDateRange = (startDate, endDate) => {
    try {
      const start = new Date(startDate);
      
      // If no end date or same day event
      if (!endDate) {
        return formatDate(startDate);
      }
      
      const end = new Date(endDate);
      
      // If same day event with different times
      if (start.toDateString() === end.toDateString()) {
        return `${format(start, 'EEEE, MMMM do, yyyy')} from ${format(start, 'h:mm a')} to ${format(end, 'h:mm a')}`;
      }
      
      // Multi-day event
      return `${format(start, 'MMMM do, yyyy')} to ${format(end, 'MMMM do, yyyy')}`;
    } catch (error) {
      console.error('Date range formatting error:', error);
      return 'Date information unavailable';
    }
  };

  // Handle image errors
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://images.unsplash.com/photo-1560095215-54da28f7833b?auto=format&fit=crop&q=80";
  };

  // Check if event is free
  const getEventPriceLabel = () => {
    if (!event) return '';
    return event.is_free ? 'Free Entry' : 'Paid Event';
  };

  // Check if event has already happened
  const isEventPast = () => {
    if (!event || !event.end_date) return false;
    const now = new Date();
    const endDate = new Date(event.end_date);
    return endDate < now;
  };

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" color="indigo" />
      </div>
    );
  }

  // Show error message if event couldn't be loaded
  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-10 text-center">
            <svg className="h-16 w-16 text-indigo-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19H19a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Event not found'}</h2>
            <p className="text-gray-600 mb-6">The event may have been removed or is no longer available.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-700 hover:bg-indigo-800"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate('/events')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                View All Events
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-800 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-7/12 pr-0 lg:pr-8">
              <div className="flex items-center space-x-2 text-sm text-purple-200 mb-4">
                <a href="/events" className="hover:text-white">Events</a>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="truncate">{event.title}</span>
              </div>
              <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">{event.title}</h1>
              
              {/* Event status badge */}
              <div className="flex flex-wrap items-center mt-2 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isEventPast() ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                  {isEventPast() ? 'Past Event' : 'Upcoming Event'}
                </span>
                <span className="inline-flex items-center ml-3 px-3 py-1 rounded-full text-xs font-medium bg-indigo-200 text-indigo-800">
                  {event.event_type || 'Event'}
                </span>
                <span className="inline-flex items-center ml-3 px-3 py-1 rounded-full text-xs font-medium bg-purple-200 text-purple-800">
                  {getEventPriceLabel()}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center text-purple-200 mb-4">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDateRange(event.start_date, event.end_date)}</span>
              </div>
              
              {event.location && (
                <div className="flex flex-wrap items-center text-purple-200 mb-6">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
              )}
            </div>
            
            <div className="w-full lg:w-5/12 mt-8 lg:mt-0">
              <div className="relative h-64 lg:h-80 overflow-hidden rounded-xl shadow-lg">
                <img 
                  src={event.image_url || "https://images.unsplash.com/photo-1560095215-54da28f7833b?auto=format&fit=crop&q=80"} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
          
          <div className="prose prose-indigo max-w-none">
            {event.description ? (
              <div dangerouslySetInnerHTML={{ __html: event.description.replace(/\n/g, '<br />') }} />
            ) : (
              <p className="text-gray-500 italic">No detailed description available for this event.</p>
            )}
          </div>
          
          {/* Additional event information */}
          <div className="mt-10 border-t border-gray-200 pt-8">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Date and Time</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDateRange(event.start_date, event.end_date)}</dd>
              </div>
              {event.location && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">{event.location}</dd>
                </div>
              )}
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Event Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{event.event_type || 'General Event'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Admission</dt>
                <dd className="mt-1 text-sm text-gray-900">{getEventPriceLabel()}</dd>
              </div>
            </dl>
          </div>
          
          {/* Call to action buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            {!isEventPast() && (
              <>
                {isAuthenticated && (
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add to Calendar
                  </button>
                )}
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Share Event
                </button>
              </>
            )}
            <button 
              onClick={() => navigate('/events')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Events
            </button>
          </div>
        </div>
        
        {/* Related events */}
        {relatedEvents.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((relatedEvent) => (
                <div 
                  key={relatedEvent.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 cursor-pointer"
                  onClick={() => navigate(`/events/${relatedEvent.id}`)}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={relatedEvent.image_url || "https://images.unsplash.com/photo-1560095215-54da28f7833b?auto=format&fit=crop&q=80"}
                      alt={relatedEvent.title}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{relatedEvent.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{formatDate(relatedEvent.start_date)}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${relatedEvent.is_free ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {relatedEvent.is_free ? 'Free' : 'Paid'}
                      </span>
                      {relatedEvent.event_type && (
                        <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                          {relatedEvent.event_type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage; 