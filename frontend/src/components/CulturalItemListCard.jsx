import React from 'react';
import { Link } from 'react-router-dom';

const CulturalItemListCard = ({ item, isFavorite, onToggleFavorite }) => {
  // Placeholder image if item image is not available
  const defaultImage = '/placeholder-artifact.jpg';
  
  return (
    <Link to={`/items/${item.id}`} className="block hover:shadow-md transition-shadow">
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        {/* Item Image - takes up 1/4 of the card on medium screens and up */}
        <div className="md:w-1/4 relative">
          <div className="aspect-w-16 aspect-h-12 md:h-full">
            <img
              src={item.image_url || defaultImage}
              alt={item.title}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = defaultImage;
              }}
            />
          </div>
          <div className="absolute top-0 right-0 mt-2 mr-2">
            <span className="px-2 py-1 text-xs font-medium rounded bg-amber-100 text-amber-800">
              {item.region}
            </span>
          </div>
          
          {/* Favorite indicator in top left */}
          {isFavorite !== undefined && (
            <div 
              className="absolute top-0 left-0 mt-2 ml-2" 
              onClick={(e) => {
                e.preventDefault();
                if (onToggleFavorite) onToggleFavorite(item.id);
              }}
            >
              <span className={`p-1.5 rounded-full ${isFavorite ? 'bg-amber-500' : 'bg-gray-200 hover:bg-gray-300'}`}>
                <svg className={`w-4 h-4 ${isFavorite ? 'text-white' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            </div>
          )}
        </div>
        
        {/* Item Details - takes up 3/4 of the card on medium screens and up */}
        <div className="p-4 md:w-3/4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
              <span className="text-sm text-amber-700">{item.time_period}</span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {item.description}
            </p>
          </div>
          
          {/* Tags and metadata footer */}
          <div className="flex justify-between items-center">
            {item.tags && item.tags.length > 0 ? (
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
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>
            ) : (
              <div></div> /* Empty div to maintain layout with flex-between */
            )}
            
            <div className="text-xs text-gray-500 flex items-center">
              <span className="mr-4 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown date'}
              </span>
              <span className="flex items-center" title={`${item.view_count || 0} views`}>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {item.view_count >= 1000 ? `${(item.view_count / 1000).toFixed(1)}k` : item.view_count || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CulturalItemListCard;