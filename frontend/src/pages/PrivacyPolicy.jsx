import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
              Privacy Policy
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Your privacy matters to us. Here's how we handle your information.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 md:p-10">
            <div className="prose prose-blue max-w-none">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                    Information We Collect
                  </h2>
                  <p className="mt-4 text-gray-600">
                    We collect information to provide better services to our users. This includes:
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 text-blue-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-600">Information you provide to us directly, such as when you create an account or upload content.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 text-blue-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-600">Information we get from your use of our services, such as device information and log information.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                    How We Use Information
                  </h2>
                  <p className="mt-4 text-gray-600">
                    We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our users.
                  </p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 font-medium">
                      Our commitment: We will never sell your personal information to third parties.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                    Sharing Information
                  </h2>
                  <p className="mt-4 text-gray-600">
                    We do not share personal information with companies, organizations, or individuals outside of our organization unless one of the following circumstances applies:
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 text-blue-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-600">With your explicit consent.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 text-blue-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-600">For legal reasons, such as to comply with applicable laws and regulations.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                    Your Choices
                  </h2>
                  <p className="mt-4 text-gray-600">
                    You have choices regarding the information we collect and how it's used. You can manage your account settings and preferences at any time.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                    Contact Us
                  </h2>
                  <p className="mt-4 text-gray-600">
                    If you have any questions about this privacy policy, please contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-800 font-medium">support@example.com</p>
                    <p className="mt-2 text-gray-600">We aim to respond to all inquiries within 48 business hours.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 text-center">
                <p className="text-sm text-gray-500">Last updated: March 21, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;