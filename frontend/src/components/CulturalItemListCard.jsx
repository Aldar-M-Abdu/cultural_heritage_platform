import React from 'react';
import { Link } from 'react-router-dom';


const CulturalItemListCard = ({ item }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 h-48 overflow-hidden bg-gray-200">
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
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-amber-700 mb-2">{item.region}</p>
            </div>
            <div className="hidden sm:block">
              <Link to={`/items/${item.id}`} className="text-amber-700 hover:text-amber-900 font-medium text-sm">
                View Details →
              </Link>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4 flex-grow">{item.description}</p>
          <div className="flex flex-wrap gap-1 mt-auto">
            {item.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default CulturalItemListCard;