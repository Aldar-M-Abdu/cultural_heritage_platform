import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CulturalItemCard from '../components/CulturalItemCard';
import useToast from '../hooks/useToast';
import { fetchWithAuth } from '../config';
import { API_BASE_URL } from '../config';

const SavedItemsPage = () => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        // Fetch user's favorites
        const favoritesData = await fetchWithAuth(`${API_BASE_URL}/api/v1/favorites/`);
        
        if (!favoritesData || !Array.isArray(favoritesData)) {
          throw new Error('Failed to fetch favorites');
        }
        
        // Extract item IDs from favorites
        const itemIds = favoritesData.map(fav => fav.cultural_item_id);
        
        // If no favorites, set empty array and return
        if (itemIds.length === 0) {
          setFavoriteItems([]);
          setIsLoading(false);
          return;
        }
        
        // Fetch details for each favorited item
        const itemsPromises = itemIds.map(id => 
          fetch(`${API_BASE_URL}/api/v1/cultural-items/${id}`)
            .then(response => {
              if (!response.ok) throw new Error(`Failed to fetch item ${id}`);
              return response.json();
            })
            .catch(err => {
              console.error(`Error fetching item ${id}:`, err);
              return null; // Return null for failed items
            })
        );
        
        // Wait for all item requests to complete
        const itemsData = await Promise.all(itemsPromises);
        
        // Filter out any nulls (failed requests)
        const validItems = itemsData.filter(item => item !== null);
        
        setFavoriteItems(validItems);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load your saved items. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load your saved items',
          status: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [toast]);

  const handleRemoveFromFavorites = async (itemId) => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/api/v1/favorites/${itemId}`, {
        method: 'DELETE',
      });
      
      // Update state to remove the item
      setFavoriteItems(prevItems => prevItems.filter(item => item.id !== itemId));
      
      toast({
        title: 'Success',
        description: 'Item removed from favorites',
        status: 'success',
      });
    } catch (err) {
      console.error('Error removing from favorites:', err);
      toast({
        title: 'Error',
        description: 'Failed to remove item from favorites',
        status: 'error',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <LoadingSpinner size="xl" color="amber" />
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Page header */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-700 p-4 md:p-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Saved Items</h1>
          <p className="text-amber-100">Items you've saved to your favorites collection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {favoriteItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <svg className="w-16 h-16 text-amber-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No saved items yet</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Explore our collection and save items that interest you to view them here later.
            </p>
            <Link
              to="/items"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-700 hover:bg-amber-800"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {favoriteItems.length} {favoriteItems.length === 1 ? 'Item' : 'Items'}
              </h2>
              <Link
                to="/items"
                className="text-amber-700 hover:text-amber-800 font-medium"
              >
                Browse More Items
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteItems.map((item) => (
                <div key={item.id} className="relative">
                  <CulturalItemCard item={item} />
                  <button
                    onClick={() => handleRemoveFromFavorites(item.id)}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors shadow-sm"
                    aria-label="Remove from favorites"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-700">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedItemsPage; 