import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <p className="text-gray-600 mb-4">
        Your privacy is important to us. This privacy policy explains what personal data we collect from you and how we use it.
      </p>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
      <p className="text-gray-600 mb-4">
        We collect information to provide better services to our users. This includes:
      </p>
      <ul className="list-disc list-inside text-gray-600 mb-4">
        <li>Information you provide to us directly, such as when you create an account or upload content.</li>
        <li>Information we get from your use of our services, such as device information and log information.</li>
      </ul>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Information</h2>
      <p className="text-gray-600 mb-4">
        We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our users.
      </p>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Sharing Information</h2>
      <p className="text-gray-600 mb-4">
        We do not share personal information with companies, organizations, or individuals outside of our organization unless one of the following circumstances applies:
      </p>
      <ul className="list-disc list-inside text-gray-600 mb-4">
        <li>With your consent.</li>
        <li>For legal reasons.</li>
      </ul>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Choices</h2>
      <p className="text-gray-600 mb-4">
        You have choices regarding the information we collect and how it's used. You can manage your account settings and preferences at any time.
      </p>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
      <p className="text-gray-600 mb-4">
        If you have any questions about this privacy policy, please contact us at support@example.com.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
