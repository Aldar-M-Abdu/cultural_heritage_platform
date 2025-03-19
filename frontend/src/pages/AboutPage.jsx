import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Our Platform</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Preserving and sharing cultural heritage for future generations through digital collaboration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            We aim to create a comprehensive digital platform that connects cultural heritage enthusiasts, 
            researchers, and institutions worldwide. Our goal is to preserve, document, and share cultural 
            artifacts and their stories for future generations.
          </p>
          <a href="/register" className="btn btn-primary">
            Join Our Community
          </a>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Digital preservation of cultural artifacts
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Global community of cultural heritage enthusiasts
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Interactive mapping of cultural heritage sites
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Educational resources and documentation
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How You Can Contribute</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Add Items</h3>
            <p className="text-gray-600">
              Share cultural artifacts and their stories with our community.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Engage & Discuss</h3>
            <p className="text-gray-600">
              Participate in discussions and share your knowledge.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Document & Research</h3>
            <p className="text-gray-600">
              Help document and research cultural heritage items.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Start Contributing Today</h2>
        <div className="space-x-4">
          <a href="/explore" className="btn btn-primary">
            Explore Collection
          </a>
          <a href="/register" className="btn btn-secondary">
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
