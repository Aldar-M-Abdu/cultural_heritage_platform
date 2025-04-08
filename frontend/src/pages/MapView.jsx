import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import LoadingSpinner from '../components/common/LoadingSpinner';
import L from "leaflet";

// Custom marker icon
const defaultIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

const MapView = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch real items from the API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/v1/cultural-items');
        if (!response.ok) {
          throw new Error('Resource not found');
        }
        const data = await response.json();
        
        // Map the cultural items to the expected format
        const mappedItems = Array.isArray(data) ? data.map(item => ({
          id: item.id,
          name: item.title,
          description: item.description,
          category: item.tags?.[0]?.name || 'Uncategorized',
          period: item.time_period,
          latitude: item.latitude || (Math.random() * 180 - 90), // Fallback for demo
          longitude: item.longitude || (Math.random() * 360 - 180), // Fallback for demo
          region: item.region
        })) : [];
        
        setItems(mappedItems);
      } catch (err) {
        if (err.message === 'Resource not found') {
          setError('No items with geographic coordinates were found.');
        } else {
          console.error("Failed to fetch items:", err);
          setError("Failed to load items. Please try again later.");
        }
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleMarkerClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Cultural Heritage Map</h1>
          <p className="text-slate-600">Explore historical and cultural sites from around the world</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with list of sites */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-semibold text-slate-800">Heritage Sites</h2>
            </div>
            <ul className="divide-y divide-slate-200 max-h-[65vh] overflow-y-auto">
              {items.map(item => (
                <li 
                  key={item.id} 
                  className={`p-4 cursor-pointer transition-colors duration-150 ${activeItem?.id === item.id ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                  onClick={() => handleMarkerClick(item)}
                >
                  <h3 className={`font-medium ${activeItem?.id === item.id ? 'text-indigo-600' : 'text-slate-800'}`}>{item.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{item.category}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.period}</p>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Map container */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow-md rounded-lg p-4" style={{ height: "70vh" }}>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <MapContainer
                  center={[20, 0]}
                  zoom={3}
                  minZoom={2}
                  style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
                  zoomControl={false}
                  maxBounds={[[-90, -180], [90, 180]]}
                  maxBoundsViscosity={1.0}
                  className="z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    maxZoom={19}
                    noWrap={true}
                  />
                  <ZoomControl position="bottomright" />
                  <MarkerClusterGroup
                    chunkedLoading
                    showCoverageOnHover={false}
                    spiderfyOnMaxZoom
                  >
                    {items.map(item => (
                      item.latitude && item.longitude ? (
                        <Marker
                          key={item.id}
                          position={[item.latitude, item.longitude]}
                          title={item.name}
                          eventHandlers={{
                            click: () => setActiveItem(item),
                          }}
                        >
                          <Popup className="custom-popup">
                            <div className="p-1">
                              <h3 className="font-bold text-base text-slate-800 mb-1">{item.name}</h3>
                              <div className="flex space-x-2 mb-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {item.category}
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                  {item.period}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600">{item.description}</p>
                            </div>
                          </Popup>
                        </Marker>
                      ) : null
                    ))}
                  </MarkerClusterGroup>
                </MapContainer>
              )}
            </div>
          </div>
        </div>
        
        {/* Site details panel - shows when a site is selected */}
        {activeItem && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{activeItem.name}</h2>
                <div className="flex space-x-2 mt-2 mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {activeItem.category}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {activeItem.period}
                  </span>
                </div>
              </div>
              <button 
                className="text-slate-400 hover:text-slate-500"
                onClick={() => setActiveItem(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="text-slate-600 mb-4">{activeItem.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 p-3 rounded">
                <p className="text-slate-500 font-medium">Coordinates</p>
                <p className="text-slate-800">{activeItem.latitude}, {activeItem.longitude}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded">
                <p className="text-slate-500 font-medium">Time Period</p>
                <p className="text-slate-800">{activeItem.period}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;