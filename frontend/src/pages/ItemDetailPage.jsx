import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../stores/authStore';
import CulturalItemCard from '../components/CulturalItemCard';
import useToast from '../hooks/useToast';
import { API_BASE_URL } from '../config';

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { toast } = useToast();
  const [item, setItem] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  // Fetch item data when component mounts
  useEffect(() => {
    const fetchItemData = () => {
      setIsLoading(true);
      
      // API call to fetch item by ID
      fetch(`${API_BASE_URL}/api/v1/cultural-items/${id}`)
        .then(response => {
          if (!response.ok) {
            // Try alternative endpoint formats if the first one fails
            return fetch(`${API_BASE_URL}/cultural-items/${id}`)
              .then(altResponse => {
                if (!altResponse.ok) {
                  throw new Error('Failed to fetch item');
                }
                return altResponse.json();
              })
              .catch(altErr => {
                throw new Error('Failed to fetch item');
              });
          }
          return response.json();
        })
        .then(itemData => {
          // Map cultural item fields to expected format
          const mappedItem = {
            ...itemData,
            title: itemData.title,
            description: itemData.description,
            region: itemData.region,
            time_period: itemData.time_period,
            image_url: itemData.image_url,
            tags: itemData.tags,
            created_at: itemData.created_at,
            additional_images: itemData.media?.filter(m => m.media_type === 'image').map(m => m.url) || []
          };
          setItem(mappedItem);
          setActiveImage(mappedItem?.image_url || null);
          
          // Check if current user is the owner of this item
          setIsOwner(
            user && itemData.owner_id && user.id === itemData.owner_id
          );
        })
        .catch(err => {
          setError('Failed to load item. It may have been removed or you may not have permission to view it.');
          console.error('Error in item data fetch:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    
    fetchItemData();
  }, [id, user, isAuthenticated]);

  const handleDeleteItem = async () => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token') || useAuthStore.getState().token;
      
      const response = await fetch(`${API_BASE_URL}/api/v1/cultural-items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      
      navigate('/items', { replace: true });
    } catch (err) {
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(`/items/${id}`));
      return;
    }
    
    setIsFavoriteLoading(true);
    try {
      if (isFavorite) {
        // Remove from favorites
        await fetch(`${API_BASE_URL}/api/v1/user-favorites/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Add to favorites
        await fetch(`${API_BASE_URL}/api/v1/user-favorites/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ cultural_item_id: id })
        });
      }
      
      // Update the UI state
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      // Show error message to user
      alert(isFavorite ? 'Failed to remove from favorites' : 'Failed to add to favorites');
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  // Handle 404 or loading states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <LoadingSpinner size="xl" color="amber" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-stone-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-10 text-center">
            <svg className="h-16 w-16 text-amber-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19H19a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Item not found'}</h2>
            <p className="text-gray-600 mb-6">This item may have been removed or you may not have permission to view it.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-700 hover:bg-amber-800"
              >
                Go Back
              </button>
              <Link
                to="/items"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Browse Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compile all available images for gallery
  const thumbnails = [
    item.image_url,
    ...(item.additional_images || [])
  ].filter(Boolean);

  if (thumbnails.length === 0) {
    thumbnails.push('/public/placeholder-artifact.jpg');
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero banner with subtle pattern background */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-700 p-4 md:p-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">{item.title}</h1>
          
          {/* Breadcrumb navigation */}
          <nav className="flex text-amber-200 text-sm mb-2" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/items" className="hover:text-white transition-colors">Collection</Link>
            <span className="mx-2">/</span>
            <span className="text-white font-medium" aria-current="page">{item.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Item gallery with thumbnails */}
          <div className="item-gallery space-y-4">
            <div className="relative aspect-w-4 aspect-h-3 bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={activeImage || thumbnails[0]} 
                alt={item.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = '/public/placeholder-artifact.jpg';
                }}
              />
              
              <button className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </div>
            
            {/* Thumbnail gallery */}
            {thumbnails.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {thumbnails.map((thumbnail, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(thumbnail)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all
                      ${activeImage === thumbnail ? 'border-amber-500 shadow-md' : 'border-gray-200 hover:border-amber-300'}`}
                  >
                    <img
                      src={thumbnail}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = '/public/placeholder-artifact.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Item actions (add to collection, share, etc.) */}
            <div className="flex space-x-2 pt-2">
              <button 
                onClick={handleToggleFavorite}
                disabled={isFavoriteLoading}
                className={`flex items-center space-x-1 ${
                  isFavorite 
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300' 
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                } px-4 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                {isFavoriteLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ${isFavorite ? 'fill-amber-500 stroke-amber-500' : 'stroke-current fill-none'}`}
                    viewBox="0 0 24 24" strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                )}
                <span>{isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}</span>
              </button>
              
              <button className="flex items-center space-x-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                <span>Share</span>
              </button>
              
              <Link to={`/items/${id}/comments`} className="flex items-center space-x-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                </svg>
                <span>Comments</span>
              </Link>
            </div>
          </div>
          
          {/* Item details */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            {/* Basic info */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h2>
              <p className="text-gray-700 mb-6 whitespace-pre-wrap">{item.description}</p>
            </div>
            
            {/* Metadata table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8 text-sm">
              {item.time_period && (
                <div>
                  <h3 className="text-gray-500 uppercase text-xs tracking-wider mb-1">Time Period</h3>
                  <p className="font-medium text-gray-800">{item.time_period}</p>
                </div>
              )}
              
              {item.region && (
                <div>
                  <h3 className="text-gray-500 uppercase text-xs tracking-wider mb-1">Region</h3>
                  <p className="font-medium text-gray-800">{item.region}</p>
                </div>
              )}
              
              {item.culture && (
                <div>
                  <h3 className="text-gray-500 uppercase text-xs tracking-wider mb-1">Culture</h3>
                  <p className="font-medium text-gray-800">{item.culture}</p>
                </div>
              )}
              
              {item.materials && (
                <div>
                  <h3 className="text-gray-500 uppercase text-xs tracking-wider mb-1">Materials</h3>
                  <p className="font-medium text-gray-800">{item.materials}</p>
                </div>
              )}
              
              {item.dimensions && (
                <div>
                  <h3 className="text-gray-500 uppercase text-xs tracking-wider mb-1">Dimensions</h3>
                  <p className="font-medium text-gray-800">{item.dimensions}</p>
                </div>
              )}
              
              {item.credit && (
                <div>
                  <h3 className="text-gray-500 uppercase text-xs tracking-wider mb-1">Credit</h3>
                  <p className="font-medium text-gray-800">{item.credit}</p>
                </div>
              )}
              
              {item.accession_number && (
                <div>
                  <h3 className="text-gray-500 uppercase text-xs tracking-wider mb-1">Accession Number</h3>
                  <p className="font-medium text-gray-800">{item.accession_number}</p>
                </div>
              )}
              
              {item.created_at && (
                <div>
                  <h3 className="text-gray-500 uppercase text-xs tracking-wider mb-1">Added On</h3>
                  <p className="font-medium text-gray-800">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            
            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-gray-500 uppercase text-xs tracking-wider mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <Link
                      key={tag.id || tag.name}
                      to={`/items?tag=${encodeURIComponent(tag.name)}`}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full transition-colors"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Admin actions */}
            {isOwner && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-gray-500 uppercase text-xs tracking-wider mb-3">Item Management</h3>
                <div className="flex space-x-4">
                  <Link
                    to={`/items/${id}/edit`}
                    className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21h-9.5A2.25 2.25 0 014 18.75V8.25A2.25 2.25 0 016.25 6H11" />
                    </svg>
                    <span>Edit Item</span>
                  </Link>
                  <button
                    onClick={handleDeleteItem}
                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span>Delete Item</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related items section */}
        {relatedItems.length > 0 && (
          <div className="border-t border-gray-200 pt-16 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-10 font-serif">Related Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedItems.map(relatedItem => (
                <CulturalItemCard key={relatedItem.id} item={relatedItem} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetailPage;