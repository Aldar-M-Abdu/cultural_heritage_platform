import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ItemSearchBar = ({ className, placeholder = "Search artifacts...", onSearch, initialValue = "" }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (onSearch) {
      // If a custom search handler is provided, call it
      onSearch(searchTerm);
    } else {
      // Otherwise navigate to the items page with search query parameter
      navigate({
        pathname: '/items',
        search: searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '',
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative ${className}`}
    >
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-100 text-gray-700 rounded-full pl-5 pr-12 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 bg-white rounded-full p-1 shadow"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
      </button>
    </form>
  );
};

export default ItemSearchBar;
