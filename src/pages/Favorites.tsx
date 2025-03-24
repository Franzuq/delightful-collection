import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArtworkCard from '@/components/ArtworkCard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import artworkService from '@/services/artworkService';
import { Bookmark, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  artist: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  isFavorited: boolean;
  createdAt: string;
  tags?: string[];
}

const Favorites = () => {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [favorites, setFavorites] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/favorites' } });
      return;
    }
    
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const data = await artworkService.getUserFavorites(token!);
        setFavorites(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load your favorites. Please try again.');
        toast({
          title: "Error",
          description: "Could not load your favorites",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, [isAuthenticated, navigate, token, toast]);
  
  const handleFavoriteToggle = (artworkId: string, isFavorited: boolean) => {
    // If unfavorited, remove from the list
    if (!isFavorited) {
      setFavorites(prev => prev.filter(artwork => artwork.id !== artworkId));
    }
  };
  
  if (!isAuthenticated) {
    return null; // Don't render anything if not authenticated (will redirect)
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gallery-dark mb-2">Your Favorites</h1>
        <p className="text-gray-600 mb-8">
          Here's the collection of artwork you've saved as favorites.
        </p>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-gallery-teal animate-spin mb-4" />
            <p className="text-gray-600">Loading your favorites...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 max-w-md">
              <p>{error}</p>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bookmark className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gallery-dark mb-2">No favorites yet</h2>
            <p className="text-gray-600 max-w-md mb-6">
              You haven't added any artwork to your favorites yet. Browse the gallery and save artwork you love!
            </p>
            <Button onClick={() => navigate('/gallery')} className="bg-gallery-teal hover:bg-gallery-teal/90">
              Explore the Gallery
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(artwork => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Favorites; 