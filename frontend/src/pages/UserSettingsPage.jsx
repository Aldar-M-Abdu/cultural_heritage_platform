import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, LockClosedIcon, BellIcon } from '@heroicons/react/24/outline';
import useAuthStore from '../stores/authStore';

const UserSettingsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, changePassword, error: authError } = useAuthStore();
  
  // State management
  const [activeTab, setActiveTab] = useState('account');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState({ message: '', type: '' });
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyDigest: false,
  });
  
  // Load user data when component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        username: user.username || '',
        email: user.email || '',
      }));
    }
  }, [user, isAuthenticated, navigate]);
  
  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear errors when field is modified
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };
  
  // Handle notification settings changes
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prevSettings => ({
      ...prevSettings,
      [name]: checked
    }));
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (activeTab === 'account') {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (activeTab === 'security') {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters long';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setNotificationMessage({ message: '', type: '' });
    
    try {
      if (activeTab === 'account') {
        await updateProfile({
          username: formData.username,
          email: formData.email
        });
        
        setNotificationMessage({
          message: 'Account information updated successfully',
          type: 'success'
        });
      } else if (activeTab === 'security') {
        await changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
        
        setNotificationMessage({
          message: 'Password changed successfully',
          type: 'success'
        });
        
        // Clear password fields after successful change
        setFormData(prevData => ({
          ...prevData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else if (activeTab === 'notifications') {
        // Handle notification settings update
        // This would be implemented with a proper API call
        setTimeout(() => {
          setNotificationMessage({
            message: 'Notification preferences updated successfully',
            type: 'success'
          });
        }, 500);
      }
    } catch (error) {
      setNotificationMessage({
        message: error.message || authError || 'An error occurred while saving changes',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
        
        {notificationMessage.message && (
          <div className={`mb-6 p-4 rounded-md ${
            notificationMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {notificationMessage.message}
          </div>
        )}
        
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'account'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('account')}
              >
                <UserIcon className="h-5 w-5 inline mr-2" />
                Account
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('security')}
              >
                <LockClosedIcon className="h-5 w-5 inline mr-2" />
                Security
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'notifications'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <BellIcon className="h-5 w-5 inline mr-2" />
                Notifications
              </button>
            </nav>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              {/* Account Settings */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.username ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>
              )}
              
              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.currentPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.currentPassword && <p className="mt-2 text-sm text-red-600">{errors.currentPassword}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.newPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.newPassword && <p className="mt-2 text-sm text-red-600">{errors.newPassword}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>
              )}
              
              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive email updates about your account activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="emailNotifications"
                          checked={notificationSettings.emailNotifications} 
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                        <p className="text-sm text-gray-500">Receive text message updates about your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox"
                          name="smsNotifications" 
                          checked={notificationSettings.smsNotifications} 
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                        <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox"
                          name="pushNotifications"
                          checked={notificationSettings.pushNotifications} 
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Weekly Digest</h4>
                        <p className="text-sm text-gray-500">Receive a weekly summary of platform activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox"
                          name="weeklyDigest"
                          checked={notificationSettings.weeklyDigest} 
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;