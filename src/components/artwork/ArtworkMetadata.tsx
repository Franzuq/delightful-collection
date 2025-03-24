import React from 'react';
import { Tag, Ruler, Clock, Globe } from 'lucide-react';

interface ArtworkMetadataProps {
  medium: string;
  dimensions: string;
  year: number;
  location: string;
  description: string;
}

const ArtworkMetadata = ({ medium, dimensions, year, location, description }: ArtworkMetadataProps) => {
  return (
    <>
      <p className="text-gray-700">{description}</p>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-gallery-teal" />
          <span className="text-gray-600">Medium:</span>
          <span className="font-medium">{medium}</span>
        </div>
        <div className="flex items-center gap-2">
          <Ruler className="h-4 w-4 text-gallery-teal" />
          <span className="text-gray-600">Size:</span>
          <span className="font-medium">{dimensions}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gallery-teal" />
          <span className="text-gray-600">Year:</span>
          <span className="font-medium">{year}</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-gallery-teal" />
          <span className="text-gray-600">Location:</span>
          <span className="font-medium">{location}</span>
        </div>
      </div>
    </>
  );
};

export default ArtworkMetadata; 