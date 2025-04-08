import React from 'react';
import { Link } from 'react-router-dom';

const CulturalItemCard = ({ item }) => {
  // Placeholder image if item image is not available
  const defaultImage = '/placeholder-artifact.jpg';
  
  return (
    <Link 
      to={`/items/${item.id}`} 
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
          
          {/* Footer with tags and view count */}
          <div className="flex flex-col gap-2 mt-auto">
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
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
            
            {/* View count */}
            <div className="text-xs text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {item.view_count || 0} views
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CulturalItemCard;