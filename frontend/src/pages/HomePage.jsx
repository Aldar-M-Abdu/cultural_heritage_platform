import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CulturalItemCard from '../components/CulturalItemCard';
import ItemSearchBar from '../components/ItemSearchBar';

// Sample fallback data in case API calls fail
const fallbackItems = [
  {
    id: 1,
    title: "Ancient Greek Amphora",
    region: "Greece",
    time_period: "Classical Period (480-323 BCE)",
    description: "Decorated ceramic vessel used for the transport and storage of wine, olive oil and other goods.",
    image_url: "https://images.unsplash.com/photo-1603966187872-3a0f12839769?auto=format&fit=crop&q=80",
    tags: [{ id: 1, name: "Pottery" }, { id: 2, name: "Greek" }]
  },
  {
    id: 2,
    title: "Viking Silver Bracelet",
    region: "Scandinavia",
    time_period: "Viking Age (793-1066 CE)",
    description: "Intricately twisted silver arm ring with animal head terminals, used as both adornment and currency.",
    image_url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80",
    tags: [{ id: 3, name: "Jewelry" }, { id: 4, name: "Viking" }]
  },
  {
    id: 3,
    title: "Mayan Jade Mask",
    region: "Mesoamerica",
    time_period: "Late Classic Period (600-900 CE)",
    description: "Ceremonial mask carved from jade, representing the Mayan death god.",
    image_url: "https://images.unsplash.com/photo-1590687755451-3c8552186068?auto=format&fit=crop&q=80",
    tags: [{ id: 5, name: "Mask" }, { id: 6, name: "Mayan" }]
  }
];

const HomePage = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        // Fetch featured items with timeout and retry
        const featuredPromise = fetch('/api/v1/cultural-items/featured', { 
          signal: AbortSignal.timeout(5000) // 5 second timeout
        })
          .then(response => {
            if (!response.ok) throw new Error('Failed to fetch featured items');
            return response.json();
          })
          .catch(err => {
            console.error('Featured items fetch error:', err);
            // Return fallback data on error
            return { items: fallbackItems };
          });

        // Fetch recent items with timeout and retry
        const recentPromise = fetch('/api/v1/cultural-items?sort=created_at&limit=3', {
          signal: AbortSignal.timeout(5000)
        })
          .then(response => {
            if (!response.ok) throw new Error('Failed to fetch recent items');
            return response.json();
          })
          .catch(err => {
            console.error('Recent items fetch error:', err);
            // Return fallback data on error
            return { items: fallbackItems };
          });

        // Wait for both requests to complete
        const [featured, recent] = await Promise.all([featuredPromise, recentPromise]);

        setFeaturedItems(featured?.items || featured || fallbackItems);
        setRecentItems(recent?.items || recent || fallbackItems);
      } catch (err) {
        console.error('Error in fetchItems:', err);
        setError('Unable to connect to the server. Showing sample content.');
        setFeaturedItems(fallbackItems);
        setRecentItems(fallbackItems);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Handle image load errors
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://images.unsplash.com/photo-1572953109213-3be62398eb95?auto=format&fit=crop&q=80";
  };

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1594388052467-c8507f664df5?auto=format&fit=crop&q=80"
            alt="Ancient artifacts collage"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-amber-900/70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-serif font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover the World's Cultural Heritage
            </h1>
            <p className="mt-6 text-xl text-indigo-100 max-w-2xl">
              Explore thousands of artifacts spanning human history. Connect with the stories, traditions, and innovations that shaped our world.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link
                to="/items"
                className="inline-block bg-amber-600 px-6 py-3 rounded-full text-white font-medium shadow-xl hover:bg-amber-700 transition-colors text-center"
              >
                Browse Collection
              </Link>
              <Link
                to="/about"
                className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-medium hover:bg-white/30 transition-colors text-center border border-white/40"
              >
                Learn About the Project
              </Link>
            </div>
            <div className="mt-12 max-w-lg">
              <ItemSearchBar 
                className="shadow-xl"
                placeholder="Search artifacts, regions, time periods..."
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured collections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="block text-sm font-semibold uppercase tracking-wide text-amber-600">Curated Collections</span>
          <h2 className="mt-1 text-3xl font-serif font-bold text-gray-900 sm:text-4xl">Featured Artifacts</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Explore handpicked treasures from our vast collection of cultural artifacts
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        ) : null}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.length > 0 ? (
            featuredItems.slice(0, 3).map((item) => (
              <CulturalItemCard key={item.id} item={item} />
            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center py-8">No featured items available at this time.</p>
          )}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            to="/items" 
            className="inline-flex items-center rounded-md border border-indigo-700 bg-white px-6 py-3 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 transition-colors"
          >
            View All Artifacts
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Feature blocks */}
      <div className="bg-stone-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="block text-sm font-semibold uppercase tracking-wide text-amber-600">Explore & Learn</span>
            <h2 className="mt-1 text-3xl font-serif font-bold text-gray-900 sm:text-4xl">Dive into History</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
              Discover the stories behind the artifacts and connect with cultures across time and space
            </p>
          </div>
          
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow-md rounded-xl">
                <div className="aspect-w-3 aspect-h-2">
                  <img 
                    src="https://images.unsplash.com/photo-1633261828996-f4e650342dab?auto=format&fit=crop&q=80" 
                    alt="Interactive map" 
                    className="object-cover" 
                    onError={handleImageError}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">Interactive Map</h3>
                  <p className="mt-3 text-base text-gray-500">
                    Explore artifacts by geographical regions and discover the rich cultural diversity across the world.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/map"
                      className="inline-flex items-center text-indigo-700 hover:text-indigo-800 font-medium"
                    >
                      Explore the Map
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow-md rounded-xl">
                <div className="aspect-w-3 aspect-h-2">
                  <img 
                    src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80" 
                    alt="Community discussions" 
                    className="object-cover" 
                    onError={handleImageError}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">Join the Community</h3>
                  <p className="mt-3 text-base text-gray-500">
                    Participate in discussions, share insights, and connect with history enthusiasts and scholars.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/community"
                      className="inline-flex items-center text-indigo-700 hover:text-indigo-800 font-medium"
                    >
                      Join Discussions
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Latest arrivals section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="border-b border-gray-200 pb-5 mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Recently Added</h2>
          <p className="mt-2 text-gray-500">The latest additions to our growing collection</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentItems.length > 0 ? (
              recentItems.map((item) => (
                <CulturalItemCard key={item.id} item={item} />
              ))
            ) : (
              <p className="text-gray-500 col-span-3 text-center py-8">No recent items available.</p>
            )}
          </div>
        )}
      </div>
      
      {/* Call to action section */}
      <div className="bg-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="px-6 py-6 bg-indigo-700 rounded-lg md:py-12 md:px-12 lg:py-16 lg:px-16 xl:flex xl:items-center">
            <div className="xl:w-0 xl:flex-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Want to contribute to our collection?
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-indigo-200">
                Join our community of historians, archaeologists, and cultural enthusiasts. Share your artifacts and knowledge.
              </p>
            </div>
            <div className="mt-8 sm:w-full sm:max-w-md xl:mt-0 xl:ml-8">
              <div className="flex gap-4">
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 shadow-md"
                >
                  Sign up
                </Link>
                <Link
                  to="/items/new"
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
                >
                  Add Item
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;