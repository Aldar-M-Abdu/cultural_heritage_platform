import React from 'react';

const AccessibilityPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Accessibility</h1>
      <p className="text-gray-700 mb-6">
        We are committed to ensuring that our platform is accessible to everyone, including individuals with disabilities.
      </p>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Accessibility Features</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Keyboard navigation support for all interactive elements.</li>
        <li>High contrast mode for better readability.</li>
        <li>Screen reader-friendly labels and descriptions.</li>
        <li>Resizable text for improved readability.</li>
      </ul>
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Feedback</h2>
      <p className="text-gray-700">
        If you encounter any accessibility issues, please contact us at <a href="mailto:support@example.com" className="text-indigo-600 hover:text-indigo-800">support@example.com</a>.
      </p>
    </div>
  );
};

export default AccessibilityPage;
