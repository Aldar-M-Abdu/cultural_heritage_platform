import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import LoadingSpinner from './common/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token, user, fetchUser, isLoading } = useAuthStore();
  const location = useLocation();

  // If we have a token but no user info, fetch the user
  useEffect(() => {
    if (token && !user && !isLoading) {
      fetchUser().catch(() => {
        // Error handling is managed by the store
      });
    }
  }, [token, user, fetchUser, isLoading]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render children
  return children;
};

export default ProtectedRoute;