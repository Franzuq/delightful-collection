import React, { useState } from 'react';
import { Artwork } from '@/components/ArtworkCard';

interface ArtworkImageProps {
  artwork: Artwork;
  category: string;
}

const ArtworkImage = ({ artwork, category }: ArtworkImageProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
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
          {category}
        </span>
      </div>
    </div>
  );
};

export default ArtworkImage; 