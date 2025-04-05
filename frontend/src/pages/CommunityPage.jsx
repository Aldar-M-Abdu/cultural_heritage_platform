import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../stores/authStore';

const CommunityPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuthStore();

  const categories = [
    { id: 'all', name: 'All Discussions' },
    { id: 'general', name: 'General Discussion' },
    { id: 'research', name: 'Research & Methodology' },
    { id: 'identification', name: 'Artifact Identification' },
    { id: 'preservation', name: 'Preservation Techniques' },
    { id: 'events', name: 'Events & Conferences' }
  ];

  // Fetch discussions data
  useEffect(() => {
    const fetchDiscussions = async () => {
      setIsLoading(true);
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockDiscussions = [
          {
            id: 1,
            title: "Best practices for photographing ancient textiles?",
            author: {
              id: 101,
              name: "Maria Wilson",
              avatar: "https://randomuser.me/api/portraits/women/44.jpg",
              role: "Textile Conservator"
            },
            category: "preservation",
            content: "I'm working on documenting a collection of 18th century textiles and looking for advice on lighting and camera settings to capture the details without causing damage...",
            createdAt: "2025-03-12T14:32:00Z",
            commentCount: 23,
            viewCount: 156,
            isPinned: false,
            lastActivity: "2025-03-14T09:15:00Z"
          },
          {
            id: 2,
            title: "Upcoming virtual symposium on Indigenous heritage preservation",
            author: {
              id: 102,
              name: "Robert Eagle",
              avatar: "https://randomuser.me/api/portraits/men/22.jpg",
              role: "Cultural Heritage Specialist"
            },
            category: "events",
            content: "I wanted to share information about an upcoming virtual symposium focused on collaborative approaches to preserving Indigenous cultural heritage. Speakers from various institutions will discuss...",
            createdAt: "2025-03-10T09:45:00Z",
            commentCount: 8,
            viewCount: 97,
            isPinned: true,
            lastActivity: "2025-03-13T16:22:00Z"
          },
          {
            id: 3,
            title: "Help identifying this ceramic artifact from North Africa",
            author: {
              id: 103,
              name: "Ahmed Hassan",
              avatar: "https://randomuser.me/api/portraits/men/55.jpg",
              role: "Amateur Archaeologist"
            },
            category: "identification",
            content: "During my recent travels to Morocco, I came across this interesting ceramic piece that appears to be quite old. It has distinctive geometric patterns and...",
            createdAt: "2025-03-11T18:21:00Z",
            commentCount: 15,
            viewCount: 112,
            isPinned: false,
            lastActivity: "2025-03-14T11:30:00Z"
          },
          {
            id: 4,
            title: "Introduction to dendrochronology for dating wooden artifacts",
            author: {
              id: 104,
              name: "Sara Jensen",
              avatar: "https://randomuser.me/api/portraits/women/68.jpg",
              role: "Archaeologist"
            },
            category: "research",
            content: "I recently completed a workshop on dendrochronology and wanted to share some insights on how this method can be applied to dating wooden artifacts. The process involves...",
            createdAt: "2025-03-09T11:15:00Z",
            commentCount: 12,
            viewCount: 203,
            isPinned: false,
            lastActivity: "2025-03-13T14:45:00Z"
          },
          {
            id: 5,
            title: "Welcome to new members - Introduce yourself!",
            author: {
              id: 105,
              name: "James Thompson",
              avatar: "https://randomuser.me/api/portraits/men/32.jpg",
              role: "Community Moderator"
            },
            category: "general",
            content: "Welcome to our growing community of cultural heritage enthusiasts! Please take a moment to introduce yourself and share what brings you here. We'd love to know about your background, interests, and...",
            createdAt: "2025-01-15T08:30:00Z",
            commentCount: 87,
            viewCount: 342,
            isPinned: true,
            lastActivity: "2025-03-14T10:12:00Z"
          },
          {
            id: 6,
            title: "Digital methods for reconstructing fragmented artifacts",
            author: {
              id: 106,
              name: "Elena Petrova",
              avatar: "https://randomuser.me/api/portraits/women/12.jpg",
              role: "Digital Heritage Specialist"
            },
            category: "research",
            content: "I'm working on a project using photogrammetry and 3D modeling to reconstruct fragmented ceramic vessels. I'd like to share our workflow and get feedback from others who have experience with similar...",
            createdAt: "2025-03-08T15:40:00Z",
            commentCount: 19,
            viewCount: 178,
            isPinned: false,
            lastActivity: "2025-03-12T09:30:00Z"
          },
          {
            id: 7,
            title: "Ethical considerations when documenting sacred objects",
            author: {
              id: 107,
              name: "David Yellowhorse",
              avatar: "https://randomuser.me/api/portraits/men/41.jpg",
              role: "Indigenous Rights Advocate"
            },
            category: "general",
            content: "I wanted to start a discussion about the ethical considerations we should keep in mind when documenting sacred or ceremonial objects. This includes issues of access, permission, culturally sensitive information, and...",
            createdAt: "2025-03-07T10:15:00Z",
            commentCount: 31,
            viewCount: 245,
            isPinned: false,
            lastActivity: "2025-03-13T20:45:00Z"
          },
          {
            id: 8,
            title: "Preventive conservation for small community museums",
            author: {
              id: 108,
              name: "Sophia Chen",
              avatar: "https://randomuser.me/api/portraits/women/33.jpg",
              role: "Conservator"
            },
            category: "preservation",
            content: "Many small community museums operate with limited resources but still need to protect their collections. I'd like to share some affordable preventive conservation measures that can make a big difference...",
            createdAt: "2025-03-10T13:20:00Z",
            commentCount: 16,
            viewCount: 184,
            isPinned: false,
            lastActivity: "2025-03-14T08:10:00Z"
          }
        ];
        
        setDiscussions(mockDiscussions);
      } catch (err) {
        console.error('Error fetching discussions:', err);
        setError('Failed to load discussions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDiscussions();
  }, []);
  
  // Format date to relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);
    
    if (diffSeconds < 60) return 'just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };
  
  // Filter discussions
  const filteredDiscussions = discussions
    .filter(discussion => 
      (activeCategory === 'all' || discussion.category === activeCategory) &&
      (searchQuery === '' || 
       discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       discussion.content.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      // Sort pinned first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Then sort by last activity
      return new Date(b.lastActivity) - new Date(a.lastActivity);
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Community Forum</h1>
          <p className="mt-4 max-w-3xl text-xl text-blue-100">
            Connect with fellow cultural heritage enthusiasts, share knowledge, and participate in discussions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with categories and action buttons */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6 sticky top-8">
              {isAuthenticated ? (
                <Link to="/community/new-discussion" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Start New Discussion
                </Link>
              ) : (
                <Link to="/login?redirect=/community" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Sign in to Participate
                </Link>
              )}
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900">Categories</h3>
                <div className="mt-4 space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                        activeCategory === category.id
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900">Community Resources</h3>
                <div className="mt-4 space-y-3">
                  <Link to="/community/guidelines" className="block text-sm text-indigo-600 hover:text-indigo-800">
                    Community Guidelines
                  </Link>
                  <Link to="/community/faq" className="block text-sm text-indigo-600 hover:text-indigo-800">
                    Frequently Asked Questions
                  </Link>
                  <Link to="/community/resources" className="block text-sm text-indigo-600 hover:text-indigo-800">
                    Research Resources
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Search and filter */}
            <div className="mb-6">
              <div className="max-w-lg">
                <label htmlFor="search" className="sr-only">Search discussions</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="search"
                    name="search"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search discussions"
                  />
                </div>
              </div>
            </div>
            
            {/* Discussion list */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" color="indigo" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                <p>{error}</p>
              </div>
            ) : filteredDiscussions.length > 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredDiscussions.map(discussion => (
                    <li key={discussion.id}>
                      <Link to={`/community/discussions/${discussion.id}`} className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {discussion.isPinned && (
                                <span className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                  </svg>
                                </span>
                              )}
                              <p className="text-lg font-medium text-indigo-600 truncate">
                                {discussion.title}
                              </p>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                {categories.find(c => c.id === discussion.category)?.name || discussion.category}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <img
                                  className="h-6 w-6 rounded-full mr-2"
                                  src={discussion.author.avatar}
                                  alt={discussion.author.name}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(discussion.author.name);
                                  }}
                                />
                                {discussion.author.name} • {discussion.author.role}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <span className="mr-4">
                                <svg className="h-4 w-4 text-gray-400 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                {discussion.commentCount} replies
                              </span>
                              <span className="mr-4">
                                <svg className="h-4 w-4 text-gray-400 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {discussion.viewCount} views
                              </span>
                              <span>
                                <svg className="h-4 w-4 text-gray-400 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formatRelativeTime(discussion.lastActivity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center border">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No discussions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery ? 'Try using different keywords or filters.' : 'Be the first to start a discussion in this category!'}
                </p>
                {isAuthenticated && (
                  <div className="mt-6">
                    <Link
                      to="/community/new-discussion"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Start New Discussion
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Community stats */}
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4">
                <div className="px-6 py-5 text-center border-r border-gray-200">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Discussions</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">245</dd>
                </div>
                <div className="px-6 py-5 text-center border-r border-gray-200">
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Members</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">1,253</dd>
                </div>
                <div className="px-6 py-5 text-center border-r border-gray-200">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Comments</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">8,742</dd>
                </div>
                <div className="px-6 py-5 text-center">
                  <dt className="text-sm font-medium text-gray-500 truncate">New This Month</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">142</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
