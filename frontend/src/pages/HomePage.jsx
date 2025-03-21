import React from 'react';
import { ChevronRightIcon } from 'lucide-react';

const FeaturedArtifactCard = ({ image, title, region, period, description }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
    <div className="relative h-56 overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-amber-700/80 rounded">
          {region}
        </span>
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm font-medium text-amber-700 mb-3">{period}</p>
      <p className="text-gray-600 text-sm">{description}</p>
      <button className="mt-4 text-amber-700 hover:text-amber-800 font-medium text-sm inline-flex items-center group">
        View Details 
        <ChevronRightIcon className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

const HomePage = () => {
  const featuredItems = [
    {
      id: 1,
      image: "/public/Viking Age Silver Necklace.jpg",
      title: "Viking Age Silver Necklace",
      region: "Scandinavia",
      period: "Viking Age (793-1066 CE)",
      description: "Intricately designed silver necklace featuring traditional Norse patterns and dragon motifs."
    },
    {
      id: 2,
      image: "/public/Ancient Greek Amphora.jpg",
      title: "Ancient Greek Amphora",
      region: "Greece",
      period: "Classical Period (480-323 BCE)",
      description: "Red-figure amphora depicting scenes from the Trojan War."
    },
    {
      id: 3,
      image: "/public/Maya Jade Death Mask.jpg",
      title: "Maya Jade Death Mask",
      region: "Mesoamerica",
      period: "Classic Maya Period (250-900 CE)",
      description: "Ceremonial death mask made of jade mosaic pieces, likely belonging to a Maya ruler."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with parallax effect */}
      <div className="relative h-screen bg-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="/images/hero-image.jpg"
            alt="Cultural heritage artifacts"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70"></div>
        </div>
        <div className="relative h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-amber-400 uppercase bg-amber-900/30 rounded-full mb-6">
              Global Cultural Heritage
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
              Discover the <span className="text-amber-400">world's treasures</span> through time
            </h1>
            <p className="mt-4 text-xl text-gray-300 leading-relaxed">
              Connect with artifacts and stories that shaped human history. Our curated collection spans civilizations, continents, and millennia.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="/explore" className="px-6 py-3 text-base font-medium text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-lg hover:shadow-amber-700/20 transition-all duration-300">
                Start Exploring
              </a>
              <a href="/about" className="px-6 py-3 text-base font-medium text-gray-200 bg-gray-800/70 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors duration-300">
                Our Mission
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* Featured Artifacts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12">
          <div>
            <span className="text-amber-700 font-semibold text-sm tracking-wider uppercase">Curated Selection</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Featured Artifacts</h2>
            <p className="mt-3 text-gray-600 max-w-2xl">Discover remarkable pieces from different civilizations, each with a unique story and historical significance.</p>
          </div>
          <a
            href="/explore"
            className="mt-4 md:mt-0 text-amber-700 hover:text-amber-800 font-medium inline-flex items-center group"
          >
            Explore All Collections
            <ChevronRightIcon className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map(item => (
            <FeaturedArtifactCard key={item.id} {...item} />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-amber-700 font-semibold text-sm tracking-wider uppercase">Browse by Interest</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Explore Categories</h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Find artifacts organized by historical periods, regions, and themes</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Ancient Egypt', 'Greek & Roman', 'Medieval', 'Renaissance', 'Indigenous Americas', 'Asian Arts'].map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-amber-700 font-bold">{category.charAt(0)}</span>
                </div>
                <h3 className="font-medium text-gray-900">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Contribute to Cultural Heritage
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-3xl mx-auto">
            Help us preserve and share cultural knowledge by contributing your expertise or artifacts to our growing digital collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contribute"
              className="px-6 py-3 text-base font-medium text-amber-900 bg-white hover:bg-amber-50 rounded-lg shadow-lg transition-colors duration-300"
            >
              Share Your Knowledge
            </a>
            <a
              href="/membership"
              className="px-6 py-3 text-base font-medium text-white bg-transparent hover:bg-amber-700 border border-white rounded-lg transition-colors duration-300"
            >
              Join Our Community
            </a>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-900 rounded-xl p-8 sm:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">Stay Updated</h3>
              <p className="text-gray-300">
                Subscribe to our newsletter for the latest additions to our collection, virtual exhibitions, and educational resources.
              </p>
            </div>
            <div>
              <form className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-grow px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;