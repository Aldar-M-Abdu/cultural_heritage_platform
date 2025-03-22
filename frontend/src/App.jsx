import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProfilePage from './pages/ProfilePage';
import ItemsListPage from './pages/ItemsListPage';
import ExplorePage from './pages/ExplorePage';
import ItemDetailPage from './pages/ItemDetailPage';
import CreateItemPage from './pages/CreateItemPage';
import MapView from './pages/MapView';
import AboutPage from './pages/AboutPage';
import ProtectedRoute from './components/ProtectedRoute';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import CommentPage from './pages/CommentPage';
import BlogPage from './pages/BlogPage';
import AccessibilityPage from './pages/AccessibilityPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/explore" element={<ExplorePage />} />
          {/* Items list route */}
          <Route path="/items" element={<ItemsListPage />} />
          <Route path="/items/new" element={
            <ProtectedRoute>
              <CreateItemPage />
            </ProtectedRoute>
          } />
          <Route path="/items/:id" element={<ItemDetailPage />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/comments" element={<CommentPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="*" element={<NotFoundPage />} /> {/* 404 route */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
