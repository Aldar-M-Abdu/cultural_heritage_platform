import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const itemsData = [
  {
    id: 1,
    name: "Viking Age Silver Necklace",
    description: "Intricately designed silver necklace featuring traditional Norse patterns and dragon motifs. Found in a burial site near Stockholm.",
    details: [
      "Origin: Scandinavia",
      "Time Period: Viking Age (793-1066 CE)",
      "Materials: Silver, precious stones"
    ],
    image: "/public/Viking Age Silver Necklace.jpg",
    relatedItems: [
      { id: 2, name: "Ancient Greek Amphora", description: "Red-figure amphora depicting scenes from the Trojan War.", image: "/public/Ancient Greek Amphora.jpg" },
      { id: 3, name: "Maya Jade Death Mask", description: "Ceremonial death mask made of jade mosaic pieces.", image: "/public/Maya Jade Death Mask.jpg" },
      { id: 4, name: "Tang Dynasty Bronze Mirror", description: "Bronze mirror with intricate floral patterns.", image: "/public/tang_bronze_mirror.jpg" }
    ]
  },
  // ...other items...
];

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const selectedItem = itemsData.find((item) => item.id === parseInt(id, 10));
    setItem(selectedItem);
    setActiveImage(selectedItem?.image || null);
  }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Item not found.</p>
      </div>
    );
  }

  const thumbnails = [
    item.image,
    "/public/Viking Age Silver Necklace_detail1.jpg",
    "/public/Viking Age Silver Necklace_detail2.jpg",
  ];

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero banner with subtle pattern background */}
      <div className="bg-[url('/public/pattern-bg.png')] from-blue-50 to-blue-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">{item.name}</h1>
          
          {/* Breadcrumb navigation */}
          <nav className="flex text-amber-200 text-sm mb-2" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/items" className="hover:text-white transition-colors">Collection</Link>
            <span className="mx-2">/</span>
            <span className="text-white font-medium" aria-current="page">{item.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Item gallery with thumbnails */}
          <div className="item-gallery space-y-4">
            <div className="relative aspect-w-4 aspect-h-3 bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={activeImage} 
                alt={`${item.name}`} 
                className="w-full h-full object-contain"
              />
              
              <button className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </div>
            
            {/* Thumbnail gallery */}
            <div className="flex space-x-3">
              {thumbnails.map((thumb, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(thumb)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${activeImage === thumb ? 'border-amber-600 shadow-md' : 'border-transparent hover:border-amber-300'}`}
                >
                  <img src={thumb} alt={`${item.name} view ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            {/* 3D View button - for future implementation */}
            <button className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg shadow-sm flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
              View in 3D
            </button>
          </div>

          {/* Item description */}
          <div className="item-description">
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">{item.description}</p>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-600 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  Artifact Details
                </h2>
                <ul className="space-y-3">
                  {item.details.map((detail, index) => (
                    <li key={index} className="flex items-start border-b border-gray-100 pb-3 last:border-0">
                      <span className="text-amber-600 mr-3">•</span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Additional sections */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-600 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Historical Context
                  </h2>
                  <p className="text-gray-600">Viking jewelry was not only decorative but also served as a form of currency and status symbol. Craftsmen used silver obtained through trade and raids to create intricate pieces that showcased their skill and artistry.</p>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-600 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                    Archaeological Significance
                  </h2>
                  <p className="text-gray-600">Discovered in a burial site near Stockholm, this necklace provides valuable insights into Viking craftsmanship, trade networks, and burial practices of the Norse elite.</p>
                </div>
              </div>
            </div>
            
            {/* Actions section */}
            <div className="flex flex-wrap gap-4">
              <button className="flex-1 py-3 px-6 bg-amber-700 hover:bg-amber-800 text-white rounded-lg shadow-md transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                Share
              </button>
              <button className="flex-1 py-3 px-6 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg shadow-sm transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
                Save to Collection
              </button>
            </div>
          </div>
        </div>

        {/* Related items section with improved cards */}
        <div className="related-items">
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Related Artifacts</h2>
          <p className="text-gray-600 mb-8">Discover artifacts with similar origins or time periods</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {item.relatedItems.map(relatedItem => (
              <Link 
                to={`/items/${relatedItem.id}`} 
                key={relatedItem.id}
                className="group block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg border border-gray-100"
              >
                <div className="relative aspect-w-3 aspect-h-2 w-full overflow-hidden bg-gray-200">
                  <img 
                    src={relatedItem.image} 
                    alt={`${relatedItem.name}`} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <span className="text-sm font-medium">View details</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors">{relatedItem.name}</h3>
                  <p className="mt-2 text-gray-600 text-sm line-clamp-2">{relatedItem.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer with artifact citation */}
      <div className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-sm text-gray-500">
            <h3 className="font-medium text-gray-700 mb-2">Citation</h3>
            <p>"Viking Age Silver Necklace." Global Cultural Heritage Collection, Accessed {new Date().toLocaleDateString()}.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;