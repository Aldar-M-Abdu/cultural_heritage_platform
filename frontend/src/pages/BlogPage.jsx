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
  
  // Fetch blog posts and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch blog categories first
        const categoriesResponse = await fetch('/api/v1/blog-posts/categories');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch blog categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
        // Prepare blog posts fetch URL with filters
        let url = `/api/v1/blog-posts/?limit=${postsPerPage}&skip=${(currentPage - 1) * postsPerPage}`;
        if (activeCategory !== 'all') {
          url += `&category_id=${activeCategory}`;
        }
        
        // Fetch the blog posts
        const postsResponse = await fetch(url);
        if (!postsResponse.ok) throw new Error('Failed to fetch blog posts');
        const postsData = await postsResponse.json();
        setBlogPosts(postsData);
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError('Failed to load blog content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [activeCategory, currentPage]);
  
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