import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CulturalItemCard from '../components/CulturalItemCard';
import { API_BASE_URL } from '../config';

const ProfilePage = () => {
  const { user, isAuthenticated, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    full_name: '',
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
  const [userContributions, setUserContributions] = useState([]);
  const [contributionStats, setContributionStats] = useState({
    total: 0,
    add: 0,
    edit: 0,
    delete: 0
  });
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState('');
  const [contributionsError, setContributionsError] = useState('');
  const [contributionSort, setContributionSort] = useState('newest');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    commentNotifications: true,
    favoriteNotifications: true,
    systemUpdates: true
  });
  const [notificationSuccess, setNotificationSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        email: user.email || '',
        full_name: user.full_name || '',
        bio: user.bio || ''
      });

      if (user.profile_image) {
        setProfileImagePreview(user.profile_image);
      }

      fetchUserItems();
      fetchUserContributions();
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNotificationPreferenceChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setGeneralError("Profile image must be less than 2MB");
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    if (!profileImage) return;

    setIsUploadingImage(true);
    setGeneralError('');

    useAuthStore.getState().uploadProfileImage(profileImage)
      .then(() => {
        setIsUploadingImage(false);
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      })
      .catch(error => {
        setGeneralError(error.message || 'Failed to upload profile image');
        setIsUploadingImage(false);
      });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setGeneralError('');
    setProfileSuccess(false);

    const newErrors = {};
    if (!profileForm.username) newErrors.username = 'Username is required';
    if (!profileForm.email) newErrors.email = 'Email is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsUpdating(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/v1/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileForm)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);

      if (profileImage) {
        return handleImageUpload();
      }
    })
    .catch(error => {
      setGeneralError(error.message || 'Failed to update profile');
    })
    .finally(() => {
      setIsUpdating(false);
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setGeneralError('');
    setPasswordSuccess(false);

    const newErrors = {};
    if (!passwordForm.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword) newErrors.newPassword = 'New password is required';
    else if (passwordForm.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (!passwordForm.confirmPassword) newErrors.confirmPassword = 'Please confirm your new password';
    else if (passwordForm.newPassword !== passwordForm.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsChangingPassword(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/v1/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    })
    .catch(error => {
      setGeneralError(error.message || 'Failed to change password');
    })
    .finally(() => {
      setIsChangingPassword(false);
    });
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setGeneralError('');
    setNotificationSuccess(false);

    fetch(`${API_BASE_URL}/api/v1/users/notifications/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(notificationPreferences)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update notification preferences');
      }

      setNotificationSuccess(true);
      setTimeout(() => setNotificationSuccess(false), 3000);
    })
    .catch(error => {
      setGeneralError(error.message || 'Failed to update notification preferences');
    })
    .finally(() => {
      setIsUpdating(false);
    });
  };

  const fetchUserItems = () => {
    try {
      setItemsLoading(true);
      
      fetch(`${API_BASE_URL}/api/v1/cultural-items?user_id=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setUserItems(Array.isArray(data) ? data : data.items || []);
      })
      .catch(error => {
        console.error('Error fetching user items:', error);
        setItemsError('Failed to load your items');
      })
      .finally(() => {
        setItemsLoading(false);
      });
    } catch (error) {
      console.error('Error fetching user items:', error);
      setItemsError('Failed to load your items');
    }
  };

  const fetchUserContributions = () => {
    if (!user) return;

    try {
      if (!token) {
        throw new Error("Authentication token not available");
      }
      
      fetch(`${API_BASE_URL}/api/v1/user-contributions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setUserContributions(data);
      })
      .catch(error => {
        console.error('Error fetching user contributions:', error);
        
        if (error.message.includes('401')) {
          setContributionsError('Please log in to view your contributions');
        } else if (error.message.includes('403')) {
          setContributionsError('You do not have permission to access these contributions.');
        } else if (error.message.includes('404')) {
          setContributionsError('No contribution history found');
        } else {
          setContributionsError('Failed to load your contributions');
        }
      });
    } catch (error) {
      console.error('Error fetching user contributions:', error);
      setContributionsError('Failed to load your contributions');
    }
  };

  const sortContributions = (contributions) => {
    return [...contributions].sort((a, b) => {
      if (contributionSort === 'oldest') {
        return new Date(a.timestamp) - new Date(b.timestamp);
      } else if (contributionSort === 'newest') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (contributionSort === 'type') {
        return a.contribution_type.localeCompare(b.contribution_type);
      }
      return 0;
    });
  };

  const getContributionTypeColor = (type) => {
    switch (type) {
      case 'add': return 'bg-green-100 text-green-800';
      case 'edit': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
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
                  onClick={() => setActiveTab('notifications')}
                  className={`${
                    activeTab === 'notifications'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-center`}
                >
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('contributions')}
                  className={`${
                    activeTab === 'contributions'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-center`}
                >
                  Contributions
                </button>
              </nav>
            </div>

            <div className="py-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-6">Edit Your Profile</h2>
                  
                  {profileSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                      <p>Profile updated successfully!</p>
                    </div>
                  )}
                  
                  {generalError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                      <p>{generalError}</p>
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                    <div className="flex items-center">
                      <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-300">
                        {profileImagePreview ? (
                          <img
                            src={profileImagePreview}
                            alt="Profile Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <svg
                            className="h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="ml-5 space-y-2">
                        <input
                          type="file"
                          id="profile-image"
                          name="profile-image"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          ref={fileInputRef}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Choose Image
                        </button>
                        {profileImage && (
                          <button
                            type="button"
                            onClick={handleImageUpload}
                            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            {isUploadingImage ? (
                              <>
                                <LoadingSpinner size="sm" color="white" className="mr-2" />
                                Uploading...
                              </>
                            ) : "Upload Image"}
                          </button>
                        )}
                        <p className="text-xs text-gray-500">
                          JPEG, PNG or GIF. Max 2MB.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-lg">
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
                  
                    <div>
                      <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={profileForm.full_name}
                        onChange={handleProfileChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.full_name 
                            ? 'border-red-300 focus:border-red-300 focus:ring-red-300' 
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                      />
                      {errors.full_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                      )}
                    </div>
                  
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={profileForm.bio}
                        onChange={handleProfileChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.bio 
                            ? 'border-red-300 focus:border-red-300 focus:ring-red-300' 
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                      />
                      {errors.bio && (
                        <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                      )}
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
                            Updating...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-6">Password & Security</h2>
                  
                  {passwordSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                      <p>Password changed successfully!</p>
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
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-6">Notification Preferences</h2>
                  
                  {notificationSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                      <p>Your notification preferences have been updated successfully!</p>
                    </div>
                  )}
                  
                  {generalError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                      <p>{generalError}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handleNotificationSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500 mb-6">
                        Choose how and when you'd like to receive notifications from the platform.
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                          <p className="text-sm text-gray-500">Receive email updates about your account activity</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="emailNotifications"
                            checked={notificationPreferences.emailNotifications} 
                            onChange={handleNotificationPreferenceChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                          <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox"
                            name="pushNotifications"
                            checked={notificationPreferences.pushNotifications} 
                            onChange={handleNotificationPreferenceChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="pt-6 border-t border-gray-200">
                        <h4 className="text-base font-medium text-gray-900 mb-4">Notification Types</h4>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Comments</h4>
                            <p className="text-sm text-gray-500">When someone comments on your content</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox"
                              name="commentNotifications"
                              checked={notificationPreferences.commentNotifications} 
                              onChange={handleNotificationPreferenceChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Favorites</h4>
                            <p className="text-sm text-gray-500">When someone favorites your content</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox"
                              name="favoriteNotifications"
                              checked={notificationPreferences.favoriteNotifications} 
                              onChange={handleNotificationPreferenceChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">System Updates</h4>
                            <p className="text-sm text-gray-500">Important announcements and platform updates</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox"
                              name="systemUpdates"
                              checked={notificationPreferences.systemUpdates} 
                              onChange={handleNotificationPreferenceChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      </div>
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
                          'Save Preferences'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
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
                  
                  <div className="flex justify-end mb-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                      <select
                        value={contributionSort}
                        onChange={(e) => setContributionSort(e.target.value)}
                        className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="type">Contribution Type</option>
                      </select>
                    </div>
                  </div>
                  
                  {itemsLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : itemsError ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                      <p>{itemsError}</p>
                    </div>
                  ) : userContributions.length > 0 ? (
                    <div className="space-y-6">
                      {sortContributions(userContributions).map((contribution) => (
                        <div key={contribution.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContributionTypeColor(contribution.contribution_type)}`}>
                                {contribution.contribution_type}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(contribution.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <Link 
                              to={`/items/${contribution.cultural_item_id}`}
                              className="text-sm text-indigo-600 hover:text-indigo-800"
                            >
                              View Item
                            </Link>
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-1">{contribution.cultural_item.title}</h3>
                            <p className="text-sm text-gray-500">{contribution.cultural_item.description?.substring(0, 150)}...</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 2 012-2v-6a2-2 2 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
                  
                  {userContributions.length > 0 && (
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2-2 2 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
                            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Added Items</dt>
                                <dd>
                                  <div className="text-lg font-medium text-gray-900">{contributionStats.add}</div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Edited Items</dt>
                                <dd>
                                  <div className="text-lg font-medium text-gray-900">{contributionStats.edit}</div>
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
    </div>
  );
};

export default ProfilePage;