import React from 'react';

const CreateItemPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Cultural Heritage Item</h1>
        <p className="mt-2 text-gray-600">
          Share your knowledge and help preserve cultural heritage for future generations.
        </p>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                id="name"
                type="text"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="significance" className="block text-sm font-medium text-gray-700 mb-1">
                Cultural Significance
              </label>
              <textarea
                id="significance"
                rows="4"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Why is this item important? What is its cultural context?"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3">
            <button className="btn btn-secondary">Cancel</button>
            <button className="btn btn-primary">Create Item</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItemPage;