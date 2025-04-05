import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TimelinePage = () => {
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPeriod, setExpandedPeriod] = useState(null);

  // Timeline periods data (in real app this would come from an API)
  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          name: 'Prehistoric',
          startYear: 'c. 2.5 million BCE',
          endYear: 'c. 3,000 BCE',
          color: 'bg-amber-100 border-amber-500',
          description: 'The earliest period of human existence before written records, characterized by stone tools and cave art.',
          artifacts: [
            { id: 101, title: 'Cave Paintings at Lascaux', image: '/images/prehistoric-cave.jpg', region: 'France' },
            { id: 102, title: 'Venus of Willendorf', image: '/images/venus-figurine.jpg', region: 'Austria' },
            { id: 103, title: 'Stonehenge Megalith', image: '/images/stonehenge.jpg', region: 'England' }
          ]
        },
        {
          id: 2,
          name: 'Ancient Civilizations',
          startYear: 'c. 3,000 BCE',
          endYear: 'c. 500 CE',
          color: 'bg-emerald-100 border-emerald-500',
          description: 'The rise of the first complex urban societies in Mesopotamia, Egypt, China, and the Americas.',
          artifacts: [
            { id: 201, title: 'Code of Hammurabi', image: '/images/code-hammurabi.jpg', region: 'Mesopotamia' },
            { id: 202, title: 'Tutankhamun\'s Mask', image: '/images/tutankhamun.jpg', region: 'Egypt' },
            { id: 203, title: 'Terracotta Army', image: '/images/terracotta.jpg', region: 'China' }
          ]
        },
        {
          id: 3,
          name: 'Medieval Period',
          startYear: 'c. 500 CE',
          endYear: 'c. 1500 CE', 
          color: 'bg-blue-100 border-blue-500',
          description: 'A period characterized by feudalism, the rise of Christianity and Islam, and distinctive art and architecture.',
          artifacts: [
            { id: 301, title: 'Bayeux Tapestry', image: '/images/bayeux.jpg', region: 'France' },
            { id: 302, title: 'Book of Kells', image: '/images/book-kells.jpg', region: 'Ireland' },
            { id: 303, title: 'Alhambra Palace', image: '/images/alhambra.jpg', region: 'Spain' }
          ]
        },
        {
          id: 4,
          name: 'Renaissance',
          startYear: 'c. 1400 CE',
          endYear: 'c. 1600 CE',
          color: 'bg-purple-100 border-purple-500',
          description: 'An era of cultural rebirth marked by renewed interest in classical learning, arts, and scientific inquiry.',
          artifacts: [
            { id: 401, title: 'Mona Lisa', image: '/images/mona-lisa.jpg', region: 'Italy' },
            { id: 402, title: 'Gutenberg Bible', image: '/images/gutenberg.jpg', region: 'Germany' },
            { id: 403, title: 'Vitruvian Man', image: '/images/vitruvian.jpg', region: 'Italy' }
          ]
        },
        {
          id: 5,
          name: 'Modern Era',
          startYear: 'c. 1600 CE',
          endYear: 'Present',
          color: 'bg-rose-100 border-rose-500',
          description: 'The period of industrialization, technological advancement, and globalization that has shaped our contemporary world.',
          artifacts: [
            { id: 501, title: 'Gutenberg Printing Press', image: '/images/press.jpg', region: 'Germany' },
            { id: 502, title: 'Steam Engine Model', image: '/images/steam.jpg', region: 'England' },
            { id: 503, title: 'First Computer ENIAC', image: '/images/eniac.jpg', region: 'United States' }
          ]
        }
      ];
      
      setPeriods(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handlePeriodClick = (periodId) => {
    setExpandedPeriod(expandedPeriod === periodId ? null : periodId);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-serif font-bold mb-4">Historical Timeline</h1>
          <p className="text-lg text-indigo-100 max-w-3xl">
            Explore our collection of cultural artifacts across the span of human history,
            from prehistoric times to the modern era.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {period.artifacts.map(artifact => (
                          <Link 
                            key={artifact.id} 
                            to={`/items/${artifact.id}`} 
                            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                              {/* This would be an actual image in production */}
                              <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                                [Image: {artifact.title}]
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-medium text-gray-900">{artifact.title}</h4>
                              <p className="text-sm text-gray-500">{artifact.region}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      
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
      </div>
    </div>
  );
};

export default TimelinePage;
