import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

interface ArtistPreviewProps {
  artistName: string;
}

const ArtistPreview = ({ artistName }: ArtistPreviewProps) => {
  return (
    <div className="pt-6 border-t border-gray-200">
      <Link 
        to={`/artist/${artistName.toLowerCase().replace(/\s+/g, '-')}`}
        className="flex items-center gap-4 group"
      >
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-100">
          <User className="w-full h-full p-2 text-gray-500" />
        </div>
        <div>
          <h3 className="font-medium text-gallery-dark group-hover:text-gallery-teal transition-colors">
            {artistName}
          </h3>
          <p className="text-sm text-gray-500">View Artist Profile</p>
        </div>
      </Link>
    </div>
  );
};

export default ArtistPreview; 