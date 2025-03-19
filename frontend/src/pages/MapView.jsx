import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Correct import for MarkerClusterGroup
import MarkerClusterGroup from "react-leaflet-cluster";

// Set default icon for Leaflet markers
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
  const items = [
    {
      id: 1,
      name: "Viking Burial Site",
      latitude: 59.3293,
      longitude: 18.0686,
      description: "Important Viking burial site containing numerous artifacts"
    },
    {
      id: 2,
      name: "Ancient Greek Temple",
      latitude: 37.9715,
      longitude: 23.7267,
      description: "Ruins of a temple dedicated to Athena"
    },
    {
      id: 3,
      name: "Maya Pyramid",
      latitude: 20.6843,
      longitude: -88.5678,
      description: "Well-preserved Maya pyramid complex"
    },
    {
      id: 4,
      name: "Tang Dynasty Palace",
      latitude: 34.3416,
      longitude: 108.9398,
      description: "Remains of Tang Dynasty imperial palace"
    },
    {
      id: 5,
      name: "Medieval Monastery",
      latitude: 48.8566,
      longitude: 2.3522,
      description: "12th century monastery with preserved manuscripts"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cultural Heritage Map</h1>
      <div className="bg-white shadow rounded-lg p-6" style={{ height: "75vh" }}>
        <MapContainer
          center={[20, 0]}
          zoom={3}
          minZoom={2}
          style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
          zoomControl={false}
          maxBounds={[[-90, -180], [90, 180]]}
          maxBoundsViscosity={1.0}
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
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </Popup>
                </Marker>
              ) : null
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;