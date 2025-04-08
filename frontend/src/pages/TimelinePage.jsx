import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import axios from 'axios';

const TimelinePage = () => {
  const [periods, setPeriods] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPeriod, setExpandedPeriod] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [view, setView] = useState('timeline'); // 'timeline' or 'events'
  const [eventFilter, setEventFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch period data
        const periodsResponse = await axios.get('/api/v1/periods');
        const periodsData = periodsResponse.data || [];

        // Process period names and create unique array
        const uniquePeriodNames = [...new Set(periodsData.map(item => item.name))];

        // Group items by period
        const periodItems = periodsData.filter(item => item.time_period);

        const timelinePeriods = uniquePeriodNames.map((periodName, index) => {
          const colors = [
            'bg-amber-100 border-amber-500',
            'bg-emerald-100 border-emerald-500',
            'bg-blue-100 border-blue-500',
            'bg-purple-100 border-purple-500',
            'bg-rose-100 border-rose-500'
          ];

          const artifacts = periodItems.slice(0, 3).map(item => ({
            id: item.id,
            title: item.title,
            image: item.image_url || '/images/placeholder.jpg',
            region: item.region || 'Unknown'
          }));

          // Extract years from period name or use defaults
          const yearMatch = periodName.match(/\((\d+).*?(\d+).*?\)/);
          const startYear = yearMatch ? yearMatch[1] : `${2000 - (index * 500)} BCE`;
          const endYear = yearMatch ? yearMatch[2] : `${1500 - (index * 500)} BCE`;

          return {
            id: index + 1,
            name: periodName.replace(/\(.*?\)/g, '').trim(),
            startYear,
            endYear,
            color: colors[index % colors.length],
            description: `Collection of artifacts from the ${periodName} era.`,
            artifacts
          };
        });

        // Sort periods
        timelinePeriods.sort((a, b) => {
          const extractYear = (yearStr) => {
            if (!yearStr) return 0;
            const match = yearStr.match(/(\d+)/);
            return match ? parseInt(match[0]) : 0;
          };

          const aYear = extractYear(a.startYear);
          const bYear = extractYear(b.startYear);

          return aYear - bYear;
        });

        // Fetch events data
        const eventsResponse = await axios.get('/api/v1/events');
        const eventsData = eventsResponse.data;

        // Process events data
        const formattedEvents = Array.isArray(eventsData) ? eventsData.map(event => ({
          ...event,
          startDate: new Date(event.start_date),
          endDate: event.end_date ? new Date(event.end_date) : null,
          formattedStartDate: new Date(event.start_date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          formattedEndDate: event.end_date ? new Date(event.end_date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }) : null,
          isUpcoming: new Date(event.start_date) > new Date()
        })) : [];

        setPeriods(timelinePeriods);
        setEvents(formattedEvents);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load timeline data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePeriodClick = (periodId) => {
    setExpandedPeriod(expandedPeriod === periodId ? null : periodId);
  };

  const handleEventClick = (eventId) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  // Filter events based on the current filter
  const filteredEvents = events.filter(event => {
    const now = new Date();
    if (eventFilter === 'upcoming') return event.startDate > now;
    if (eventFilter === 'past') return event.startDate <= now;
    return true; // 'all' filter
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-serif font-bold mb-4">Cultural Timeline</h1>
          <p className="text-lg text-indigo-100 max-w-3xl">
            Explore our collection of cultural artifacts across the span of human history,
            and discover upcoming and past events related to cultural heritage.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View toggler */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setView('timeline')}
              className={`px-5 py-2.5 text-sm font-medium rounded-l-lg ${
                view === 'timeline'
                  ? 'text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-indigo-300'
                  : 'text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-indigo-700 focus:ring-gray-200'
              }`}
            >
              Historical Timeline
            </button>
            <button
              type="button"
              onClick={() => setView('events')}
              className={`px-5 py-2.5 text-sm font-medium rounded-r-lg ${
                view === 'events'
                  ? 'text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-indigo-300'
                  : 'text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-indigo-700 focus:ring-gray-200'
              }`}
            >
              Cultural Events
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" color="indigo" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {view === 'timeline' ? (
              /* Historical Timeline View */
              <>
                {periods.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No timeline data available. Please add cultural items with time periods to see them here.</p>
                  </div>
                ) : (
                  <>
                    <div className="relative mb-16">
                      <div className="absolute left-0 w-full h-1 bg-gray-200 top-8"></div>
                      <div className="relative flex justify-between">
                        {periods.map((period, index) => (
                          <div key={period.id} className="flex flex-col items-center relative" style={{width: `${100 / periods.length}%`}}>
                            <div className={`w-16 h-16 rounded-full ${period.color.split(' ')[0]} border-4 ${period.color.split(' ')[1]} flex items-center justify-center z-10 cursor-pointer`}
                              onClick={() => handlePeriodClick(period.id)}>
                              <span className="text-xs font-bold">{period.id}</span>
                            </div>
                            <div className="text-center mt-2">
                              <h3 className="text-sm font-medium md:text-base">{period.name}</h3>
                              <p className="text-xs text-gray-500">{period.startYear}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-12">
                      {periods.map((period) => (
                        <div key={period.id} 
                          className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                            expandedPeriod === period.id ? 'ring-2 ring-indigo-500' : ''
                          }`}>
                          <div 
                            className={`cursor-pointer p-6 flex justify-between items-center border-l-4 ${period.color.split(' ')[1]}`}
                            onClick={() => handlePeriodClick(period.id)}>
                            <div>
                              <h2 className="text-2xl font-bold text-gray-900">{period.name}</h2>
                              <p className="text-sm text-gray-500">{period.startYear} to {period.endYear}</p>
                            </div>
                            <svg 
                              className={`w-6 h-6 text-gray-500 transform transition-transform ${expandedPeriod === period.id ? 'rotate-180' : ''}`} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>

                          {expandedPeriod === period.id && (
                            <div className="p-6 bg-gray-50">
                              <p className="text-gray-700 mb-6">{period.description}</p>
                              
                              <h3 className="text-lg font-medium text-gray-900 mb-4">Notable Artifacts</h3>
                              {period.artifacts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {period.artifacts.map(artifact => (
                                    <Link 
                                      key={artifact.id} 
                                      to={`/items/${artifact.id}`} 
                                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                        {artifact.image ? (
                                          <img 
                                            src={artifact.image} 
                                            alt={artifact.title} 
                                            className="object-cover h-full w-full"
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = '/images/placeholder.jpg';
                                            }}
                                          />
                                        ) : (
                                          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                                            No image available
                                          </div>
                                        )}
                                      </div>
                                      <div className="p-4">
                                        <h4 className="font-medium text-gray-900">{artifact.title}</h4>
                                        <p className="text-sm text-gray-500">{artifact.region}</p>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 italic">No artifacts available for this period.</p>
                              )}
                              
                              <div className="mt-6 flex justify-end">
                                <Link
                                  to={`/items?period=${encodeURIComponent(period.name)}`}
                                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                                >
                                  View all artifacts from this period
                                  <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              /* Events View */
              <>
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Cultural Heritage Events</h2>
                    
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                      <button
                        type="button"
                        onClick={() => setEventFilter('upcoming')}
                        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                          eventFilter === 'upcoming'
                            ? 'text-white bg-indigo-700'
                            : 'text-gray-900 bg-white border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        Upcoming
                      </button>
                      <button
                        type="button"
                        onClick={() => setEventFilter('past')}
                        className={`px-4 py-2 text-sm font-medium ${
                          eventFilter === 'past'
                            ? 'text-white bg-indigo-700'
                            : 'text-gray-900 bg-white border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        Past
                      </button>
                      <button
                        type="button"
                        onClick={() => setEventFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                          eventFilter === 'all'
                            ? 'text-white bg-indigo-700'
                            : 'text-gray-900 bg-white border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        All Events
                      </button>
                    </div>
                  </div>
                </div>
                
                {filteredEvents.length === 0 ? (
                  <div className="bg-white rounded-lg p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-100">
                      <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No {eventFilter} events found</h2>
                    <p className="text-gray-600">
                      {eventFilter === 'upcoming' 
                        ? 'There are no upcoming events scheduled at the moment. Please check back later.' 
                        : eventFilter === 'past' 
                          ? 'There are no past events in our records yet.'
                          : 'No events found in our database.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredEvents.map((event) => (
                      <div 
                        key={event.id}
                        className={`bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 ${
                          expandedEvent === event.id ? 'ring-2 ring-indigo-500' : ''
                        }`}
                      >
                        <div 
                          className={`cursor-pointer p-6 flex justify-between items-center border-l-4 ${
                            event.isUpcoming ? 'border-emerald-500' : 'border-amber-500'
                          }`}
                          onClick={() => handleEventClick(event.id)}
                        >
                          <div>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${
                              event.isUpcoming ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {event.isUpcoming ? 'Upcoming' : 'Past'}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
                            <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500">
                              <div className="flex items-center mr-4">
                                <svg className="mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {event.formattedStartDate}{event.formattedEndDate ? ` - ${event.formattedEndDate}` : ''}
                              </div>
                              {event.location && (
                                <div className="flex items-center">
                                  <svg className="mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {event.location}
                                </div>
                              )}
                            </div>
                          </div>
                          <svg 
                            className={`w-6 h-6 text-gray-500 transform transition-transform ${expandedEvent === event.id ? 'rotate-180' : ''}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>

                        {expandedEvent === event.id && (
                          <div className="p-6 bg-gray-50">
                            {event.description && (
                              <p className="text-gray-700 mb-6">{event.description}</p>
                            )}
                            
                            {event.cultural_items && event.cultural_items.length > 0 && (
                              <>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Related Artifacts</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {event.cultural_items.map(item => (
                                    <Link 
                                      key={item.id} 
                                      to={`/items/${item.id}`} 
                                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                    >
                                      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                        {item.image_url ? (
                                          <img 
                                            src={item.image_url} 
                                            alt={item.title} 
                                            className="object-cover h-full w-full"
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = '/images/placeholder.jpg';
                                            }}
                                          />
                                        ) : (
                                          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                                            No image available
                                          </div>
                                        )}
                                      </div>
                                      <div className="p-4">
                                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                                        {item.region && <p className="text-sm text-gray-500">{item.region}</p>}
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TimelinePage;
