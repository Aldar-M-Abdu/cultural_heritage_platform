import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  
  const activeCategory = searchParams.get('category') || 'all';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const postsPerPage = 6;
  
  // Fallback categories for when the API fails
  const fallbackCategories = [
    { id: 'news', name: 'News', post_count: 12 },
    { id: 'research', name: 'Research', post_count: 8 },
    { id: 'exhibitions', name: 'Exhibitions', post_count: 5 },
    { id: 'conservation', name: 'Conservation', post_count: 7 }
  ];
  
  // Fallback blog posts for when the API fails
  const fallbackPosts = [
    {
      id: 1,
      title: "New Ancient Greek Artifacts Discovered",
      content: "A team of archaeologists have uncovered a trove of well-preserved artifacts from the Classical Period in Northern Greece. The findings include pottery, jewelry, and bronze weapons that provide new insights into daily life in ancient Greek settlements.",
      created_at: "2023-06-15T08:30:00Z",
      category: { id: 'news', name: 'News' },
      author: { id: 1, full_name: "Dr. Elena Papadopoulos", username: "epapadop" },
      image_url: "https://images.unsplash.com/photo-1603966187872-3a0f12839769?auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      title: "Conservation Techniques for Textile Artifacts",
      content: "Preserving ancient textiles presents unique challenges due to their organic nature and susceptibility to environmental factors. This article explores cutting-edge conservation methods being employed by leading museums to stabilize and preserve fragile textile artifacts.",
      created_at: "2023-05-22T14:15:00Z",
      category: { id: 'conservation', name: 'Conservation' },
      author: { id: 2, full_name: "Maria Johnson", username: "mjohnson" },
      image_url: "https://images.unsplash.com/photo-1579762593175-20226054cad0?auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      title: "Virtual Exhibition: Mayan Ceremonial Objects",
      content: "Our new virtual exhibition explores the rich spiritual world of the Maya through their ceremonial objects. Using 3D scanning technology, visitors can examine intricate jade masks, ceramic vessels, and stone carvings from multiple angles, with detailed annotations explaining their cultural significance.",
      created_at: "2023-04-10T09:45:00Z",
      category: { id: 'exhibitions', name: 'Exhibitions' },
      author: { id: 3, full_name: "Carlos Mendez", username: "cmendez" },
      image_url: "https://images.unsplash.com/photo-1590687755451-3c8552186068?auto=format&fit=crop&q=80"
    }
  ];
  
  // Fetch blog posts and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

        // Create AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        // Fetch categories
        let categoriesData;
        try {
          const categoriesResponse = await fetch(`${API_BASE_URL}/api/v1/blog/categories`, {
            signal: controller.signal
          });
          
          if (!categoriesResponse.ok) {
            // Try alternate endpoint
            const altCategoriesResponse = await fetch(`${API_BASE_URL}/api/v1/blog-categories`, {
              signal: AbortSignal.timeout(5000)
            });
            
            if (altCategoriesResponse.ok) {
              categoriesData = await altCategoriesResponse.json();
            } else {
              console.warn('Both category endpoints failed');
              categoriesData = fallbackCategories;
            }
          } else {
            categoriesData = await categoriesResponse.json();
          }
        } catch (err) {
          console.warn('Error fetching categories:', err);
          categoriesData = fallbackCategories;
        }
        
        // Process categories data
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else if (categoriesData && categoriesData.items && Array.isArray(categoriesData.items)) {
          setCategories(categoriesData.items);
        } else {
          console.warn('Categories not in expected format:', categoriesData);
          setCategories(fallbackCategories);
        }
        
        // Fetch blog posts
        const skip = (currentPage - 1) * postsPerPage;
        let url = `${API_BASE_URL}/api/v1/blog-posts?skip=${skip}&limit=${postsPerPage}`;
        
        if (activeCategory !== 'all') {
          url += `&category=${encodeURIComponent(activeCategory)}`;
        }
        
        let postsData;
        try {
          const postsResponse = await fetch(url, {
            signal: controller.signal
          });
          
          if (!postsResponse.ok) {
            // Try alternate endpoint
            const altUrl = `${API_BASE_URL}/api/v1/blog?skip=${skip}&limit=${postsPerPage}${
              activeCategory !== 'all' ? `&category=${encodeURIComponent(activeCategory)}` : ''
            }`;
            
            const altPostsResponse = await fetch(altUrl, {
              signal: AbortSignal.timeout(5000)
            });
            
            if (altPostsResponse.ok) {
              postsData = await altPostsResponse.json();
            } else {
              console.warn('Both post endpoints failed');
              postsData = { 
                items: fallbackPosts,
                total: fallbackPosts.length,
                page: 1,
                pages: 1
              };
            }
          } else {
            postsData = await postsResponse.json();
          }
        } catch (err) {
          console.warn('Error fetching posts:', err);
          postsData = { 
            items: fallbackPosts,
            total: fallbackPosts.length,
            page: 1,
            pages: 1
          };
        }
        
        // Process posts data
        let posts = [];
        let total = 0;
        
        if (Array.isArray(postsData)) {
          posts = postsData;
          total = posts.length;
        } else if (postsData && postsData.items && Array.isArray(postsData.items)) {
          posts = postsData.items;
          total = postsData.total || posts.length;
        } else {
          console.warn('Posts not in expected format:', postsData);
          posts = fallbackPosts;
          total = fallbackPosts.length;
        }
        
        // Ensure each post has properly structured data
        const processedPosts = posts.map(post => ({
          id: post.id,
          title: post.title || 'Untitled Post',
          content: post.content || post.body || post.description || 'No content available',
          created_at: post.created_at || post.createdAt || post.date || new Date().toISOString(),
          category: post.category || { 
            id: post.category_id || 'uncategorized', 
            name: post.category_name || 'Uncategorized' 
          },
          author: post.author || {
            id: post.author_id || post.userId || 0,
            full_name: post.author_name || 'Unknown Author',
            username: post.username || 'anonymous'
          },
          image_url: post.image_url || post.imageUrl || post.image || 
            'https://images.unsplash.com/photo-1572953109213-3be62398eb95?auto=format&fit=crop&q=80'
        }));
        
        setBlogPosts(processedPosts);
        setTotalPages(Math.ceil(total / postsPerPage) || 1);
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
      } catch (err) {
        console.error('Failed to load blog data:', err);
        setError('Failed to load blog content. Please try again later.');
        setBlogPosts(fallbackPosts);
        setCategories(fallbackCategories);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [activeCategory, currentPage, postsPerPage]);
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSearchParams({ category: categoryId, page: '1' });
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ 
        ...(activeCategory !== 'all' ? { category: activeCategory } : {}), 
        page: newPage.toString() 
      });
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filter by Category</h2>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className={`px-4 py-2 rounded-md text-sm ${
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
                className={`px-4 py-2 rounded-md text-sm ${
                  activeCategory === category.id
                    ? 'bg-indigo-100 text-indigo-800 font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name} {category.post_count && `(${category.post_count})`}
              </button>
            ))}
          </div>
        </div>
        
        {/* Status display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8">
            <div className="flex">
              <svg className="w-5 h-5 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd"></path>
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" color="indigo" />
          </div>
        ) : blogPosts.length > 0 ? (
          <>
            {/* Blog posts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <Link to={`/blog/${post.id}`}>
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      <img 
                        src={post.image_url}
                        alt={post.title}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1572953109213-3be62398eb95?auto=format&fit=crop&q=80";
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-2">
                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                          {post.category.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center text-sm">
                        <div className="flex items-center text-gray-500">
                          <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{post.author.full_name || post.author.username}</span>
                        </div>
                        <div className="ml-auto text-indigo-600 font-medium">
                          Read more
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
            
            {/* Pagination */}
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <svg className="h-16 w-16 text-indigo-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No blog posts found</h2>
            <p className="text-gray-500 mb-6">
              {activeCategory !== 'all'
                ? "There are no posts in this category. Try selecting a different category."
                : "No blog posts have been published yet. Check back soon!"}
            </p>
            {activeCategory !== 'all' && (
              <button
                onClick={() => handleCategoryChange('all')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                View All Posts
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;