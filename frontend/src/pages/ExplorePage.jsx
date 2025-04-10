import React, { useState, useEffect } from 'react';
import CulturalItemCard from '../components/CulturalItemCard';

// Use fallback images in case the originals don't load
const fallbackImage = "https://images.unsplash.com/photo-1608412759225-8cb7f42eb7fb?auto=format&fit=crop&q=80";

const staticData = {
  data: [
    {
      id: 7,
      title: "Egyptian Canopic Jars",
      region: "Egypt",
      time_period: "New Kingdom (1550-1070 BCE)",
      description: "Set of four alabaster canopic jars used in mummification process, with heads representing the four sons of Horus.",
      image_url: "https://example.com/images/artifacts/egyptian-jars.jpg",
      tags: [{ id: 18, name: "Funerary" }, { id: 19, name: "Egyptian" }]
    },
    {
      id: 8,
      title: "Roman Gladius",
      region: "Rome",
      time_period: "Roman Empire (27 BCE-476 CE)",
      description: "Well-preserved Roman short sword with decorated bronze hilt and scabbard.",
      image_url: "https://example.com/images/artifacts/roman-gladius.jpg",
      tags: [{ id: 16, name: "Weapons" }, { id: 20, name: "Roman" }]
    },
    {
      id: 9,
      title: "Celtic Torc",
      region: "British Isles",
      time_period: "Iron Age (800-50 BCE)",
      description: "Gold neck ring showing masterful Celtic metalwork and artistic design.",
      image_url: "https://example.com/images/artifacts/celtic-torc.jpg",
      tags: [{ id: 1, name: "Jewelry" }, { id: 21, name: "Celtic" }]
    }
  ]
};

const ExplorePage = () => {
  const [items, setItems] = useState(staticData.data);

  useEffect(() => {
    const fetchExploreItems = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
        const response = await fetch(`${API_BASE_URL}/api/v1/cultural-items/featured`);
        
        if (!response.ok) {
          // Fall back to static data if API fails
          const itemsWithFallback = staticData.data.map(item => ({
            ...item,
            handleImageError: (e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }
          }));
          setItems(itemsWithFallback);
          return;
        }
        
        const data = await response.json();
        const fetchedItems = Array.isArray(data) ? data : [];
        
        // Add error handling to each item
        const itemsWithFallback = fetchedItems.map(item => ({
          ...item,
          handleImageError: (e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }
        }));
        
        setItems(itemsWithFallback);
      } catch (error) {
        console.error("Error fetching explore items:", error);
        // Fall back to static data on error
        const itemsWithFallback = staticData.data.map(item => ({
          ...item,
          handleImageError: (e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }
        }));
        setItems(itemsWithFallback);
      }
    };
    
    fetchExploreItems();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Explore Cultural Heritage</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <CulturalItemCard 
            key={item.id} 
            item={item}
            onImageError={item.handleImageError}
          />
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;