import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useCommunityStore from '../stores/communityStore';
import LoadingSpinner from '../components/common/LoadingSpinner';

const NewDiscussionPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { communities, fetchCommunities, createDiscussion, isLoading, error } = useCommunityStore();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    community_id: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login?redirect=/community/new-discussion');
      return;
    }
    
    // Fetch communities for the dropdown
    fetchCommunities();
  }, [isAuthenticated]);
  
  useEffect(() => {
    // Set default community when communities are loaded
    if (communities.length > 0 && !formData.community_id) {
      const generalCommunity = communities.find(c => c.slug === 'general-discussion') || communities[0];
      setFormData(prev => ({
        ...prev,
        community_id: generalCommunity.id
      }));
    }
  }, [communities]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    } else if (formData.content.length < 10) {
      errors.content = 'Content must be at least 10 characters';
    }
    
    if (!formData.community_id) {
      errors.community_id = 'Please select a community';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const newDiscussion = await createDiscussion(formData.community_id, {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        community_id: formData.community_id
      });
      
      navigate(`/community/discussions/${newDiscussion.id}`);
    } catch (error) {
      setSubmitError(error.message || 'Failed to create discussion');
      setIsSubmitting(false);
    }
  };
  
  if (!isAuthenticated) {
    return null; // Redirect is handled in useEffect
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-xl leading-6 font-medium text-gray-900">
              Start a New Discussion
            </h1>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Share your thoughts, ask questions, or start a conversation with the community.
              </p>
            </div>
            
            {isLoading && communities.length === 0 ? (
              <div className="mt-5 flex justify-center">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-6">
                {submitError && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Error creating discussion
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{submitError}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label htmlFor="community_id" className="block text-sm font-medium text-gray-700">
                    Community
                  </label>
                  <select
                    id="community_id"
                    name="community_id"
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${formErrors.community_id ? 'border-red-300' : ''}`}
                    value={formData.community_id}
                    onChange={handleChange}
                  >
                    <option value="">Select a community</option>
                    {communities.map(community => (
                      <option key={community.id} value={community.id}>
                        {community.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.community_id && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.community_id}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${formErrors.title ? 'border-red-300' : ''}`}
                      placeholder="Enter a descriptive title"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  {formErrors.title && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.title}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="general">General Discussion</option>
                    <option value="research">Research & Methodology</option>
                    <option value="identification">Artifact Identification</option>
                    <option value="preservation">Preservation Techniques</option>
                    <option value="events">Events & Conferences</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="content"
                      name="content"
                      rows="10"
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${formErrors.content ? 'border-red-300' : ''}`}
                      placeholder="Write your discussion here..."
                      value={formData.content}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  {formErrors.content && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.content}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Be clear and respectful. Your post should align with our community guidelines.
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => navigate('/community')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : 'Create Discussion'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDiscussionPage;
