import React, { useState } from 'react';
import { XMarkIcon, ArrowUpTrayIcon, PlayCircleIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const CreateItemPage = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    era: '',
    location: '',
    significance: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const newFiles = Array.from(e.dataTransfer.files);
    addFiles(newFiles);
  };

  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files);
    addFiles(newFiles);
  };

  const addFiles = (newFiles) => {
    // Filter for images, videos, and documents
    const validFiles = newFiles.filter(file => 
      file.type.startsWith('image/') || 
      file.type.startsWith('video/') || 
      file.type.startsWith('application/pdf')
    );
    
    if (validFiles.length > 0) {
      setFiles(prevFiles => [
        ...prevFiles, 
        ...validFiles.map(file => ({
          file,
          id: Math.random().toString(36).substring(2),
          preview: file.type.startsWith('image/') 
            ? URL.createObjectURL(file) 
            : null,
          type: file.type.startsWith('image/') 
            ? 'image' 
            : file.type.startsWith('video/') 
            ? 'video' 
            : 'document'
        }))
      ]);
    }
  };

  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'image':
        return <PhotoIcon className="h-8 w-8 text-indigo-500" />;
      case 'video':
        return <PlayCircleIcon className="h-8 w-8 text-indigo-500" />;
      default:
        return <DocumentTextIcon className="h-8 w-8 text-indigo-500" />;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    console.log('Files:', files);
    // Here you would typically send the data to your API
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Cultural Heritage Item</h1>
        <p className="mt-2 text-gray-600">
          Share your knowledge and help preserve cultural heritage for future generations.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="" disabled>Select a category</option>
                  <option value="artifact">Artifact</option>
                  <option value="monument">Monument</option>
                  <option value="document">Historical Document</option>
                  <option value="tradition">Cultural Tradition</option>
                  <option value="site">Historical Site</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="era" className="block text-sm font-medium text-gray-700 mb-1">
                  Historical Era
                </label>
                <input
                  id="era"
                  name="era"
                  type="text"
                  value={formData.era}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., Bronze Age, 18th Century, 1960s"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Origin Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="City, Country or Region"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Provide a detailed description of the item"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="significance" className="block text-sm font-medium text-gray-700 mb-1">
                  Cultural Significance *
                </label>
                <textarea
                  id="significance"
                  name="significance"
                  rows="4"
                  value={formData.significance}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Why is this item important? What is its cultural context?"
                />
              </div>
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Media</h2>
            <p className="text-sm text-gray-500 mb-4">
              Add photos, videos, or documents related to this cultural heritage item.
            </p>
            
            {/* File Upload Area */}
            <div 
              className={`mt-2 flex justify-center px-6 py-10 border-2 border-dashed rounded-md ${
                isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={handleFileSelect}
                      accept="image/*,video/*,application/pdf"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF, MP4, MOV, PDF up to 10MB
                </p>
              </div>
            </div>
            
            {/* Preview Area */}
            {files.length > 0 && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files.map(file => (
                  <div 
                    key={file.id}
                    className="relative group bg-gray-100 rounded-lg p-2 border border-gray-200"
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="bg-white rounded-full p-1 text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="h-32 flex items-center justify-center overflow-hidden rounded-md bg-gray-50">
                      {file.preview ? (
                        <img 
                          src={file.preview} 
                          alt={file.file.name}
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          {getFileIcon(file.type)}
                          <span className="mt-2 text-xs text-gray-500 truncate w-full text-center">
                            {file.file.name.length > 20 
                              ? file.file.name.substring(0, 20) + '...' 
                              : file.file.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateItemPage;