import React from 'react';
import { useToastContext } from '../contexts/ToastContext';

const ExamplePage = () => {
  const { toast } = useToastContext();

  const handleSuccessClick = () => {
    toast.success("This is a success message!");
  };

  const handleErrorClick = () => {
    toast.error("This is an error message!");
  };

  const handleInfoClick = () => {
    toast.info("This is an information message.");
  };

  const handleWarningClick = () => {
    toast.warning("This is a warning message.", { duration: 8000 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Toast Examples</h1>
      <div className="space-x-4">
        <button 
          onClick={handleSuccessClick}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Show Success Toast
        </button>
        <button 
          onClick={handleErrorClick}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Show Error Toast
        </button>
        <button 
          onClick={handleInfoClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Show Info Toast
        </button>
        <button 
          onClick={handleWarningClick}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Show Warning Toast
        </button>
      </div>
    </div>
  );
};

export default ExamplePage;
