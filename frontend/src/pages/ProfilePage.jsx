import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { itemsService } from '../services/itemsService';
import CulturalItemCard from '../components/CulturalItemCard';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState(null);
  const [userContributions, setUserContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      email: user?.email || '',
      bio: user?.bio || '',
      organization: user?.organization || '',
    },
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors }, reset: resetPasswordForm } = useForm({
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  // Fetch user contributions
  useEffect(() => {
    if (user?.id) {
      fetchUserContributions();
    }
  }, [user?.id]);

  const fetchUserContributions = async () => {
    setIsLoading(true);
    try {
      // This would be replaced with an actual API call in a real implementation
      // const contributions = await itemsService.getUserContributions(user.id);
      const mockContributions = []; // Mock data - replace with actual API call
      setUserContributions(mockContributions);
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (data) => {
    try {
      // Update profile information
      await updateProfile({
        email: data.email,
        bio: data.bio,
        organization: data.organization
      });
      
      // Show success notification or handle successful update
      // For example:
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error, show error message
    }
  };
  
  // Handle password change
  const handlePasswordChange = async (data) => {
    try {
      if (data.new_password !== data.confirm_password) {
        setPasswordChangeError('Passwords do not match');
        return;
      }
      
      await changePassword({
        currentPassword: data.current_password,
        newPassword: data.new_password
      });
      
      resetPasswordForm();
      setPasswordChangeSuccess(true);
      setPasswordChangeError(null);
      setIsPasswordModalOpen(false);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setPasswordChangeSuccess(false);
      }, 3000);
    } catch (error) {
      setPasswordChangeError(error.message || 'Failed to change password');
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setValue('avatar', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">You need to be logged in to view your profile</h2>
          <button 
            onClick={() => navigate('/login')}
            className="btn bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
          >
            Profile Information
          </button>
          
          <button
            onClick={() => setActiveTab('contributions')}
            className={`${
              activeTab === 'contributions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
          >
            My Contributions
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      {activeTab === 'profile' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit(handleProfileSubmit)} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Avatar */}
              <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row items-center mb-6">
                <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 mb-4 sm:mb-0 sm:mr-6">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt={user.username} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-800 text-3xl font-medium">
                      {user.username?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <div className="flex space-x-2">
                    <label
                      htmlFor="avatar"
                      className="btn btn-secondary btn-sm cursor-pointer"
                    >
                      Change Photo
                    </label>
                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarPreview(null);
                          setValue('avatar', null);
                        }}
                        className="btn btn-danger btn-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  {...register('email', { required: 'Email is required' })}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
              
              {/* Organization */}
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization (Optional)
                </label>
                <input
                  id="organization"
                  {...register('organization')}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Your organization or institution"
                />
                {errors.organization && <p className="mt-1 text-sm text-red-600">{errors.organization.message}</p>}
              </div>
              
              {/* Password Change Button */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="text-primary-600 hover:text-primary-800 font-medium"
                >
                  Change Password
                </button>
              </div>
              
              {/* Bio */}
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio (Optional)
                </label>
                <textarea
                  id="bio"
                  {...register('bio')}
                  rows="4"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Tell us a bit about yourself"
                />
                {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
      
      {activeTab === 'contributions' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Cultural Heritage Contributions</h2>
            <a href="/items/new" className="btn btn-primary">
              Add New Item
            </a>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : !userContributions.length ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contributions yet</h3>
              <p className="text-gray-500 mb-4">
                Start sharing cultural heritage items with the community.
              </p>
              <a href="/items/new" className="btn btn-primary">
                Add Your First Item
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userContributions.map(item => (
                <div key={item.id} className="relative">
                  <CulturalItemCard item={item} />
                  <div className="absolute top-2 left-2 flex space-x-2">
                    <a
                      href={`/items/${item.id}/edit`}
                      className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </a>
                    <button
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
                          try {
                            // Corrected syntax for try-catch block
                            await itemsService.deleteItem(item.id);
                            fetchUserContributions();
                          } catch (error) {
                            console.error(error);
                            alert('Failed to delete item. Please try again.');
                          }
                        }
                      }}
                      className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
              <button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordChangeSuccess(false);
                  setPasswordChangeError(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {passwordChangeSuccess ? (
              <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                Password changed successfully!
              </div>
            ) : (
              <form onSubmit={handleSubmitPassword(handlePasswordSubmit)}>
                {passwordChangeError && (
                  <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {passwordChangeError}
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    id="current_password"
                    {...registerPassword('current_password', { required: 'Current password is required' })}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {passwordErrors.current_password && <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password.message}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    id="new_password"
                    {...registerPassword('new_password', { required: 'New password is required' })}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {passwordErrors.new_password && <p className="mt-1 text-sm text-red-600">{passwordErrors.new_password.message}</p>}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm_password"
                    {...registerPassword('confirm_password', { required: 'Passwords must match' })}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {passwordErrors.confirm_password && <p className="mt-1 text-sm text-red-600">{passwordErrors.confirm_password.message}</p>}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="btn btn-secondary mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;