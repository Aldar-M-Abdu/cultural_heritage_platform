import React from 'react';
import { Link } from 'react-router-dom';

const CulturalItemCard = ({ item }) => {
  // Placeholder image if item image is not available
  const defaultImage = '/placeholder-artifact.jpg';
  
  return (
    <Link 
      to={`/cultural_items/${item.id}`} 
      className="block h-full transition-all hover:-translate-y-1 duration-200"
    >
      <div className="bg-white rounded-lg shadow overflow-hidden h-full border border-gray-100 hover:shadow-lg">
        {/* Item Image */}
        <div className="aspect-w-16 aspect-h-10 relative overflow-hidden">
          <img
            src={item.image_url || defaultImage}
            alt={item.title}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = defaultImage;
            }}
          />
          <div className="absolute top-0 right-0 mt-2 mr-2">
            <span className="px-2 py-1 text-xs font-medium rounded bg-amber-100 text-amber-800">
              {item.region}
            </span>
          </div>
        </div>
        
        {/* Item Details */}
        <div className="p-4 flex flex-col h-full">
          <h3 className="font-bold text-gray-900 mb-1 text-lg">{item.title}</h3>
          <p className="text-sm text-amber-700 mb-2">{item.time_period}</p>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
            {item.description}
          </p>
          
          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {item.tags.slice(0, 3).map(tag => (
                <span 
                  key={tag.id || tag.name} 
                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
                  +{item.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CulturalItemCard;