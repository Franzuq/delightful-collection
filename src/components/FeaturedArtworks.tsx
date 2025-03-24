import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArtworkCard from './ArtworkCard';
import { Artwork } from '@/types/artwork';
import { Link } from 'react-router-dom';
import artworkService from '@/services/artworkService';
import { useToast } from '@/hooks/useToast';

const FeaturedArtworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeaturedArtworks = async () => {
      try {
        // In a real app, you might have a separate endpoint for featured artworks
        // For now, we'll just use the first 4 from getAllArtworks
        const data = await artworkService.getAllArtworks();
        
        // Transform backend data to match our Artwork type
        const transformedArtworks = data.artworks
          .slice(0, 4) // Just get the first 4 artworks
          .map((artwork: any) => ({
            id: artwork.id,
            title: artwork.title,
            artistName: artwork.artist_name,
            imageUrl: artwork.image_url,
            isFavorited: false // We'll need to check this from the user's favorites
          }));
        
        setArtworks(transformedArtworks);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching featured artworks:', error);
        toast({
          title: "Error loading featured artworks",
          description: "Please try again later",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchFeaturedArtworks();
  }, []);

  const handleFavoriteToggle = (artworkId: string, isFavorited: boolean) => {
    // In a real app, this would make an API call
    setArtworks(prevArtworks => 
      prevArtworks.map(artwork => 
        artwork.id.toString() === artworkId 
          ? { ...artwork, isFavorited } 
          : artwork
      )
    );
  };

  // Convert our simplified Artwork to the format ArtworkCard expects
  const adaptArtworkForCard = (artwork: Artwork) => {
    return {
      id: artwork.id.toString(),
      title: artwork.title,
      imageUrl: artwork.imageUrl,
      description: "A beautiful piece of art", // Default description
      artist: {
        id: "artist-" + Math.floor(Math.random() * 1000),
        username: artwork.artistName,
      },
      likes: 0,
      comments: 0,
      isLiked: false,
      isFavorited: artwork.isFavorited || false,
      createdAt: new Date().toISOString(),
      tags: []
    };
  };

  return (
    <section className="py-16 bg-white">
      <div className="gallery-container">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="section-title">Featured Artworks</h2>
            <p className="text-gray-600 max-w-2xl">
              Our curators handpick stunning works from our collection, showcasing the diversity and brilliance of contemporary art.
            </p>
          </div>
          <Button variant="ghost" className="gap-1 text-gallery-teal" asChild>
            <Link to="/gallery">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow animate-pulse">
                <div className="bg-gray-200 aspect-[4/5]"></div>
                <div className="p-4 space-y-3 bg-white">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artworks.map(artwork => (
              <ArtworkCard
                key={artwork.id}
                artwork={adaptArtworkForCard(artwork)}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedArtworks;
