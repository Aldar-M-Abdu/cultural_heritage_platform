import React from 'react';

const CulturalItemCard = ({ item }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {item.image_url && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 text-gray-900">{item.title}</h3>
        
        {item.region && item.time_period && (
          <p className="text-sm text-gray-600 mb-2">
            {item.region} • {item.time_period}
          </p>
        )}
        
        {item.description && (
          <p className="text-gray-700 mb-3 line-clamp-3">{item.description}</p>
        )}
        
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags && item.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag.name}
            </span>
          ))}
        </div>
        
        <a
          href={`/items/${item.id}`}
          className="text-primary-600 hover:text-primary-800 font-medium text-sm inline-flex items-center"
        >
          View Details
          <svg
            className="ml-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default CulturalItemCard;