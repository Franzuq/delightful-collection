import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Bookmark, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import artworkService from '@/services/artworkService';

interface ArtworkCardProps {
  artwork: {
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
  };
  onLikeToggle?: (artworkId: string, isLiked: boolean) => void;
  onFavoriteToggle?: (artworkId: string, isFavorited: boolean) => void;
}

const ArtworkCard = ({ artwork, onLikeToggle, onFavoriteToggle }: ArtworkCardProps) => {
  const { isAuthenticated, token } = useAuth();
  const { toast } = useToast();
  
  const [isLiked, setIsLiked] = useState(artwork.isLiked);
  const [isFavorited, setIsFavorited] = useState(artwork.isFavorited);
  const [likeCount, setLikeCount] = useState(artwork.likes);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like artworks",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await artworkService.toggleLike(artwork.id, token!);
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);
      
      if (onLikeToggle) {
        onLikeToggle(artwork.id, newIsLiked);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not process your request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to favorite artworks",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await artworkService.toggleFavorite(artwork.id, token!);
      const newIsFavorited = !isFavorited;
      setIsFavorited(newIsFavorited);
      
      if (onFavoriteToggle) {
        onFavoriteToggle(artwork.id, newIsFavorited);
      }
      
      toast({
        title: newIsFavorited ? "Added to favorites" : "Removed from favorites",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not process your request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <Link to={`/artwork/${artwork.id}`}>
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={artwork.imageUrl} 
            alt={artwork.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      
      {/* Content */}
      <div className="p-4">
        {/* Artist info */}
        <div className="flex items-center mb-3 gap-2">
          <Link to={`/artist/${artwork.artist.id}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
              {artwork.artist.avatarUrl ? (
                <img 
                  src={artwork.artist.avatarUrl} 
                  alt={artwork.artist.username} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gallery-teal text-white text-xs font-medium">
                  {artwork.artist.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-sm font-medium">{artwork.artist.username}</span>
          </Link>
        </div>
        
        {/* Title and description */}
        <Link to={`/artwork/${artwork.id}`}>
          <h3 className="text-lg font-bold text-gallery-dark mb-1">{artwork.title}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{artwork.description}</p>
        
        {/* Tags */}
        {artwork.tags && artwork.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {artwork.tags.map((tag, index) => (
              <Link 
                key={index} 
                to={`/gallery?tag=${tag}`}
                className="text-xs bg-gray-100 hover:bg-gallery-teal/10 text-gray-600 hover:text-gallery-teal px-2 py-1 rounded-full transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`} 
              onClick={handleLikeToggle}
              disabled={isLoading}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </Button>
            
            <Link to={`/artwork/${artwork.id}#comments`} className="flex items-center gap-1 text-gray-500 text-sm">
              <MessageSquare className="h-4 w-4" />
              <span>{artwork.comments}</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-1 ${isFavorited ? 'text-gallery-teal' : 'text-gray-500'}`} 
              onClick={handleFavoriteToggle}
              disabled={isLoading}
            >
              <Bookmark className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 text-gray-500" 
              onClick={() => navigator.clipboard.writeText(window.location.origin + `/artwork/${artwork.id}`)}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
