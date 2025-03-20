import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CulturalItemCard from '../components/CulturalItemCard';

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

  // Filter items based on search and filter criteria
  useEffect(() => {
    let filtered = [...itemsData];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.region.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term)
      );
    }
    
    // Apply region filter
    if (selectedRegion) {
      filtered = filtered.filter(item => item.region === selectedRegion);
    }
    
    // Apply time period filter
    if (selectedTimePeriod) {
      filtered = filtered.filter(item => item.time_period === selectedTimePeriod);
    }
    
    // Apply tag filter
    if (selectedTag) {
      filtered = filtered.filter(item => 
        item.tags.some(tag => tag.name === selectedTag)
      );
    }
    
    setFilteredItems(filtered);
  }, [searchTerm, selectedRegion, selectedTimePeriod, selectedTag]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Search logic is handled by the useEffect
  };

  return (
    <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cultural Heritage Collection</h1>
        <p className="mt-2 text-lg text-gray-600">
          Explore our collection of cultural artifacts from around the world
        </p>
      </div>
      
      {/* Filters Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, region, materials..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button type="submit" className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
          
          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Region Filter */}
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <select
                id="region"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
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
              <label htmlFor="timePeriod" className="block text-sm font-medium text-gray-700 mb-1">
                Time Period
              </label>
              <select
                id="timePeriod"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
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
              <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
                Tag
              </label>
              <select
                id="tag"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">All Tags</option>
                {popularTags.map((tag) => (
                  <option key={tag.id} value={tag.name}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Section */}
      <div>
        {filteredItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No items match your search criteria.</p>
            <button 
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              onClick={() => {
                setSearchTerm('');
                setSelectedRegion('');
                setSelectedTimePeriod('');
                setSelectedTag('');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-600">{filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found</p>
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {filteredItems.map((item) => (
                <Link to={`/items/${item.id}`} key={item.id} className="group">
                  <CulturalItemCard item={item} />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ItemsListPage;