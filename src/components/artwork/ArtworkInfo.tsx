import React from 'react';
import { Link } from 'react-router-dom';
import { Artwork } from '@/components/ArtworkCard';

interface ArtworkInfoProps {
  artwork: Artwork;
}

const ArtworkInfo = ({ artwork }: ArtworkInfoProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gallery-dark mb-2">{artwork.title}</h1>
      <Link to={`/artist/${artwork.artistName.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-600 hover:text-gallery-teal">
        by {artwork.artistName}
      </Link>
    </div>
  );
};

export default ArtworkInfo; 