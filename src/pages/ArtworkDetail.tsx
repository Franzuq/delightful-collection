
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Artwork } from '@/components/ArtworkCard';
import { Button } from '@/components/ui/button';
import { Heart, Share2, ShoppingCart, ArrowLeft, User, Clock, Ruler, Tag, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for a single artwork
const SAMPLE_ARTWORK: Artwork = {
  id: 1,
  title: "Ethereal Dreams",
  artistName: "Sophia Chen",
  price: 2500,
  imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  isFavorited: false
};

// Mock artwork details extension
const ARTWORK_DETAILS = {
  description: "This mesmerizing abstract piece explores the fluid boundary between dreams and reality. Using a vibrant palette dominated by blues and purples, the artist creates an ethereal landscape that invites viewers to lose themselves in its depths. The flowing brushstrokes and layered textures evoke a sense of movement and transformation, while delicate highlights suggest moments of clarity amidst the dream-like haze.",
  medium: "Acrylic on Canvas",
  dimensions: "36 × 48 inches",
  year: 2023,
  category: "Abstract",
  location: "New York, USA",
  framingOptions: ["Unframed", "Black Wood Frame (+$250)", "White Wood Frame (+$250)", "Floating Frame (+$350)"]
};

// Related artworks
const RELATED_ARTWORKS: Artwork[] = [
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

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFrame, setSelectedFrame] = useState("Unframed");
  const [isFavorited, setIsFavorited] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
      // In a real app, you would fetch the artwork by id
      const fetchedArtwork = {
        ...SAMPLE_ARTWORK,
        id: parseInt(id || "1")
      };
      
      setArtwork(fetchedArtwork);
      setIsFavorited(fetchedArtwork.isFavorited || false);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    
    toast({
      title: !isFavorited ? "Added to favorites" : "Removed from favorites",
      description: !isFavorited 
        ? `${artwork?.title} has been added to your favorites` 
        : `${artwork?.title} has been removed from your favorites`,
      duration: 2000,
    });
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${artwork?.title} (${selectedFrame}) has been added to your cart`,
      duration: 2000,
    });
  };

  const handleShare = () => {
    // In a real app, implement sharing functionality
    toast({
      title: "Share link copied",
      description: "The link to this artwork has been copied to your clipboard",
      duration: 2000,
    });
  };

  const getFramePrice = () => {
    if (!artwork) return 0;
    
    switch (selectedFrame) {
      case "Black Wood Frame (+$250)":
      case "White Wood Frame (+$250)":
        return artwork.price + 250;
      case "Floating Frame (+$350)":
        return artwork.price + 350;
      default:
        return artwork.price;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-6">
        <div className="gallery-container">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/gallery" className="flex items-center text-gray-600 hover:text-gallery-teal">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Gallery
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="aspect-[4/5] bg-gray-200 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-24 bg-gray-200 rounded w-full mt-4"></div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : artwork ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 detail-page-transition">
              {/* Artwork Image */}
              <div className="relative">
                <div className="relative rounded-lg overflow-hidden shadow-lg border border-gray-100">
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="w-12 h-12 border-2 border-gallery-teal border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img 
                    src={artwork.imageUrl} 
                    alt={artwork.title} 
                    className={`w-full h-auto ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setIsImageLoaded(true)}
                  />
                </div>
                
                {/* Image Tags */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 bg-gallery-teal/90 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                    {ARTWORK_DETAILS.category}
                  </span>
                </div>
              </div>
              
              {/* Artwork Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gallery-dark mb-2">{artwork.title}</h1>
                  <Link to={`/artist/${artwork.artistName.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-600 hover:text-gallery-teal">
                    by {artwork.artistName}
                  </Link>
                </div>
                
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gallery-dark">${getFramePrice().toLocaleString()}</span>
                  {selectedFrame !== "Unframed" && (
                    <span className="ml-2 text-sm text-gray-500">
                      (Includes {selectedFrame.split('(')[1].replace(')', '')})
                    </span>
                  )}
                </div>
                
                <p className="text-gray-700">{ARTWORK_DETAILS.description}</p>
                
                {/* Artwork Metadata */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gallery-teal" />
                    <span className="text-gray-600">Medium:</span>
                    <span className="font-medium">{ARTWORK_DETAILS.medium}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-gallery-teal" />
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{ARTWORK_DETAILS.dimensions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gallery-teal" />
                    <span className="text-gray-600">Year:</span>
                    <span className="font-medium">{ARTWORK_DETAILS.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gallery-teal" />
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{ARTWORK_DETAILS.location}</span>
                  </div>
                </div>
                
                {/* Framing Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Framing Options
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {ARTWORK_DETAILS.framingOptions.map((option) => (
                      <div key={option} className="relative">
                        <input 
                          type="radio" 
                          id={option}
                          name="framing"
                          value={option}
                          checked={selectedFrame === option}
                          onChange={() => setSelectedFrame(option)}
                          className="sr-only"
                        />
                        <label 
                          htmlFor={option}
                          className={`
                            block w-full px-3 py-2 text-sm rounded-md cursor-pointer transition-all duration-200
                            ${selectedFrame === option 
                              ? 'bg-gallery-teal text-white border-gallery-teal' 
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gallery-teal/50'}
                            border
                          `}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button 
                    className="bg-gallery-teal hover:bg-gallery-teal/90 flex-grow lg:flex-grow-0 lg:min-w-[200px]"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  
                  <Button
                    variant="outline"
                    className={`border-gallery-teal ${isFavorited ? 'bg-pink-50 text-red-500' : 'hover:bg-gallery-teal/10 hover:text-gallery-teal hover:border-gallery-teal'}`}
                    onClick={handleFavoriteToggle}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isFavorited ? 'fill-red-500' : ''}`} />
                    {isFavorited ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="lg:ml-auto"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
                
                {/* Artist Info */}
                <div className="pt-6 border-t border-gray-200">
                  <Link 
                    to={`/artist/${artwork.artistName.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-100">
                      <User className="w-full h-full p-2 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gallery-dark group-hover:text-gallery-teal transition-colors">
                        {artwork.artistName}
                      </h3>
                      <p className="text-sm text-gray-500">View Artist Profile</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-xl font-medium text-gray-700 mb-2">Artwork not found</h2>
              <p className="text-gray-500 mb-4">The artwork you're looking for doesn't exist or has been removed.</p>
              <Button asChild>
                <Link to="/gallery">Return to Gallery</Link>
              </Button>
            </div>
          )}
          
          {/* Related Artworks */}
          {!isLoading && artwork && (
            <section className="mt-16 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {RELATED_ARTWORKS.map((relatedArtwork) => (
                  <div key={relatedArtwork.id} className="group">
                    <Link to={`/artwork/${relatedArtwork.id}`} className="block">
                      <div className="rounded-lg overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-lg">
                        <div className="aspect-[4/5] overflow-hidden">
                          <img 
                            src={relatedArtwork.imageUrl} 
                            alt={relatedArtwork.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4 bg-white">
                          <h3 className="font-medium text-gallery-dark group-hover:text-gallery-teal transition-colors">
                            {relatedArtwork.title}
                          </h3>
                          <p className="text-sm text-gray-500">{relatedArtwork.artistName}</p>
                          <p className="font-bold text-gallery-dark mt-1">${relatedArtwork.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArtworkDetail;
