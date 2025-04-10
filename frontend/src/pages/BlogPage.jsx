import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const activeCategory = searchParams.get('category') || 'all';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const postsPerPage = 6;
  
  // Fallback categories for when the API fails
  const fallbackCategories = [
    { id: 'news', name: 'News', post_count: 12 },
    { id: 'research', name: 'Research', post_count: 8 },
    { id: 'exhibitions', name: 'Exhibitions', post_count: 5 },
    { id: 'conservation', name: 'Conservation', post_count: 7 }
  ];
  
  // Fetch blog posts and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First try to fetch categories
        try {
          console.log("Fetching blog categories...");
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
          // Use AbortController for better timeout control
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const categoriesResponse = await fetch(`${API_BASE_URL}/api/v1/blog-posts/categories`, {
            signal: controller.signal
          }).catch(err => {
            console.warn('Network error fetching categories:', err);
            clearTimeout(timeoutId);
            return { ok: false };
          });
          
          clearTimeout(timeoutId);
          console.log("Categories response status:", categoriesResponse.status);
          
          if (categoriesResponse.ok) {
            const fetchedCategories = await categoriesResponse.json();
            console.log("Fetched categories:", fetchedCategories);
            
            if (Array.isArray(fetchedCategories)) {
              setCategories(fetchedCategories);
            } else {
              console.warn('Categories API returned non-array format:', fetchedCategories);
              setCategories(fallbackCategories);
            }
          } else {
            console.warn('Categories API returned status:', categoriesResponse.status);
            setCategories(fallbackCategories);
          }
        } catch (categoryError) {
          console.warn('Error fetching blog categories:', categoryError);
          // Use fallback categories if the API is unavailable
          setCategories(fallbackCategories);
        }
        
        // Now fetch blog posts
        const skip = (currentPage - 1) * postsPerPage;
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
        let url = `${API_BASE_URL}/api/v1/blog-posts/?skip=${skip}&limit=${postsPerPage}`;
        if (activeCategory !== 'all') {
          url += `&category_id=${encodeURIComponent(activeCategory)}`;
        }
        
        console.log("Fetching blog posts from URL:", url);
        // Use AbortController for better timeout control
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        try {
          const postsResponse = await fetch(url, {
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          console.log("Posts response status:", postsResponse.status);
          
          if (!postsResponse.ok) {
            throw new Error(`Failed to fetch blog posts: ${postsResponse.status}`);
          }
          
          const postsData = await postsResponse.json();
          console.log("Fetched posts data:", postsData);
          
          // Ensure we always have an array of posts with proper data structure
          const posts = Array.isArray(postsData) ? postsData : [];
          
          // Transform posts to ensure they have expected structure
          const processedPosts = posts.map(post => {
            // Ensure category is properly structured
            if (!post.category) {
              post.category = { 
                id: post.category_name || 'uncategorized', 
                name: post.category_name || 'Uncategorized' 
              };
            }
            
            // Ensure author is properly structured
            if (!post.author) {
              post.author = {
                id: post.author_id,
                username: 'Unknown',
                full_name: 'Unknown Author'
              };
            }
            
            return post;
          });
          
          console.log("Processed posts:", processedPosts);
          setBlogPosts(processedPosts);
        } catch (fetchError) {
          if (fetchError.name === 'AbortError') {
            throw new Error('Request timed out. Please try again later.');
          }
          throw fetchError;
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('Failed to load blog content. Please try again later.');
        setBlogPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [activeCategory, currentPage, postsPerPage]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSearchParams({ category: categoryId, page: '1' });
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    setSearchParams({ category: activeCategory, page: newPage.toString() });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-serif font-bold mb-4">Cultural Heritage Blog</h1>
          <p className="text-lg text-indigo-100 max-w-3xl">
            Explore articles, insights, and stories about cultural heritage artifacts and traditions from around the world.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-gray-700 font-medium">Filter by Category:</span>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              activeCategory === 'all'
                ? 'bg-indigo-100 text-indigo-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleCategoryChange('all')}
          >
            All Posts
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-3 py-1 rounded-full text-sm ${
                activeCategory === category.id
                  ? 'bg-indigo-100 text-indigo-800 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name} ({category.post_count})
            </button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : blogPosts.length > 0 ? (
          <>
            {/* Blog posts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <Link to={`/blog/${post.id}`}>
                    <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                    <div className="p-6">
                      <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mb-2">
                        {post.category.name}
                      </span>
                      <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-3">{formatDate(post.created_at)}</span>
                        <span>By {post.author.full_name || post.author.username}</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded font-medium">
                  {currentPage}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={blogPosts.length < postsPerPage}
                  className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No blog posts found</h2>
            <p className="text-gray-500">
              {activeCategory !== 'all'
                ? "There are no posts in this category. Try selecting a different category."
                : "No blog posts have been published yet. Check back soon!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;