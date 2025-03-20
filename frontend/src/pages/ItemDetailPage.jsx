import React from 'react';
import { Link } from 'react-router-dom';

const ItemDetailPage = () => {
  // In a real app, this would come from an API or context
  const item = {
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
  };

  return (
    <div className="item-detail-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb navigation */}
      <nav className="flex text-gray-500 text-sm mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-gray-700 hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/items" className="hover:text-gray-700 hover:underline">Items</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-medium" aria-current="page">{item.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Item gallery */}
        <div className="item-gallery">
          <img 
            src={item.image} 
            alt={`${item.name}`} 
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Item description */}
        <div className="item-description">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.name}</h1>
          <p className="text-gray-600 mb-6">{item.description}</p>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Item Details</h2>
          <ul className="space-y-2 text-gray-700">
            {item.details.map((detail, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Related items section */}
      <div className="related-items">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Related Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {item.relatedItems.map(relatedItem => (
            <Link 
              to={`/items/${relatedItem.id}`} 
              key={relatedItem.id}
              className="group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden">
                <img 
                  src={relatedItem.image} 
                  alt={`${relatedItem.name}`} 
                  className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{relatedItem.name}</h3>
                <p className="mt-1 text-gray-600 text-sm">{relatedItem.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;