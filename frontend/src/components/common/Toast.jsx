import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const toastTypes = {
  success: {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    iconColor: 'text-green-600',
  },
  error: {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    iconColor: 'text-red-600',
  },
  info: {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-600',
  },
  warning: {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-600',
  },
};

// Toast component for displaying notifications
const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  const { icon, bgColor, textColor, iconColor } = toastTypes[type] || toastTypes.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Allow time for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return createPortal(
    <div 
      className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}
    >
      <div className={`${bgColor} ${textColor} p-4 rounded-lg shadow-lg flex items-start max-w-sm`}>
        <div className={`flex-shrink-0 ${iconColor}`}>
          {icon}
        </div>
        <div className="ml-3 flex-1 pt-0.5">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          type="button"
          className={`ml-4 flex-shrink-0 inline-flex ${textColor} hover:bg-opacity-20 rounded-full p-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type === 'error' ? 'red' : type === 'success' ? 'green' : 'indigo'}-500`}
          onClick={() => {
            setVisible(false);
            setTimeout(() => onClose && onClose(), 300);
          }}
        >
          <span className="sr-only">Close</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
};

// ToastContainer manages multiple toast notifications
export const ToastContainer = ({ toasts, removeToast }) => {
  return createPortal(
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
};

export default Toast;
