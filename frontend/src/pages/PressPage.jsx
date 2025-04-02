import React from 'react';

const PressPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Press Kit</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Resources for media professionals and publications interested in covering our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About Cultural Heritage Platform</h2>
              <p className="text-gray-600 mb-4">
                The Cultural Heritage Platform is a digital initiative dedicated to preserving, documenting, and sharing cultural artifacts from around the world. Our mission is to make cultural heritage accessible to everyone through technology and community engagement.
              </p>
              <p className="text-gray-600">
                Founded in 2023, our platform now hosts over 5,000 artifacts from 42 countries, with contributions from both individual researchers and major cultural institutions.
              </p>
              <div className="mt-6">
                <a 
                  href="/downloads/press-release.pdf" 
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Download Press Release
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Media Contact</h2>
              <p className="text-gray-600 mb-4">
                For press inquiries, interview requests, or additional information, please contact our media relations team.
              </p>
              <div className="mt-6">
                <div className="flex items-center mb-3">
                  <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">press@example.com</span>
                </div>
                <div className="flex items-center mb-3">
                  <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-600">+1 (555) 234-5678</span>
                </div>
                <a 
                  href="/contact" 
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  Complete Contact Form
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-12">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Brand Assets</h2>
            <p className="text-gray-600 mb-8">
              Download our official logos, icons, and other brand materials for use in publications. Please adhere to our brand guidelines when using these assets.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="h-32 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Primary Logo</h3>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">Download PNG</a>
                <span className="text-sm text-gray-400 mx-2">|</span>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">Download SVG</a>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="h-32 flex items-center justify-center mb-4 bg-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Inverted Logo</h3>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">Download PNG</a>
                <span className="text-sm text-gray-400 mx-2">|</span>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">Download SVG</a>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="h-32 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Icon Set</h3>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">Download ZIP</a>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="h-32 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Brand Guidelines</h3>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">Download PDF</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-indigo-700 text-white rounded-xl overflow-hidden shadow-lg">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Need Additional Information?</h2>
            <p className="text-indigo-200 mb-6">
              If you need more information, high-resolution images, or would like to schedule an interview with our team, please don't hesitate to reach out.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressPage;
