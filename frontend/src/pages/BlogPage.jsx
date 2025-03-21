import React, { useState } from 'react';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'preservation', name: 'Preservation' },
    { id: 'technology', name: 'Technology' },
    { id: 'education', name: 'Education' }
  ];
  
  const blogPosts = [
    {
      id: 1,
      title: "The Importance of Preserving Cultural Heritage",
      date: "March 15, 2025",
      excerpt: "Cultural heritage connects us to our past and shapes our identity. Learn why preservation is vital for future generations and how communities can get involved in local preservation efforts.",
      author: "Jane Doe",
      authorRole: "Cultural Preservation Specialist",
      authorImage: "/api/placeholder/40/40",
      category: "preservation",
      readTime: "5 min read",
      image: "/api/placeholder/800/450"
    },
    {
      id: 2,
      title: "Digital Tools for Cultural Preservation",
      date: "February 28, 2025",
      excerpt: "Explore how technology is revolutionizing the way we document and share cultural artifacts. From 3D scanning to immersive VR experiences, discover the cutting-edge tools transforming preservation efforts.",
      author: "John Smith",
      authorRole: "Digital Archivist",
      authorImage: "/api/placeholder/40/40",
      category: "technology",
      readTime: "7 min read",
      image: "/api/placeholder/800/450"
    },
    {
      id: 3,
      title: "Educating Future Generations About Cultural Heritage",
      date: "February 14, 2025",
      excerpt: "How can we engage young people in cultural heritage preservation? This article explores innovative educational approaches that are inspiring the next generation of preservationists.",
      author: "Maria Rodriguez",
      authorRole: "Education Director",
      authorImage: "/api/placeholder/40/40",
      category: "education",
      readTime: "6 min read",
      image: "/api/placeholder/800/450"
    },
    {
      id: 4,
      title: "Indigenous Knowledge Systems and Digital Preservation",
      date: "January 30, 2025",
      excerpt: "Examining the ethical considerations and best practices for digitizing and preserving indigenous knowledge while respecting cultural protocols and ownership.",
      author: "David Yellowhorse",
      authorRole: "Indigenous Rights Advocate",
      authorImage: "/api/placeholder/40/40",
      category: "preservation",
      readTime: "8 min read",
      image: "/api/placeholder/800/450"
    },
  ];
  
  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="relative bg-indigo-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-blue-900 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Our Blog</h1>
          <p className="mt-6 max-w-3xl text-xl">
            Insights, stories, and perspectives on cultural heritage preservation from our experts and collaborators.
          </p>
        </div>
      </div>
      
      {/* Category tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Categories">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                  ${selectedCategory === category.id 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Featured post */}
      {selectedCategory === 'all' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative rounded-xl overflow-hidden shadow-xl">
            <img 
              src="/api/placeholder/1200/500" 
              alt="Featured post" 
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black opacity-70"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">Featured</span>
              <h2 className="mt-4 text-3xl font-bold text-white">Emerging Trends in Cultural Heritage Conservation</h2>
              <p className="mt-2 text-gray-200 max-w-2xl">
                A comprehensive look at innovative approaches and technologies shaping the future of preservation efforts worldwide.
              </p>
              <div className="mt-4 flex items-center">
                <img className="h-10 w-10 rounded-full mr-3" src="/api/placeholder/40/40" alt="Author" />
                <div>
                  <p className="text-white font-medium">Robert Chen</p>
                  <p className="text-gray-300 text-sm">March 5, 2025 • 12 min read</p>
                </div>
              </div>
              <button className="mt-6 inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Read Article
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Blog post grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <div className="relative h-48">
                <img className="w-full h-full object-cover" src={post.image} alt={post.title} />
                <div className="absolute top-0 right-0 mt-4 mr-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-indigo-700">
                    {categories.find(cat => cat.id === post.category)?.name}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-grow">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
              </div>
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full mr-3" src={post.authorImage} alt={post.author} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.author}</p>
                      <p className="text-xs text-gray-500">{post.authorRole}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {post.date} • {post.readTime}
                  </div>
                </div>
                <a 
                  href="#" 
                  className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Read Full Article
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {/* Newsletter subscription */}
        <div className="mt-16 bg-indigo-700 rounded-2xl shadow-xl">
          <div className="px-6 py-10 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Stay updated with our latest articles
              </h2>
              <p className="mt-4 max-w-3xl text-indigo-100">
                Join our newsletter to receive monthly updates on the latest research, events, and resources in cultural preservation.
              </p>
            </div>
            <div className="mt-6 lg:mt-0 lg:ml-8">
              <form className="sm:flex">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border-white focus:ring-offset-indigo-700 focus:ring-white border-2 placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:max-w-xs"
                  placeholder="Enter your email"
                />
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
              <p className="mt-3 text-sm text-indigo-100">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;