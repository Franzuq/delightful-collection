
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface Artwork {
  id: number;
  title: string;
  artistName: string;
  price: number;
  imageUrl: string;
  isFavorited?: boolean;
}

interface ArtworkCardProps {
  artwork: Artwork;
  onFavoriteToggle?: (id: number) => void;
}

const ArtworkCard = ({ artwork, onFavoriteToggle }: ArtworkCardProps) => {
  const [isFavorited, setIsFavorited] = useState(artwork.isFavorited || false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { toast } = useToast();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsFavorited(!isFavorited);
    
    if (onFavoriteToggle) {
      onFavoriteToggle(artwork.id);
    }
    
    toast({
      title: !isFavorited ? "Added to favorites" : "Removed from favorites",
      description: !isFavorited ? `${artwork.title} has been added to your favorites` : `${artwork.title} has been removed from your favorites`,
      duration: 2000,
    });
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <Link to={`/artwork/${artwork.id}`} className="group">
      <div className="rounded-lg overflow-hidden bg-white card-hover shadow transition-all duration-300">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-10 h-10 border-2 border-gallery-teal border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={handleImageLoad}
          />
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 
              ${isFavorited 
                ? 'bg-white text-red-500' 
                : 'bg-black/30 text-white backdrop-blur-sm hover:bg-black/50'}`}
          >
            <Heart 
              className={`h-5 w-5 ${isFavorited ? 'fill-red-500' : ''} transition-transform duration-300 hover:scale-110`} 
            />
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-gallery-dark truncate">{artwork.title}</h3>
          <p className="text-sm text-gray-500 mb-2">{artwork.artistName}</p>
          <div className="flex justify-between items-center">
            <p className="font-bold text-gallery-dark">${artwork.price.toLocaleString()}</p>
            <span className="text-xs px-2 py-1 bg-gallery-light text-gallery-dark rounded-full">
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArtworkCard;
