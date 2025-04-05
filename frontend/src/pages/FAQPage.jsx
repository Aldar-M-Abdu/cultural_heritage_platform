import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [openQuestion, setOpenQuestion] = useState(null);
  
  const categories = [
    { id: 'general', name: 'General Information' },
    { id: 'account', name: 'Account & Profile' },
    { id: 'contributing', name: 'Contributing Content' },
    { id: 'technical', name: 'Technical Support' },
    { id: 'privacy', name: 'Privacy & Security' }
  ];
  
  const faqs = [
    {
      id: 14,
      question: 'Can I use the platform for educational purposes?',
      answer: 'Absolutely! We encourage the use of our platform in educational settings. Teachers and students can create accounts and use the resources for research, presentations, and projects. We offer special features for educators, including the ability to create curated collections for classroom use. Contact us for information about educational partnerships.',
      category: 'general'
    },
    {
      id: 15,
      question: 'How do I delete my account?',
      answer: 'To delete your account, go to your Account Settings page and select the "Privacy" tab. At the bottom of this page, you\'ll find the option to delete your account. Please note that account deletion is permanent and will remove all your personal information, though your public contributions may remain (without your personal identifiers) if they\'ve become part of the cultural record.',
      category: 'account'
    }
  ];
  
  // Filter FAQs based on active category and search query
  const filteredFaqs = faqs.filter(faq => 
    (activeCategory === faq.category || activeCategory === 'all') &&
    (searchQuery === '' || 
     faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-900 text-center">Frequently Asked Questions</h1>
          <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
            Find answers to common questions about our cultural heritage platform
          </p>
          
          {/* Search */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search for answers..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Category sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-6">
              <h2 className="text-lg font-medium text-gray-900">Categories</h2>
              <ul className="mt-4 space-y-2">
                <li>
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                      activeCategory === 'all'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setActiveCategory(category.id)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                        activeCategory === category.id
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-md">
                <h3 className="text-sm font-medium text-blue-800">Need more help?</h3>
                <p className="mt-2 text-sm text-blue-700">
                  If you can't find the answer you're looking for, please contact our support team.
                </p>
                <div className="mt-4">
                  <Link
                    to="/contact"
                    className="text-sm font-medium text-blue-700 hover:text-blue-600"
                  >
                    Contact Support <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ list */}
          <div className="mt-8 lg:mt-0 lg:col-span-9">
            <div className="space-y-6">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="bg-white shadow rounded-lg overflow-hidden">
                    <button
                      className="w-full px-6 py-5 text-left focus:outline-none"
                      onClick={() => toggleQuestion(faq.id)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                        <span className="ml-6 h-7 flex items-center">
                          <svg
                            className={`h-6 w-6 transform ${
                              openQuestion === faq.id ? '-rotate-180' : 'rotate-0'
                            } transition-transform duration-200 ease-in-out text-gray-500`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </div>
                    </button>
                    {openQuestion === faq.id && (
                      <div className="px-6 pb-6 pt-2">
                        <div className="text-base text-gray-700 whitespace-pre-line">
                          {faq.answer}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('general');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Clear filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;