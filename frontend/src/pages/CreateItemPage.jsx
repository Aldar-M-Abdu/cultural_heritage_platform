import React, { useState, useEffect } from 'react';
import { XMarkIcon, ArrowUpTrayIcon, PlayCircleIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CreateItemPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuthStore();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?redirect=create-item');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
    const validFiles = newFiles.filter(file => 
      file.type.startsWith('image/') || 
      file.type.startsWith('video/') || 
      file.type.startsWith('application/pdf')
    );
    const validSizedFiles = validFiles.filter(file => file.size <= 10 * 1024 * 1024);
    if (validSizedFiles.length !== validFiles.length) {
      setErrors(prev => ({
        ...prev,
        files: 'Some files exceed the maximum size of 10MB'
      }));
    }
    if (validSizedFiles.length > 0) {
      setFiles(prevFiles => [
        ...prevFiles, 
        ...validSizedFiles.map(file => ({
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }
    if (!formData.significance.trim()) {
      newErrors.significance = 'Cultural significance is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setIsSubmitting(true);
    try {
      // Get API base URL from environment variables with fallback
      const baseURL = import.meta.env.VITE_API_BASE_URL || '';
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // First, upload the main image if available
      let imageUrl = null;
      const mainImage = files.find(f => f.type === 'image');
      
      // If we have an image file, upload it first
      if (mainImage) {
        const imageFormData = new FormData();
        imageFormData.append('file', mainImage.file);
        
        try {
          console.log('Uploading main image...');
          const imageUploadResponse = await fetch(`${baseURL}/api/v1/uploads/image`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: imageFormData
          });
          
          if (!imageUploadResponse.ok) {
            const errorText = await imageUploadResponse.text();
            console.error('Image upload failed:', errorText);
            throw new Error('Failed to upload image: ' + (imageUploadResponse.statusText || errorText));
          }
          
          const imageData = await imageUploadResponse.json();
          imageUrl = imageData.url;
          console.log('Image uploaded successfully:', imageUrl);
        } catch (imageError) {
          console.error('Failed to upload image:', imageError);
          // We'll continue with item creation even if image upload fails
        }
      }
      
      // Create the cultural item with JSON payload matching the API schema
      const itemData = {
        title: formData.name,
        description: formData.description,
        time_period: formData.era,
        region: formData.location,
        historical_significance: formData.significance,
        image_url: imageUrl,
        // Convert category to a tag array if needed by the API
        tags: formData.category ? [{ name: formData.category }] : []
      };
      
      console.log('Creating cultural item with data:', itemData);
      
      // Create the item
      const response = await fetch(`${baseURL}/api/v1/cultural-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Item creation failed:', errorText);
        let errorMessage = 'Failed to create item';
        
        try {
          // Try to parse error JSON if available
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // If not JSON, use the raw text
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      const newItem = await response.json();
      console.log('Item created successfully:', newItem);
      
      // If we have additional files, upload them as media
      if (files.length > 1 && newItem.id) {
        const mediaUploadPromises = [];
        
        for (const fileObj of files) {
          if (fileObj === mainImage) continue; // Skip main image already uploaded
          
          const mediaFormData = new FormData();
          mediaFormData.append('file', fileObj.file);
          mediaFormData.append('cultural_item_id', newItem.id);
          mediaFormData.append('media_type', fileObj.type);
          mediaFormData.append('title', fileObj.file.name);
          
          const mediaPromise = fetch(`${baseURL}/api/v1/cultural-items/${newItem.id}/media`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: mediaFormData
          }).catch(err => {
            console.error(`Failed to upload media ${fileObj.file.name}:`, err);
          });
          
          mediaUploadPromises.push(mediaPromise);
        }
        
        // Wait for all media uploads but don't fail if some fail
        await Promise.allSettled(mediaUploadPromises);
      }
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        category: '',
        era: '',
        location: '',
        significance: '',
        description: ''
      });
      setFiles([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        navigate(`/items/${newItem.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error submitting item:', error);
      setSubmitError(error.message || 'Failed to create item. Please try again later.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Cultural Heritage Item</h1>
        <p className="mt-2 text-gray-600">
          Share your knowledge and help preserve cultural heritage for future generations.
        </p>
      </div>
      
      {submitSuccess && (
        <div className="mb-8 bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Item created successfully!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your item has been added to our collection. You will be redirected shortly.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {submitError && (
        <div className="mb-8 bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{submitError}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
                  className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.name ? 'border-red-300' : ''
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
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
                  className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.category ? 'border-red-300' : ''
                  }`}
                >
                  <option value="" disabled>Select a category</option>
                  <option value="artifact">Artifact</option>
                  <option value="monument">Monument</option>
                  <option value="document">Historical Document</option>
                  <option value="tradition">Cultural Tradition</option>
                  <option value="site">Historical Site</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
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
                  className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.description ? 'border-red-300' : ''
                  }`}
                  placeholder="Provide a detailed description of the item"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
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
                  className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.significance ? 'border-red-300' : ''
                  }`}
                  placeholder="Why is this item important? What is its cultural context?"
                />
                {errors.significance && (
                  <p className="mt-1 text-sm text-red-600">{errors.significance}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Media</h2>
            <p className="text-sm text-gray-500 mb-4">
              Add photos, videos, or documents related to this cultural heritage item.
            </p>
            
            <div 
              className={`mt-2 flex justify-center px-6 py-10 border-2 border-dashed rounded-md ${
                isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
              } ${errors.files ? 'border-red-300' : ''}`}
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
                {errors.files && (
                  <p className="text-sm text-red-600 mt-2">{errors.files}</p>
                )}
              </div>
            </div>
            
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
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              'Create Item'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateItemPage;