import React from 'react';

const ItemDetailPage = () => {
  const item = {
    id: 1,
    name: "Viking Age Silver Necklace",
    description: "Intricately designed silver necklace featuring traditional Norse patterns and dragon motifs. Found in a burial site near Stockholm.",
    details: [
      "Origin: Scandinavia",
      "Time Period: Viking Age (793-1066 CE)",
      "Materials: Silver, precious stones"
    ],
    image: "/public/Viking Age Silver Necklace.jpg",
    relatedItems: [
      { id: 2, name: "Ancient Greek Amphora", description: "Red-figure amphora depicting scenes from the Trojan War.", image: "/public/Ancient Greek Amphora.jpg" },
      { id: 3, name: "Maya Jade Death Mask", description: "Ceremonial death mask made of jade mosaic pieces.", image: "/public/Maya Jade Death Mask.jpg" },
      { id: 4, name: "Tang Dynasty Bronze Mirror", description: "Bronze mirror with intricate floral patterns.", image: "/public/tang_bronze_mirror.jpg" }
    ]
  };

  return (
    <div className="item-detail-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb navigation */}
      <nav className="breadcrumb text-gray-500 text-sm mb-4" aria-label="Breadcrumb">
        <a href="/" className="hover:underline">Home</a> &gt; 
        <a href="/items" className="hover:underline"> Items</a> &gt; 
        <span aria-current="page">{item.name}</span>
      </nav>

      {/* Item gallery */}
      <div className="item-gallery">
        <img src={item.image} alt={`Image of ${item.name}`} className="item-image" />
      </div>

      {/* Item description */}
      <div className="item-description">
        <h1 className="text-3xl font-bold">{item.name}</h1>
        <p className="text-gray-600 mt-2">{item.description}</p>
        <ul className="mt-4 list-disc list-inside text-gray-700">
          {item.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </div>

      {/* Related items section */}
      <div className="related-items mt-8">
        <h2 className="text-2xl font-semibold mb-4">Related Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {item.relatedItems.map(relatedItem => (
            <a href={`/items/${relatedItem.id}`} key={relatedItem.id} 
               className="related-item border p-4 rounded hover:shadow-lg transition-shadow">
              <img src={relatedItem.image} alt={`Image of ${relatedItem.name}`} className="w-full h-32 object-cover mb-2" />
              <h3 className="text-lg font-bold">{relatedItem.name}</h3>
              <p className="text-gray-600 text-sm">{relatedItem.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;