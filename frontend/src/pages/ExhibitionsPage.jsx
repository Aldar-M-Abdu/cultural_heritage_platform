import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ExhibitionsPage = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [featuredExhibition, setFeaturedExhibition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Exhibitions' },
    { id: 'featured', name: 'Featured' },
    { id: 'new', name: 'Newest' },
    { id: 'ancient', name: 'Ancient Civilizations' },
    { id: 'indigenous', name: 'Indigenous Cultures' },
    { id: 'modern', name: 'Modern Heritage' }
  ];

  // Fetch exhibition data
  useEffect(() => {
    const fetchExhibitions = async () => {
      setIsLoading(true);
      try {
        // Replace simulated API call and mock data with actual API call
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
        const response = await fetch(`${API_BASE_URL}/api/v1/exhibitions`);
        if (response.ok) {
          const data = await response.json();
          // Process the real data
          setExhibitions(data);
        } else {
          throw new Error('Failed to fetch exhibitions');
        }
      } catch (err) {
        setError('Failed to load exhibitions. Please try again later.');
        console.error('Error fetching exhibitions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  // Filter exhibitions by category
  const filteredExhibitions = selectedCategory === 'all'
    ? exhibitions
    : exhibitions.filter(ex => ex.categories.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <img
            src="https://images.unsplash.com/photo-1572953109213-3be62398eb95?auto=format&fit=crop&q=80"
            alt="Museum gallery"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-gray-900/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h1 className="text-4xl font-serif font-bold tracking-tight sm:text-5xl md:text-6xl">
            Virtual Exhibitions
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-gray-300">
            Explore curated collections of cultural artifacts, organized into immersive thematic experiences
            that tell the stories of our shared human heritage.
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Featured exhibition */}
            {featuredExhibition && (
              <div className="mb-16">
                <h2 className="sr-only">Featured Exhibition</h2>
                <div className="relative overflow-hidden rounded-xl bg-white shadow-xl">
                  <div className="md:flex">
                    <div className="md:w-2/5 h-64 md:h-auto relative">
                      <img 
                        src={featuredExhibition.imageUrl} 
                        alt={featuredExhibition.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1572953109213-3be62398eb95?auto=format&fit=crop&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r"></div>
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-8 md:p-10 md:w-3/5 relative">
                      <h3 className="text-3xl font-bold text-gray-900">{featuredExhibition.title}</h3>
                      <p className="mt-1 text-lg text-gray-500">{featuredExhibition.subtitle}</p>
                      
                      <p className="mt-4 text-gray-700">{featuredExhibition.description}</p>
                      
                      <div className="mt-6 flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                          {featuredExhibition.curator.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{featuredExhibition.curator}</p>
                          <p className="text-sm text-gray-500">{featuredExhibition.curatorTitle}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          {featuredExhibition.itemCount} Artifacts
                        </div>
                        <div className="flex items-center">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {featuredExhibition.viewCount.toLocaleString()} Views
                        </div>
                        <div>{featuredExhibition.date}</div>
                      </div>
                      
                      <div className="mt-8">
                        <Link
                          to={`/exhibitions/${featuredExhibition.id}`}
                          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Explore Exhibition
                          <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Category filters */}
            <div className="mb-10">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`
                        whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                        ${selectedCategory === category.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                      `}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            
            {/* Exhibitions grid */}
            {filteredExhibitions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredExhibitions.map(exhibition => (
                  <div 
                    key={exhibition.id} 
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                      <img
                        src={exhibition.imageUrl}
                        alt={exhibition.title}
                        className="object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1572953109213-3be62398eb95?auto=format&fit=crop&q=80";
                        }}
                      />
                    </div>
                    <div className="p-6 flex-grow">
                      <h3 className="text-xl font-bold text-gray-900">{exhibition.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{exhibition.subtitle}</p>
                      <p className="mt-3 text-base text-gray-600 line-clamp-3">{exhibition.description}</p>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {exhibition.itemCount} items
                      </div>
                      <Link
                        to={`/exhibitions/${exhibition.id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center border">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No exhibitions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try changing your filter selection or check back later for new exhibitions.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExhibitionsPage;
