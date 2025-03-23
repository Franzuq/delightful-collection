
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArtworkCard, { Artwork } from './ArtworkCard';
import { Link } from 'react-router-dom';

// Mock data for featured artworks
const FEATURED_ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: "Ethereal Dreams",
    artistName: "Sophia Chen",
    price: 2500,
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    title: "Urban Symphony",
    artistName: "Marcus Lee",
    price: 1800,
    imageUrl: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    title: "Celestial Harmony",
    artistName: "Elena Rivera",
    price: 3200,
    imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    title: "Whispers of Nature",
    artistName: "Julian Wright",
    price: 1950,
    imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
];

const FeaturedArtworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
      setArtworks(FEATURED_ARTWORKS);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleFavoriteToggle = (id: number) => {
    // In a real app, this would make an API call
    setArtworks(prevArtworks => 
      prevArtworks.map(artwork => 
        artwork.id === id 
          ? { ...artwork, isFavorited: !artwork.isFavorited } 
          : artwork
      )
    );
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
                artwork={artwork}
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
