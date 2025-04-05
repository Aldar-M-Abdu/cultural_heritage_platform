import React, { useState } from 'react';

const ContributorsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Contributors' },
    { id: 'team', name: 'Core Team' },
    { id: 'partners', name: 'Institutional Partners' },
    { id: 'experts', name: 'Subject Matter Experts' },
    { id: 'devs', name: 'Developers' },
    { id: 'volunteers', name: 'Community Volunteers' }
  ];
  
  const contributors = [
    {
      id: 1,
      name: "Dr. Emma Richardson",
      role: "Founder & Director",
      category: "team",
      imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "Dr. Richardson is an archaeologist and digital preservation specialist with over 15 years of experience in cultural heritage documentation. She founded the Cultural Heritage Platform in 2022 to make heritage accessible to everyone.",
      contributions: "Project vision, institutional partnerships, academic outreach",
      links: {
        website: "https://example.com/emmarichardson",
        twitter: "@DrEmmaRich",
        linkedin: "emma-richardson-phd"
      }
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Lead Developer",
      category: "team",
      imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Michael is a full-stack developer with a background in digital humanities. He oversees the technical architecture of the platform and leads our development team.",
      contributions: "Platform architecture, API development, database design",
      links: {
        github: "mchen-dev",
        linkedin: "michael-chen-dev"
      }
    },
    {
      id: 3,
      name: "Sophia Williams",
      role: "UX/UI Designer",
      category: "team",
      imageUrl: "https://randomuser.me/api/portraits/women/33.jpg",
      bio: "Sophia brings her expertise in user experience design to ensure the platform is accessible and intuitive for users of all backgrounds and technical abilities.",
      contributions: "Interface design, accessibility standards, user research",
      links: {
        dribbble: "sophiadesigns",
        linkedin: "sophia-williams-ux"
      }
    },
    {
      id: 4,
      name: "The British Museum",
      role: "Institutional Partner",
      category: "partners",
      imageUrl: "/images/logos/british-museum.png",
      bio: "The British Museum has contributed metadata and digital representations of selected artifacts from their collection, enhancing the platform's educational resources.",
      contributions: "Digital artifacts, metadata standards, educational content",
      links: {
        website: "https://www.britishmuseum.org"
      }
    },
    {
      id: 5,
      name: "National Museum of Anthropology, Mexico",
      role: "Institutional Partner",
      category: "partners",
      imageUrl: "/images/logos/mna-mexico.png",
      bio: "Mexico's National Museum of Anthropology provides invaluable expertise and content related to Mesoamerican cultural heritage.",
      contributions: "Artifact documentation, translation services, regional expertise",
      links: {
        website: "https://www.mna.inah.gob.mx"
      }
    },
    {
      id: 6,
      name: "Dr. Aisha Mahmoud",
      role: "Subject Matter Expert - Islamic Art",
      category: "experts",
      imageUrl: "https://randomuser.me/api/portraits/women/75.jpg",
      bio: "Dr. Mahmoud is an authority on Islamic art and architecture, providing expert knowledge on artifacts from across the Islamic world.",
      contributions: "Content verification, detailed artifact descriptions, thematic collections",
      links: {
        website: "https://example.edu/faculty/amahmoud",
        twitter: "@AishaMahmoudArt"
      }
    },
    {
      id: 7,
      name: "Prof. James Sullivan",
      role: "Subject Matter Expert - Celtic Heritage",
      category: "experts",
      imageUrl: "https://randomuser.me/api/portraits/men/67.jpg",
      bio: "Professor Sullivan specializes in Celtic archaeology and has contributed extensively to documenting and contextualizing Celtic artifacts.",
      contributions: "Expert reviews, historical contextualization, educational resources",
      links: {
        website: "https://celticstudies.example.edu/sullivan"
      }
    },
    {
      id: 8,
      name: "Wei Zhang",
      role: "Full-stack Developer",
      category: "devs",
      imageUrl: "https://randomuser.me/api/portraits/women/79.jpg",
      bio: "Wei developed the interactive mapping features and geospatial database that allows users to explore artifacts by their geographical origins.",
      contributions: "Mapping infrastructure, geospatial search, performance optimization",
      links: {
        github: "weizhang-dev",
        linkedin: "wei-zhang-developer"
      }
    },
    {
      id: 9,
      name: "Carlos Rodriguez",
      role: "Frontend Developer",
      category: "devs",
      imageUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      bio: "Carlos focuses on creating responsive, accessible user interfaces that make complex information easy to navigate and understand.",
      contributions: "Responsive design, accessibility features, interactive components",
      links: {
        github: "carlos-r",
        twitter: "@carlosbuildsUI"
      }
    },
    {
      id: 10,
      name: "Sarah Johnson",
      role: "Community Moderator",
      category: "volunteers",
      imageUrl: "https://randomuser.me/api/portraits/women/22.jpg",
      bio: "Sarah volunteers her time to help maintain community standards and assist new users with navigating the platform.",
      contributions: "Forum moderation, user support, community guidelines",
      links: {
        linkedin: "sarahjohnson-community"
      }
    },
    {
      id: 11,
      name: "Ahmed Hassan",
      role: "Content Contributor",
      category: "volunteers",
      imageUrl: "https://randomuser.me/api/portraits/men/55.jpg",
      bio: "Ahmed has documented and shared dozens of artifacts from North African cultural traditions, significantly expanding the platform's coverage in this region.",
      contributions: "Artifact documentation, translations, regional knowledge",
      links: {
        twitter: "@AhmedCulturalHeritage"
      }
    },
    {
      id: 12,
      name: "Digital Preservation Foundation",
      role: "Funding Partner",
      category: "partners",
      imageUrl: "/images/logos/dpf-logo.png",
      bio: "The Digital Preservation Foundation provided initial grant funding to develop the core platform infrastructure and continues to support ongoing development.",
      contributions: "Financial support, digital preservation expertise, networking",
      links: {
        website: "https://digitalpreservation.example.org"
      }
    }
  ];
  
  // Filter contributors based on active category
  const filteredContributors = activeCategory === 'all'
    ? contributors
    : contributors.filter(contributor => contributor.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-r from-purple-800 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Our Contributors
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-purple-100">
            The Cultural Heritage Platform is made possible through the dedication and expertise of many individuals and organizations. We gratefully acknowledge their contributions.
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category filters */}
        <div className="mb-10 flex justify-center">
          <div className="border-b border-gray-200 w-full">
            <nav className="-mb-px flex space-x-8 overflow-x-auto justify-center">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`
                    whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                    ${activeCategory === category.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Contributors grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 xl:grid-cols-3">
          {filteredContributors.map((contributor) => (
            <div key={contributor.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-shrink-0 h-48 bg-gray-200 relative">
                {contributor.imageUrl.includes('/images/logos/') ? (
                  <div className="absolute inset-0 flex items-center justify-center p-6 bg-white">
                    <div className="text-center text-xl font-medium text-gray-900">{contributor.name}</div>
                  </div>
                ) : (
                  <img
                    className="h-full w-full object-cover"
                    src={contributor.imageUrl}
                    alt={contributor.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contributor.name)}&background=6366f1&color=fff`;
                    }}
                  />
                )}
              </div>
              
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-600">
                    {contributor.role}
                  </p>
                  <div className="mt-2">
                    <h3 className="text-xl font-semibold text-gray-900">{contributor.name}</h3>
                    <p className="mt-3 text-base text-gray-500">{contributor.bio}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="text-sm font-medium text-gray-900">Contributions:</div>
                  <p className="text-sm text-gray-500">{contributor.contributions}</p>
                  
                  {Object.keys(contributor.links).length > 0 && (
                    <div className="mt-4 flex space-x-4">
                      {contributor.links.website && (
                        <a href={contributor.links.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                          <span className="sr-only">Website</span>
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm10 12c0 .685-.07 1.354-.202 2h-3.853c.121-1.283.129-2.717 0-4h3.853c.132.646.202 1.315.202 2zm-.841-4h-3.5c-.383-1.96-1.052-3.751-1.948-5.278 2.435.977 4.397 2.882 5.448 5.278zm-5.554 0h-2.605v-5.658c1.215 1.46 2.117 3.41 2.605 5.658zm-4.605-5.658v5.658h-2.605c.488-2.248 1.39-4.198 2.605-5.658zm0 7.658v4h-2.93c-.146-1.421-.146-2.577 0-4h2.93zm0 6v5.658c-1.215-1.46-2.117-3.41-2.605-5.658h2.605zm2 5.658v-5.658h2.605c-.488 2.248-1.39 4.198-2.605 5.658zm0-7.658v-4h2.93c.146 1.421.146 2.577 0 4h-2.93zm-4.711-11.278c-.896 1.527-1.565 3.318-1.948 5.278h-3.5c1.051-2.396 3.013-4.301 5.448-5.278zm-6.087 7.278h3.853c-.121 1.283-.129 2.717 0 4h-3.853c-.132-.646-.202-1.315-.202-2s.07-1.354.202-2zm.639 6h3.5c.383 1.96 1.052 3.751 1.948 5.278-2.435-.977-4.397-2.882-5.448-5.278zm12.87 5.278c.896-1.527 1.565-3.318 1.948-5.278h3.5c-1.051 2.396-3.013 4.301-5.448 5.278z" />
                          </svg>
                        </a>
                      )}
                      
                      {contributor.links.github && (
                        <a href={`https://github.com/${contributor.links.github}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                          <span className="sr-only">GitHub</span>
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                      
                      {contributor.links.twitter && (
                        <a href={`https://twitter.com/${contributor.links.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                          <span className="sr-only">Twitter</span>
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </a>
                      )}
                      
                      {contributor.links.linkedin && (
                        <a href={`https://linkedin.com/in/${contributor.links.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                          <span className="sr-only">LinkedIn</span>
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      )}
                      
                      {contributor.links.dribbble && (
                        <a href={`https://dribbble.com/${contributor.links.dribbble}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                          <span className="sr-only">Dribbble</span>
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredContributors.length === 0 && (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No contributors found in this category</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try selecting a different category or view all contributors.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setActiveCategory('all')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View All Contributors
              </button>
            </div>
          </div>
        )}
        
        {/* Call to action */}
        <div className="mt-16 bg-indigo-50 rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">Want to Contribute?</h2>
          <p className="text-indigo-600 max-w-2xl mx-auto">
            We welcome contributions from individuals and organizations who share our passion for preserving cultural heritage. There are many ways to get involved!
          </p>
          <div className="mt-6">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Get Involved
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorsPage;
