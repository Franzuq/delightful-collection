import React from 'react';
import { Heart, Share2, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  isFavorited: boolean;
  isDisliked: boolean;
  onFavoriteToggle: () => void;
  onDislikeToggle: () => void;
  onShare: () => void;
}

const ActionButtons = ({ 
  isFavorited, 
  isDisliked,
  onFavoriteToggle, 
  onDislikeToggle,
  onShare 
}: ActionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <Button
        variant="outline"
        className={`border-gallery-teal ${isFavorited ? 'bg-pink-50 text-red-500' : 'hover:bg-gallery-teal/10 hover:text-gallery-teal hover:border-gallery-teal'}`}
        onClick={onFavoriteToggle}
      >
        <Heart className={`mr-2 h-4 w-4 ${isFavorited ? 'fill-red-500' : ''}`} />
        {isFavorited ? 'Favorited' : 'Add to Favorites'}
      </Button>
      
      <Button
        variant="outline"
        className={`border-gallery-teal ${isDisliked ? 'bg-slate-100 text-slate-700' : 'hover:bg-gallery-teal/10 hover:text-gallery-teal hover:border-gallery-teal'}`}
        onClick={onDislikeToggle}
      >
        <ThumbsDown className={`mr-2 h-4 w-4 ${isDisliked ? 'fill-slate-500' : ''}`} />
        {isDisliked ? 'Disliked' : 'Dislike'}
      </Button>
      
      <Button
        variant="outline"
        className="lg:ml-auto"
        onClick={onShare}
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    </div>
  );
};

export default ActionButtons; 