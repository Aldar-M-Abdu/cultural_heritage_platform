import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-indigo-900 mb-6 leading-tight">About Our Platform</h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Preserving and sharing cultural heritage for future generations through digital collaboration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
        <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            We aim to create a comprehensive digital platform that connects cultural heritage enthusiasts, 
            researchers, and institutions worldwide. Our goal is to preserve, document, and share cultural 
            artifacts and their stories for future generations.
          </p>
          <a 
            href="/register" 
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Join Our Community
          </a>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
          <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-6">
            <svg className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">What We Offer</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-teal-500 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="leading-relaxed">Digital preservation with high-quality documentation and metadata</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-teal-500 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="leading-relaxed">Global community of cultural heritage enthusiasts, experts, and institutions</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-teal-500 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="leading-relaxed">Educational resources and documentation for researchers and enthusiasts</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-teal-50 rounded-2xl p-12 mb-24 shadow-lg">
        <h2 className="text-3xl font-bold text-indigo-900 mb-10 text-center">How You Can Contribute</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-md transform transition-all duration-300 hover:shadow-xl text-center">
            <div className="bg-indigo-100 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-6">
              <svg className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-indigo-900 mb-3">Add Items</h3>
            <p className="text-gray-700 leading-relaxed">
              Share cultural artifacts and their stories with our growing global community of enthusiasts.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-md transform transition-all duration-300 hover:shadow-xl text-center">
            <div className="bg-teal-100 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-6">
              <svg className="h-10 w-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-indigo-900 mb-3">Engage & Discuss</h3>
            <p className="text-gray-700 leading-relaxed">
              Participate in meaningful discussions and share your knowledge with experts worldwide.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-md transform transition-all duration-300 hover:shadow-xl text-center">
            <div className="bg-indigo-100 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-6">
              <svg className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-indigo-900 mb-3">Document & Research</h3>
            <p className="text-gray-700 leading-relaxed">
              Help document and research cultural heritage items to preserve their stories for generations.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center bg-white rounded-xl shadow-lg p-12">
        <h2 className="text-3xl font-bold text-indigo-900 mb-6">Start Contributing Today</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
          Join our community of passionate cultural heritage enthusiasts and help preserve our shared history.
        </p>
        <div className="space-x-4">
          <a 
            href="/explore" 
            className="inline-block px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg shadow-md transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Explore Collection
          </a>
          <a 
            href="/register" 
            className="inline-block px-8 py-4 bg-white text-indigo-600 font-medium rounded-lg shadow-md border border-indigo-200 transition-all duration-300 hover:border-indigo-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;