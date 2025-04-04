import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CulturalItemCard from '../components/CulturalItemCard';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    bio: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [userItems, setUserItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState('');

  // Load user data into form when component mounts
  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || ''
      });
      
      // Fetch user's items
      fetchUserItems();
    }
  }, [user]);

  const fetchUserItems = async () => {
    if (!user) return;
    
    setItemsLoading(true);
    try {
      // This would be an API call in a real application
      const response = await fetch(`/api/v1/users/${user.id}/items`);
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setUserItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItemsError('Failed to load your contributions. Please try again later.');
    } finally {
      setItemsLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};
    if (!profileForm.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!profileForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess(false);
    setGeneralError('');
    
    if (!validateProfileForm()) {
      return;
    }
    
    setIsUpdating(true);
    try {
      // This would be an API call in a real application
      // const response = await fetch(`/api/v1/users/${user.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profileForm)
      // });
      
      // Simulate successful update
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProfileSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setGeneralError('Failed to update profile. Please try again later.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess(false);
    setGeneralError('');
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsChangingPassword(true);
    try {
      // This would be an API call in a real application
      // const response = await fetch(`/api/v1/users/${user.id}/password`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(passwordForm)
      // });
      
      // Simulate successful update
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setPasswordSuccess(true);
      // Clear the password form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      // Clear success message after 3 seconds
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setGeneralError('Failed to change password. Please try again later.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center">
            <div className="h-24 w-24 rounded-full bg-indigo-800 flex justify-center items-center text-3xl font-bold mb-4 md:mb-0 md:mr-6">
              {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'User'}</h1>
              <p className="text-indigo-200">Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'unknown'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`${
                  activeTab === 'profile'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-center`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`${
                  activeTab === 'security'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-center`}
              >
                Password & Security
              </button>
              <button
                onClick={() => setActiveTab('contributions')}
                className={`${
                  activeTab === 'contributions'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-center`}
              >
                Your Contributions
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {/* Profile information tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-6">Edit Your Profile</h2>
                
                {profileSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                    <p>Your profile has been updated successfully!</p>
                  </div>
                )}
                
                {generalError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                    <p>{generalError}</p>
                  </div>
                )}
                
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={profileForm.username}
                        onChange={handleProfileChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.username 
                            ? 'border-red-300 focus:border-red-300 focus:ring-red-300' 
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                      />
                      {errors.username && (
                        <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.email 
                            ? 'border-red-300 focus:border-red-300 focus:ring-red-300' 
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={profileForm.first_name}
                        onChange={handleProfileChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.first_name 
                            ? 'border-red-300 focus:border-red-300 focus:ring-red-300' 
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                      />
                      {errors.first_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={profileForm.last_name}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={profileForm.bio}
                        onChange={handleProfileChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description for your profile. URLs are hyperlinked.
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? (
                        <>
                          <LoadingSpinner size="sm" color="white" className="mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Security tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-6">Change Your Password</h2>
                
                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                    <p>Your password has been updated successfully!</p>
                  </div>
                )}
                
                {generalError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                    <p>{generalError}</p>
                  </div>
                )}
                
                <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.currentPassword 
                          ? 'border-red-300 focus:border-red-300 focus:ring-red-300' 
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.newPassword 
                          ? 'border-red-300 focus:border-red-300 focus:ring-red-300' 
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.confirmPassword 
                          ? 'border-red-300 focus:border-red-300 focus:ring-red-300' 
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                      {isChangingPassword ? (
                        <>
                          <LoadingSpinner size="sm" color="white" className="mr-2" />
                          Updating...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="mt-12 border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Protection Reminder</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>For optimal account security, we recommend:</p>
                          <ul className="list-disc pl-5 mt-1">
                            <li>Using a unique password for this account</li>
                            <li>Including a mix of letters, numbers, and symbols</li>
                            <li>Avoiding personal information in your password</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-gray-50">
                      <div>
                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <button 
                        className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      >
                        Set Up
                      </button>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-gray-50">
                      <div>
                        <h4 className="font-medium text-gray-900">Security Log</h4>
                        <p className="text-sm text-gray-500">View your account security activity</p>
                      </div>
                      <button 
                        className="px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        View Log
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Contributions tab */}
            {activeTab === 'contributions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium text-gray-900">Your Contributions</h2>
                  <Link
                    to="/items/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add New Item
                  </Link>
                </div>
                
                {itemsLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : itemsError ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                    <p>{itemsError}</p>
                  </div>
                ) : userItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userItems.map(item => (
                      <CulturalItemCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2-2 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="mt-2 text-xl font-medium text-gray-900">No contributions yet</h3>
                    <p className="mt-1 text-sm text-gray-500">You haven't added any items to the collection yet.</p>
                    <div className="mt-6">
                      <Link
                        to="/items/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Your First Item
                      </Link>
                    </div>
                  </div>
                )}
                
                {userItems.length > 0 && (
                  <div className="mt-8 text-center">
                    <Link
                      to="/items"
                      className="text-indigo-600 font-medium hover:text-indigo-800"
                    >
                      View all your items
                    </Link>
                  </div>
                )}
                
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Statistics</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2-2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Total Items</dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">{userItems.length}</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Total Views</dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">
                                  {userItems.reduce((sum, item) => sum + (item.view_count || 0), 0)}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Comments</dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">
                                  {userItems.reduce((sum, item) => sum + (item.comments_count || 0), 0)}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;