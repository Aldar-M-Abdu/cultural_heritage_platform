import React from 'react';

const TermsOfService = () => {
  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
              Terms of Service
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Please read these terms carefully before using our services.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 md:p-10">
            <div className="prose prose-blue max-w-none">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                    Using Our Services
                  </h2>
                  <p className="mt-4 text-gray-600">
                    You must follow any policies made available to you within the services. Do not misuse our services. For example, do not interfere with our services or try to access them using a method other than the interface and the instructions that we provide.
                  </p>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">Acceptable Use</h3>
                    <p className="mt-2 text-gray-600">
                      Our services are designed to be used for legitimate purposes only. Users are prohibited from engaging in any activity that disrupts or interferes with our services, servers, or networks.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                    Your Content
                  </h2>
                  <p className="mt-4 text-gray-600">
                    You retain ownership of any intellectual property rights that you hold in the content you submit to our services. When you upload or otherwise submit content to our services, you give us a worldwide license to use, host, store, reproduce, modify, create derivative works, communicate, publish, publicly perform, publicly display, and distribute such content.
                  </p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800">
                      The license you grant is for the limited purpose of operating, promoting, and improving our services, and to develop new ones.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                    Modifying and Terminating Our Services
                  </h2>
                  <p className="mt-4 text-gray-600">
                    We are constantly changing and improving our services. We may add or remove functionalities or features, and we may suspend or stop a service altogether.
                  </p>
                  <p className="mt-2 text-gray-600">
                    You can stop using our services at any time, although we'll be sorry to see you go. We may also stop providing services to you, or add or create new limits on our services, at any time.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                    Our Warranties and Disclaimers
                  </h2>
                  <p className="mt-4 text-gray-600">
                    We provide our services using a commercially reasonable level of skill and care and we hope that you will enjoy using them. But there are certain things that we don't promise about our services.
                  </p>
                  <p className="mt-2 text-gray-600">
                    Other than as expressly set out in these terms or additional terms, neither we nor our suppliers or distributors make any specific promises about the services. For example, we don't make any commitments about the content within the services, the specific functions of the services, or their reliability, availability, or ability to meet your needs.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                    Liability for Our Services
                  </h2>
                  <p className="mt-4 text-gray-600">
                    When permitted by law, we will not be responsible for lost profits, revenues, or data, financial losses, or indirect, special, consequential, exemplary, or punitive damages.
                  </p>
                  <p className="mt-2 text-gray-600">
                    To the extent permitted by law, the total liability of us and our suppliers and distributors, for any claims under these terms, including for any implied warranties, is limited to the amount you paid us to use the services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                    About These Terms
                  </h2>
                  <p className="mt-4 text-gray-600">
                    We may modify these terms or any additional terms that apply to a service to reflect changes to the law or changes to our services. You should look at the terms regularly. We'll post notice of modifications to these terms on this page.
                  </p>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">Changes to Terms</h3>
                    <p className="mt-2 text-gray-600">
                      If you do not agree to the modified terms for a service, you should discontinue your use of that service.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                    Contact Us
                  </h2>
                  <p className="mt-4 text-gray-600">
                    If you have any questions about these terms, please contact us at:
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

export default TermsOfService;