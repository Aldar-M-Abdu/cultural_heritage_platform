import React from 'react';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Importance of Preserving Cultural Heritage",
      date: "March 15, 2025",
      excerpt: "Cultural heritage connects us to our past and shapes our identity. Learn why preservation is vital for future generations.",
      author: "Jane Doe",
    },
    {
      id: 2,
      title: "Digital Tools for Cultural Preservation",
      date: "February 28, 2025",
      excerpt: "Explore how technology is revolutionizing the way we document and share cultural artifacts.",
      author: "John Smith",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
            <p className="text-sm text-gray-500">{post.date} • {post.author}</p>
            <p className="mt-4 text-gray-600">{post.excerpt}</p>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 mt-4 block">Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
