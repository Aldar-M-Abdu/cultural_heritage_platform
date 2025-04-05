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
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockExhibitions = [
          {
            id: 1,
            title: "Ancient Egyptian Treasures",
            subtitle: "Artifacts from the Old, Middle, and New Kingdoms",
            description: "Explore the magnificent treasures of Ancient Egypt through a curated collection of artifacts spanning over 3,000 years of history. From intricate jewelry to monumental sculptures, discover the artistic and technological achievements of one of history's most fascinating civilizations.",
            curator: "Dr. Emma Richardson",
            curatorTitle: "Egyptologist",
            itemCount: 43,
            viewCount: 12540,
            date: "February 15, 2025",
            imageUrl: "https://images.unsplash.com/photo-1608412759225-8cb7f42eb7fb?auto=format&fit=crop&q=80",
            categories: ['ancient', 'featured'],
            featured: true
          },
          {
            id: 2,
            title: "Indigenous Art of the Americas",
            subtitle: "Pre-Columbian to Contemporary Works",
            description: "This exhibition highlights the rich artistic traditions of Indigenous peoples across North, Central, and South America. Featuring everything from ancient ceramics to contemporary paintings, the collection showcases the continuity and evolution of Indigenous artistic expression.",
            curator: "Maria Gonzalez",
            curatorTitle: "Cultural Anthropologist",
            itemCount: 67,
            viewCount: 8930,
            date: "January 20, 2025",
            imageUrl: "https://images.unsplash.com/photo-1628982078584-9525bf26f5c6?auto=format&fit=crop&q=80",
            categories: ['indigenous', 'featured'],
            featured: true
          },
          {
            id: 3,
            title: "The Silk Road: Cultural Exchange",
            subtitle: "Objects from the Ancient Trade Routes",
            description: "Follow the historic Silk Road through this exhibition of artifacts that showcase how ideas, technologies, and artistic styles spread across Asia and Europe. Explore textiles, ceramics, manuscripts, and more that reveal the rich cultural exchange facilitated by these ancient trade networks.",
            curator: "Dr. Liu Wei",
            curatorTitle: "Asian Studies Expert",
            itemCount: 58,
            viewCount: 7340,
            date: "March 5, 2025",
            imageUrl: "https://images.unsplash.com/photo-1566386698798-64519daaf72d?auto=format&fit=crop&q=80",
            categories: ['ancient'],
            featured: false
          },
          {
            id: 4,
            title: "Industrial Revolution Innovations",
            subtitle: "Technological Advances that Changed Society",
            description: "Discover the machines, tools, and inventions that transformed society during the Industrial Revolution. This exhibition features early industrial artifacts and explains how these innovations fundamentally changed how people lived, worked, and related to each other.",
            curator: "Thomas Wright",
            curatorTitle: "Industrial Historian",
            itemCount: 35,
            viewCount: 5670,
            date: "March 18, 2025",
            imageUrl: "https://images.unsplash.com/photo-1569930784237-ea65a2479c7e?auto=format&fit=crop&q=80",
            categories: ['modern'],
            featured: false
          },
          {
            id: 5,
            title: "Written Through Time",
            subtitle: "Evolution of Writing Systems",
            description: "Trace the development of human writing systems from ancient cuneiform and hieroglyphics to modern alphabets. This exhibition features tablets, manuscripts, and inscriptions that show how the written word has evolved across different cultures and time periods.",
            curator: "Dr. Sarah Johnson",
            curatorTitle: "Linguistic Anthropologist",
            itemCount: 51,
            viewCount: 9210,
            date: "February 2, 2025",
            imageUrl: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80",
            categories: ['ancient'],
            featured: false
          },
          {
            id: 6,
            title: "Indigenous Technologies",
            subtitle: "Traditional Knowledge and Innovation",
            description: "Explore the sophisticated technologies developed by Indigenous peoples around the world, from water management systems to sustainable agricultural practices. This exhibition challenges common misconceptions and highlights the ingenuity of traditional knowledge systems.",
            curator: "Robert Eagle",
            curatorTitle: "Indigenous Studies Scholar",
            itemCount: 40,
            viewCount: 4890,
            date: "April 1, 2025",
            imageUrl: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80",
            categories: ['indigenous', 'new'],
            featured: false
          },
          {
            id: 7,
            title: "Cultural Heritage in the Digital Age",
            subtitle: "New Technologies in Preservation",
            description: "See how cutting-edge technologies like 3D scanning, augmented reality, and artificial intelligence are being used to document, preserve, and share cultural heritage. This exhibition showcases innovative projects from around the world that are helping to safeguard our shared cultural legacy.",
            curator: "Dr. Michael Chen",
            curatorTitle: "Digital Heritage Specialist",
            itemCount: 28,
            viewCount: 6780,
            date: "March 30, 2025",
            imageUrl: "https://images.unsplash.com/photo-1531279550271-23c2a77a765c?auto=format&fit=crop&q=80",
            categories: ['modern', 'new'],
            featured: false
          }
        ];

        // Set featured exhibition as the first featured one
        const featured = mockExhibitions.find(ex => ex.featured);
        setFeaturedExhibition(featured);
        
        // Set all exhibitions
        setExhibitions(mockExhibitions);
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
