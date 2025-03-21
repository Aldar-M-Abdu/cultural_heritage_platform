import React from 'react';


const CulturalItemCard = ({ item }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 h-full border border-gray-100">
      <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
        <img
          src={item.image_url}
          alt={item.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-0 right-0 m-2">
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
            {item.time_period.split('(')[0].trim()}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col h-44">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors mb-1 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-sm text-amber-700 mb-2">{item.region}</p>
        <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-3">{item.description}</p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
            >
              {tag.name}
            </span>
          ))}
          {item.tags.length > 2 && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
              +{item.tags.length - 2} more
            </span>
          )}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="px-4 py-2 bg-amber-700 text-white rounded-md text-sm font-medium transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          View Details
        </span>
      </div>
    </div>
  );
};



export default CulturalItemCard;