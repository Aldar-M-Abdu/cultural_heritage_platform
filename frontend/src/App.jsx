import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ItemsListPage from './pages/ItemsListPage';
import ItemDetailPage from './pages/ItemDetailPage';
import CommentPage from './pages/CommentPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import CreateItemPage from './pages/CreateItemPage';
import AboutPage from './pages/AboutPage';
import AccessibilityPage from './pages/AccessibilityPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import ExplorePage from './pages/ExplorePage';
import MapView from './pages/MapView';
import PrivacyPolicy from './pages/PrivacyPolicy';
import UserSettingsPage from './pages/UserSettingsPage';
import PasswordResetRequestPage from './pages/PasswordResetRequestPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PressPage from './pages/PressPage';
import TermsOfService from './pages/TermsOfService';
import ExamplePage from './pages/ExamplePage';
import CommunityPage from './pages/CommunityPage';
import ContributorsPage from './pages/ContributorsPage';
import ExhibitionsPage from './pages/ExhibitionsPage';
import TimelinePage from './pages/TimelinePage';
import FAQPage from './pages/FAQPage';
import useAuthStore from './stores/authStore';

const API_BASE_URL = 'http://localhost:8000'; // Ensure this matches the backend URL

// Scroll to top component when route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

function App() {
  const { checkAuth, token } = useAuthStore();

  // Check authentication state when app loads
  useEffect(() => {
    if (token) {
      checkAuth().catch(error => {
        console.error('Failed to fetch user data:', error);
      });
    }
  }, [token, checkAuth]);

  // Listen for custom auth events
  useEffect(() => {
    const handleSessionExpired = () => {
      alert('Your session has expired. Please log in again.');
      window.location.href = '/login';
    };
    
    window.addEventListener('auth:sessionExpired', handleSessionExpired);
    
    return () => {
      window.removeEventListener('auth:sessionExpired', handleSessionExpired);
    };
  }, []);

  return (
    <ToastProvider>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/items" element={<ItemsListPage />} />
            <Route path="/items/:id" element={<ItemDetailPage />} />
            <Route path="/items/:itemId/comments" element={<CommentPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/forgot-password" element={<PasswordResetRequestPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/press" element={<PressPage />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/examples" element={<ExamplePage />} />
            
            {/* New routes for the additional pages */}
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/contributors" element={<ContributorsPage />} />
            <Route path="/exhibitions" element={<ExhibitionsPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/faq" element={<FAQPage />} />
            
            {/* Protected routes */}
            <Route path="/profile" element={
              <ProtectedRoute fallback="/login">
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute fallback="/login">
                <UserSettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/items/new" element={
              <ProtectedRoute fallback="/login">
                <CreateItemPage />
              </ProtectedRoute>
            } />
            <Route path="/items/:id/edit" element={
              <ProtectedRoute fallback="/login">
                {/* ItemFormPage will be implemented later */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                  <h1 className="text-3xl font-bold text-gray-900">Edit Item</h1>
                  <p>Form will be added here</p>
                </div>
              </ProtectedRoute>
            } />
            
            {/* Catch-all route for 404 errors */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;
