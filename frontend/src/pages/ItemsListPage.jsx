import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CulturalItemCard from '../components/CulturalItemCard';
import CulturalItemListCard from '../components/CulturalItemListCard';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ItemSearchBar from '../components/ItemSearchBar';
import { API_BASE_URL } from '../config';
import useAuthStore from '../stores/authStore';

// Sample data for filters - replace with API data when available
const regions = ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'];
const timePeriods = ['Ancient (Before 500 CE)', 'Medieval (500-1500 CE)', 'Early Modern (1500-1800 CE)', 'Modern (1800-present)'];
const popularTags = [
  { id: 1, name: 'Pottery' },
  { id: 2, name: 'Sculpture' },
  { id: 3, name: 'Painting' },
  { id: 4, name: 'Jewelry' },
  { id: 5, name: 'Weaponry' },
  { id: 6, name: 'Clothing' }
];

// Fallback data to use when API is unavailable
const fallbackItems = [
  {
    id: 1,
    title: "Ancient Greek Amphora",
    region: "Greece",
    time_period: "Classical Period (480-323 BCE)",
    description: "Decorated ceramic vessel used for the transport and storage of wine, olive oil and other goods.",
    image_url: "https://images.unsplash.com/photo-1603966187872-3a0f12839769?auto=format&fit=crop&q=80",
    tags: [{ id: 1, name: "Pottery" }, { id: 2, name: "Greek" }]
  },
  {
    id: 2,
    title: "Viking Silver Bracelet",
    region: "Scandinavia",
    time_period: "Viking Age (793-1066 CE)",
    description: "Intricately twisted silver arm ring with animal head terminals, used as both adornment and currency.",
    image_url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80",
    tags: [{ id: 3, name: "Jewelry" }, { id: 4, name: "Viking" }]
  },
  {
    id: 3,
    title: "Mayan Jade Mask",
    region: "Mesoamerica",
    time_period: "Late Classic Period (600-900 CE)",
    description: "Ceremonial mask carved from jade, representing the Mayan death god.",
    image_url: "https://images.unsplash.com/photo-1590687755451-3c8552186068?auto=format&fit=crop&q=80",
    tags: [{ id: 5, name: "Mask" }, { id: 6, name: "Mayan" }]
  }
];

const ItemsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || '');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(searchParams.get('period') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilters, setActiveFilters] = useState(0);
  const [viewMode, setViewMode] = useState(localStorage.getItem('itemsViewMode') || 'grid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(12);

  // Update the URL with filters and pagination
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedRegion) params.set('region', selectedRegion);
    if (selectedTimePeriod) params.set('period', selectedTimePeriod);
    if (selectedTag) params.set('tag', selectedTag);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [searchTerm, selectedRegion, selectedTimePeriod, selectedTag, currentPage, setSearchParams]);

  // Save view mode preference
  useEffect(() => {
    localStorage.setItem('itemsViewMode', viewMode);
  }, [viewMode]);

  // Fetch items from database when component mounts or filters change
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        let endpoint = '/api/v1/cultural-items';
        let params = {
          page: currentPage,
          limit: itemsPerPage,
          sort_by: "created_at"
        };
        
        // Build query parameters based on filters
        if (searchTerm) {
          endpoint = '/api/v1/cultural-items/search';
          params.query = searchTerm;
        }
        
        if (selectedRegion) {
          params.region = selectedRegion;
        }
        
        if (selectedTimePeriod) {
          params.time_period = selectedTimePeriod;
        }
        
        if (selectedTag) {
          params.tag = selectedTag;
        }
        
        // Create URLSearchParams object from the params
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            queryParams.append(key, value);
          }
        });
        
        // Create promise for fetching items with timeout
        const fetchPromise = fetch(`${API_BASE_URL}${endpoint}?${queryParams.toString()}`, { 
          signal: AbortSignal.timeout(8000), // 8 second timeout
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch items: ${response.status}`);
          }
          return response.json();
        })
        .catch(err => {
          console.error('First endpoint fetch error:', err);
          
          // Try alternate endpoint if the first one fails
          return fetch(`${API_BASE_URL}/cultural-items?${queryParams.toString()}`, {
            signal: AbortSignal.timeout(5000)
          })
          .then(altResponse => {
            if (!altResponse.ok) throw new Error('Failed to fetch items from alternate endpoint');
            return altResponse.json();
          })
          .catch(altErr => {
            console.error('Alternate endpoint fetch error:', altErr);
            throw new Error('All endpoints failed');
          });
        });

        // Wait for fetch to complete
        let responseData;
        try {
          responseData = await fetchPromise;
        } catch (err) {
          console.error('All fetch attempts failed:', err);
          throw err;
        }
        
        // Process API response
        if (responseData) {
          // Check if the response is already an array
          if (Array.isArray(responseData)) {
            setItems(responseData);
            setFilteredItems(responseData);
            setTotalPages(Math.ceil(responseData.length / itemsPerPage));
          } 
          // If API returns object with items array and pagination info
          else if (responseData.items && Array.isArray(responseData.items)) {
            setItems(responseData.items);
            setFilteredItems(responseData.items);
            setTotalPages(Math.ceil(responseData.items.length / itemsPerPage));
          }
          // Other cases - try to extract data
          else {
            const extractedItems = responseData.data || responseData.results || [];
            setItems(extractedItems);
            setFilteredItems(extractedItems);
            setTotalPages(Math.ceil(extractedItems.length / itemsPerPage));
          }
          
          setActiveFilters(
            [searchTerm, selectedRegion, selectedTimePeriod, selectedTag].filter(Boolean).length
          );
          setError(null);
        } else {
          throw new Error('No data received from API');
        }
      } catch (err) {
        console.error('Failed to fetch items:', err);
        
        // Use fallback data but notify user
        console.warn("Using fallback data");
        
        // Filter fallback data based on selected filters
        let filtered = [...fallbackItems];
        
        if (selectedRegion) {
          filtered = filtered.filter(item => item.region.toLowerCase().includes(selectedRegion.toLowerCase()));
        }
        
        if (selectedTimePeriod) {
          filtered = filtered.filter(item => item.time_period.toLowerCase().includes(selectedTimePeriod.toLowerCase()));
        }
        
        if (selectedTag) {
          filtered = filtered.filter(item => 
            item.tags && item.tags.some(tag => tag.name.toLowerCase() === selectedTag.toLowerCase())
          );
        }
        
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          filtered = filtered.filter(item => 
            (item.title && item.title.toLowerCase().includes(searchLower)) ||
            (item.description && item.description.toLowerCase().includes(searchLower)) ||
            (item.region && item.region.toLowerCase().includes(searchLower))
          );
        }
        
        setItems(filtered);
        setFilteredItems(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        
        setActiveFilters(
          [searchTerm, selectedRegion, selectedTimePeriod, selectedTag].filter(Boolean).length
        );
        
        // Show a less alarming error message when using fallback data
        setError('Unable to connect to the server. Showing sample items instead.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [searchTerm, selectedRegion, selectedTimePeriod, selectedTag, currentPage, itemsPerPage]);

  // Handle search submission
  const handleSearchSubmit = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRegion('');
    setSelectedTimePeriod('');
    setSelectedTag('');
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero banner with background image */}
      <div className="relative bg-amber-900 text-white">
        <div className="absolute inset-0 bg-[url('/museum-bg.jpg')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
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
            <div className="mb-6">
              <ItemSearchBar 
                placeholder="Search by name, region, materials..." 
                initialValue={searchTerm}
                onSearch={handleSearchSubmit}
              />
            </div>
            
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
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    setCurrentPage(1);
                  }}
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
                  onChange={(e) => {
                    setSelectedTimePeriod(e.target.value);
                    setCurrentPage(1);
                  }}
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
                  onChange={(e) => {
                    setSelectedTag(e.target.value);
                    setCurrentPage(1);
                  }}
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
        
        {/* Display error message if there's an error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex">
              <svg className="w-5 h-5 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd"></path>
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {/* Display items based on loading state and results */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="xl" color="amber" />
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
                <CulturalItemCard key={item.id} item={item} />
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
        
        {/* Pagination */}
        {!isLoading && filteredItems.length > 0 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default ItemsListPage;