import React from 'react';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="/images/hero-image.jpg"
            alt="Cultural heritage artifacts"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Explore Cultural Heritage
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-gray-300">
            Discover, learn, and engage with cultural artifacts from around the world. Our platform connects you with cultural heritage that spans regions and time periods.
          </p>
          <div className="mt-10">
            <a href="/explore" className="btn btn-primary mr-4">
              Start Exploring
            </a>
            <a href="/about" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Featured Items Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Artifacts</h2>
          <a
            href="/explore"
            className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center"
          >
            View All
            <svg
              className="ml-1 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Static featured items */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <img
              src="/public/Viking Age Silver Necklace.jpg"
              alt="Viking Age Silver Necklace"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">Viking Age Silver Necklace</h3>
              <p className="text-sm text-gray-600">Scandinavia • Viking Age (793-1066 CE)</p>
              <p className="text-gray-700 mt-2">
                Intricately designed silver necklace featuring traditional Norse patterns and dragon motifs.
              </p>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <img
              src="/public/Ancient Greek Amphora.jpg"
              alt="Ancient Greek Amphora"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">Ancient Greek Amphora</h3>
              <p className="text-sm text-gray-600">Greece • Classical Period (480-323 BCE)</p>
              <p className="text-gray-700 mt-2">
                Red-figure amphora depicting scenes from the Trojan War.
              </p>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <img
              src="/public/Maya Jade Death Mask.jpg"
              alt="Maya Jade Death Mask"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">Maya Jade Death Mask</h3>
              <p className="text-sm text-gray-600">Mesoamerica • Classic Maya Period (250-900 CE)</p>
              <p className="text-gray-700 mt-2">
                Ceremonial death mask made of jade mosaic pieces, likely belonging to a Maya ruler.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-primary-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Contribute to Cultural Heritage
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Help us preserve and share cultural knowledge by contributing your expertise or artifacts to our platform.
          </p>
          <a
            href="/contribute"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50"
          >
            Learn How to Contribute
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;