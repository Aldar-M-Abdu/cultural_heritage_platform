import React, { useState } from 'react';
import { BellIcon, LockClosedIcon, UserIcon, CogIcon } from '@heroicons/react/24/outline';

const UserSettingsPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: false,
    weeklyDigest: true,
  });

  const [activeTab, setActiveTab] = useState('account');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.newPassword && !formData.currentPassword) 
      newErrors.currentPassword = 'Current password is required to set a new password';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Updated settings:', formData);
      
      // Display success notification
      const notification = document.getElementById('notification');
      notification.classList.remove('translate-y-full');
      setTimeout(() => {
        notification.classList.add('translate-y-full');
      }, 3000);
    }
  };

  const toggleNotification = (type) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Success Notification */}
      <div 
        id="notification" 
        className="fixed bottom-0 inset-x-0 transform translate-y-full transition-transform duration-300 ease-in-out"
      >
        <div className="max-w-md mx-auto mb-4 bg-green-50 border-l-4 border-green-500 p-4 shadow-lg rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">Settings updated successfully!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Settings</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your account preferences and settings</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">US</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">User Settings</p>
                    <p className="text-xs text-gray-500">user@example.com</p>
                  </div>
                </div>
              </div>
              <div className="py-2">
                <button 
                  onClick={() => setActiveTab('account')}
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${activeTab === 'account' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <UserIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Account Information</span>
                </button>
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <BellIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Notifications</span>
                </button>
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <LockClosedIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Security</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              {/* Account Information */}
              {activeTab === 'account' && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                      <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            id="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className={`block w-full pr-10 focus:outline-none sm:text-sm rounded-md ${errors.username ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                            placeholder="Your username"
                            aria-invalid={errors.username ? "true" : "false"}
                            aria-describedby={errors.username ? "username-error" : undefined}
                          />
                          {errors.username && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        {errors.username && <p className="mt-2 text-sm text-red-600" id="username-error">{errors.username}</p>}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`block w-full pr-10 focus:outline-none sm:text-sm rounded-md ${errors.email ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                            placeholder="your.email@example.com"
                            aria-invalid={errors.email ? "true" : "false"}
                            aria-describedby={errors.email ? "email-error" : undefined}
                          />
                          {errors.email && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        {errors.email && <p className="mt-2 text-sm text-red-600" id="email-error">{errors.email}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Preferences */}
              {activeTab === 'notifications' && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <BellIcon className="h-5 w-5 text-gray-500" />
                      <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-6">Choose how you want to be notified about updates, news, and account activity.</p>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Communication channels</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                id="emailNotifications"
                                type="checkbox"
                                checked={notificationSettings.emailNotifications}
                                onChange={() => toggleNotification('emailNotifications')}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <label htmlFor="emailNotifications" className="ml-3">
                                <span className="block text-sm font-medium text-gray-700">Email Notifications</span>
                                <span className="block text-xs text-gray-500">Receive updates directly to your inbox</span>
                              </label>
                            </div>
                            <span className="text-xs text-gray-500">Daily</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                id="smsNotifications"
                                type="checkbox"
                                checked={notificationSettings.smsNotifications}
                                onChange={() => toggleNotification('smsNotifications')}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <label htmlFor="smsNotifications" className="ml-3">
                                <span className="block text-sm font-medium text-gray-700">SMS Notifications</span>
                                <span className="block text-xs text-gray-500">Get text alerts for important updates</span>
                              </label>
                            </div>
                            <span className="text-xs text-gray-500">Immediate</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                id="pushNotifications"
                                type="checkbox"
                                checked={notificationSettings.pushNotifications}
                                onChange={() => toggleNotification('pushNotifications')}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <label htmlFor="pushNotifications" className="ml-3">
                                <span className="block text-sm font-medium text-gray-700">Push Notifications</span>
                                <span className="block text-xs text-gray-500">Receive alerts on your device</span>
                              </label>
                            </div>
                            <span className="text-xs text-gray-500">Immediate</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Notification types</h3>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <input
                              id="weeklyDigest"
                              type="checkbox"
                              checked={notificationSettings.weeklyDigest}
                              onChange={() => toggleNotification('weeklyDigest')}
                              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="weeklyDigest" className="ml-3">
                              <span className="block text-sm font-medium text-gray-700">Weekly Digest</span>
                              <span className="block text-xs text-gray-500">Get a summary of your account activity</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <LockClosedIcon className="h-5 w-5 text-gray-500" />
                      <h2 className="text-lg font-medium text-gray-900">Security</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Change Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                              Current Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <input
                                id="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                className={`block w-full pr-10 focus:outline-none sm:text-sm rounded-md ${errors.currentPassword ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                                placeholder="••••••••"
                                aria-invalid={errors.currentPassword ? "true" : "false"}
                                aria-describedby={errors.currentPassword ? "currentPassword-error" : undefined}
                              />
                              {errors.currentPassword && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            {errors.currentPassword && <p className="mt-2 text-sm text-red-600" id="currentPassword-error">{errors.currentPassword}</p>}
                          </div>
                          <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                              New Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <input
                                id="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                className={`block w-full focus:outline-none sm:text-sm rounded-md ${errors.newPassword ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                                placeholder="••••••••"
                              />
                            </div>
                            <p className="mt-2 text-xs text-gray-500">Must be at least 8 characters with uppercase, lowercase, number, and special character</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                >
                  <CogIcon className="h-4 w-4 mr-2" />
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