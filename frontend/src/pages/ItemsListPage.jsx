import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CulturalItemCard from '../components/CulturalItemCard';
import CulturalItemListCard from '../components/CulturalItemListCard';
// In a real app, this would come from an API
const itemsData = [
  {
    id: 1,
    title: "Viking Age Silver Necklace",
    region: "Scandinavia",
    time_period: "Viking Age (793-1066 CE)",
    description: "Intricately designed silver necklace featuring traditional Norse patterns and dragon motifs. Found in a burial site near Stockholm.",
    image_url: "/public/Viking Age Silver Necklace.jpg",
    tags: [{ id: 1, name: "Jewelry" }, { id: 2, name: "Viking" }, { id: 3, name: "Metal work" }]
  },
  {
    id: 2,
    title: "Ancient Greek Amphora",
    region: "Greece",
    time_period: "Classical Period (480-323 BCE)",
    description: "Red-figure amphora depicting scenes from the Trojan War. Well-preserved example of ancient Greek pottery.",
    image_url: "/public/Ancient Greek Amphora.jpg",
    tags: [{ id: 4, name: "Pottery" }, { id: 5, name: "Ancient Greece" }]
  },
  {
    id: 3,
    title: "Maya Jade Death Mask",
    region: "Mesoamerica",
    time_period: "Classic Maya Period (250-900 CE)",
    description: "Ceremonial death mask made of jade mosaic pieces, likely belonging to a Maya ruler.",
    image_url: "/public/Maya Jade Death Mask.jpg",
    tags: [{ id: 6, name: "Ceremonial" }, { id: 7, name: "Maya" }, { id: 8, name: "Jade" }]
  },
  {
    id: 4,
    title: "Tang Dynasty Bronze Mirror",
    region: "China",
    time_period: "Tang Dynasty (618-907 CE)",
    description: "Bronze mirror with intricate floral patterns and Buddhist symbols, showing the artistic sophistication of Tang Dynasty craftsmanship.",
    image_url: "/public/tang_bronze_mirror.jpg",
    tags: [{ id: 9, name: "Bronze" }, { id: 10, name: "Tang Dynasty" }]
  },
  {
    id: 5,
    title: "Medieval Illuminated Manuscript",
    region: "Western Europe",
    time_period: "High Middle Ages (1000-1250 CE)",
    description: "Richly decorated religious manuscript with gold leaf illumination and detailed miniature paintings.",
    image_url: "/public/Medieval Illuminated Manuscript.jpg",
    tags: [{ id: 11, name: "Manuscript" }, { id: 12, name: "Medieval" }, { id: 13, name: "Religious" }]
  },
  {
    id: 6,
    title: "Persian Ceramic Bowl",
    region: "Persia",
    time_period: "Safavid Dynasty (1501-1736 CE)",
    description: "Ceramic bowl featuring intricate Islamic calligraphy and floral patterns in cobalt blue glaze.",
    image_url: "/public/Persian Ceramic Bowl.jpg",
    tags: [{ id: 14, name: "Ceramics" }, { id: 15, name: "Islamic Art" }]
  }
];

const regions = [
  "Scandinavia",
  "Greece",
  "Mesoamerica",
  "China",
  "Western Europe",
  "Persia",
  "Egypt",
  "Rome",
  "India",
  "Japan"
];

const timePeriods = [
  "Stone Age (before 3300 BCE)",
  "Bronze Age (3300-1200 BCE)",
  "Iron Age (1200-550 BCE)",
  "Classical Period (480-323 BCE)",
  "Roman Period (27 BCE-476 CE)",
  "Viking Age (793-1066 CE)",
  "Middle Ages (476-1453 CE)",
  "Renaissance (1300-1600 CE)",
  "Early Modern Period (1500-1800 CE)",
  "Modern Era (1800 CE-Present)"
];

const popularTags = [
  { id: 1, name: "Jewelry" },
  { id: 2, name: "Viking" },
  { id: 4, name: "Pottery" },
  { id: 6, name: "Ceremonial" },
  { id: 9, name: "Bronze" },
  { id: 11, name: "Manuscript" },
  { id: 14, name: "Ceramics" },
  { id: 15, name: "Islamic Art" },
  { id: 16, name: "Weapons" },
  { id: 17, name: "Tools" }
];

const ItemsListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [filteredItems, setFilteredItems] = useState(itemsData);
  const [activeFilters, setActiveFilters] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isLoading, setIsLoading] = useState(false);

  // Filter items based on search and filter criteria
  useEffect(() => {
    let filtered = [...itemsData];
    let filterCount = 0;
    
    setIsLoading(true);
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.region.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term)
      );
      filterCount++;
    }
    
    // Apply region filter
    if (selectedRegion) {
      filtered = filtered.filter(item => item.region === selectedRegion);
      filterCount++;
    }
    
    // Apply time period filter
    if (selectedTimePeriod) {
      filtered = filtered.filter(item => item.time_period === selectedTimePeriod);
      filterCount++;
    }
    
    // Apply tag filter
    if (selectedTag) {
      filtered = filtered.filter(item => 
        item.tags.some(tag => tag.name === selectedTag)
      );
      filterCount++;
    }
    
    // Simulate API delay
    setTimeout(() => {
      setFilteredItems(filtered);
      setActiveFilters(filterCount);
      setIsLoading(false);
    }, 300);
    
  }, [searchTerm, selectedRegion, selectedTimePeriod, selectedTag]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Search logic is handled by the useEffect
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRegion('');
    setSelectedTimePeriod('');
    setSelectedTag('');
  };

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero banner with background image */}
      <div className="relative bg-amber-900 text-white">
        <div className="absolute inset-0 bg-[url('/public/museum-bg.jpg')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4">Cultural Heritage Collection</h1>
          <p className="max-w-3xl text-lg sm:text-xl text-amber-100">
            Explore our curated collection of cultural artifacts spanning millennia of human history and creativity
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Section */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden mb-10 border border-gray-100">
          <div className="p-6 md:p-8">
            {/* Search Bar */}
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by name, region, materials..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            
            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Region Filter */}
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                  Origin Region
                </label>
                <select
                  id="region"
                  className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-lg bg-gray-50"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="">All Regions</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Time Period Filter */}
              <div>
                <label htmlFor="timePeriod" className="block text-sm font-medium text-gray-700 mb-2">
                  Historical Period
                </label>
                <select
                  id="timePeriod"
                  className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-lg bg-gray-50"
                  value={selectedTimePeriod}
                  onChange={(e) => setSelectedTimePeriod(e.target.value)}
                >
                  <option value="">All Time Periods</option>
                  {timePeriods.map((period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Tag Filter */}
              <div>
                <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-2">
                  Artifact Category
                </label>
                <select
                  id="tag"
                  className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-lg bg-gray-50"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {popularTags.map((tag) => (
                    <option key={tag.id} value={tag.name}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Active filters */}
            {activeFilters > 0 && (
              <div className="mt-6 flex items-center">
                <span className="text-sm text-gray-500 mr-3">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedRegion && (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                      Region: {selectedRegion}
                      <button
                        type="button"
                        className="ml-1.5 inline-flex items-center justify-center rounded-full text-amber-800 hover:bg-amber-200"
                        onClick={() => setSelectedRegion('')}
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  )}
                  
                  {selectedTimePeriod && (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                      Period: {selectedTimePeriod.split('(')[0].trim()}
                      <button
                        type="button"
                        className="ml-1.5 inline-flex items-center justify-center rounded-full text-amber-800 hover:bg-amber-200"
                        onClick={() => setSelectedTimePeriod('')}
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  )}
                  
                  {selectedTag && (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                      Category: {selectedTag}
                      <button
                        type="button"
                        className="ml-1.5 inline-flex items-center justify-center rounded-full text-amber-800 hover:bg-amber-200"
                        onClick={() => setSelectedTag('')}
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  )}
                  
                  {searchTerm && (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                      Search: "{searchTerm}"
                      <button
                        type="button"
                        className="ml-1.5 inline-flex items-center justify-center rounded-full text-amber-800 hover:bg-amber-200"
                        onClick={() => setSearchTerm('')}
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  )}
                  
                  <button
                    type="button"
                    className="text-sm text-amber-700 hover:text-amber-900 font-medium ml-2"
                    onClick={clearFilters}
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLoading ? 'Loading artifacts...' : 
                filteredItems.length === 0 ? 'No artifacts found' :
                filteredItems.length === 1 ? '1 artifact found' :
                `${filteredItems.length} artifacts found`}
            </h2>
            {activeFilters > 0 && (
              <p className="text-gray-500">Filtered by {activeFilters} criteria</p>
            )}
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center mt-4 sm:mt-0">
            <span className="text-sm text-gray-500 mr-3">View:</span>
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  viewMode === 'grid'
                    ? 'bg-amber-700 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
                onClick={() => setViewMode('grid')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  viewMode === 'list'
                    ? 'bg-amber-700 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
                onClick={() => setViewMode('list')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Items Grid/List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-700"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="h-16 w-16 text-amber-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No artifacts found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria or clearing some filters</p>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              onClick={clearFilters}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Link to={`/items/${item.id}`} key={item.id} className="block h-full">
                  <CulturalItemCard item={item} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredItems.map((item) => (
                <CulturalItemListCard key={item.id} item={item} />
              ))}
            </div>
          )
        )}
        
        {/* Pagination - Basic example */}
        {filteredItems.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <a href="#" className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-amber-700 text-sm font-medium text-white">
                1
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                2
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                3
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </a>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemsListPage;