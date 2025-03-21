import React, { useState } from 'react';

const ContactPage = () => {
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formState);
  };

  return (
    <div className="bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
              Contact Us
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions or need assistance? We're here to help and would love to hear from you!
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="fullName"
                      id="full-name"
                      value={formState.fullName}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md transition duration-150 ease-in-out"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md transition duration-150 ease-in-out"
                      placeholder="example@domain.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formState.message}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md transition duration-150 ease-in-out"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="privacy-policy"
                    name="privacy-policy"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="privacy-policy" className="ml-2 block text-sm text-gray-600">
                    I agree to the <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-gray-50 px-6 py-8 md:px-10 md:py-6">
              <div className="flex flex-col md:flex-row md:space-x-6 text-center md:text-left">
                <div className="flex-1 mb-4 md:mb-0">
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="mt-1 text-sm text-gray-600">support@example.com</p>
                </div>
                <div className="flex-1 mb-4 md:mb-0">
                  <h3 className="font-medium text-gray-900">Phone</h3>
                  <p className="mt-1 text-sm text-gray-600">+1 (555) 123-4567</p>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Office</h3>
                  <p className="mt-1 text-sm text-gray-600">123 Business Ave, Suite 100<br />San Francisco, CA 94107</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;