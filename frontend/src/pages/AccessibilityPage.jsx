import React from 'react';

const AccessibilityPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header with accent border */}
        <div className="border-l-4 border-indigo-600 pl-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Accessibility</h1>
          <p className="mt-2 text-lg text-indigo-600">Creating an inclusive experience for all users</p>
        </div>
        
        {/* Main content section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            We are committed to ensuring that our platform is accessible to everyone, including individuals with disabilities. 
            Our team continuously works to improve and maintain accessibility standards across our services.
          </p>
          
          {/* Features cards grid */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Accessibility Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
              <div className="flex items-center mb-4">
                <svg className="h-6 w-6 text-indigo-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800">Keyboard Navigation</h3>
              </div>
              <p className="text-gray-600">Complete keyboard navigation support for all interactive elements, with visible focus indicators.</p>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
              <div className="flex items-center mb-4">
                <svg className="h-6 w-6 text-indigo-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800">High Contrast Mode</h3>
              </div>
              <p className="text-gray-600">Enhanced contrast options for better readability and visual clarity for users with visual impairments.</p>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
              <div className="flex items-center mb-4">
                <svg className="h-6 w-6 text-indigo-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-2.828a5 5 0 001.414 1.414m0-2.828l-2.828 2.828" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800">Screen Reader Support</h3>
              </div>
              <p className="text-gray-600">Screen reader-friendly labels, ARIA attributes, and semantic HTML for an improved experience.</p>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
              <div className="flex items-center mb-4">
                <svg className="h-6 w-6 text-indigo-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800">Resizable Text</h3>
              </div>
              <p className="text-gray-600">Fully responsive text sizing that adapts to user preferences and browser settings.</p>
            </div>
          </div>
          
          {/* Feedback section */}
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">We Value Your Feedback</h2>
            <p className="text-gray-700 mb-6">
              We're constantly working to improve our accessibility features. If you encounter any issues or have suggestions,
              please don't hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:support@example.com" 
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </a>
              <a 
                href="#" 
                className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Live Chat Support
              </a>
            </div>
          </div>
        </div>
        
        {/* Compliance badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">WCAG 2.1 AA Compliant</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">ADA Compliant</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Section 508 Compliant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPage;