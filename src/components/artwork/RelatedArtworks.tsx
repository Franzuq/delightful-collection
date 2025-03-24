import React from 'react';
import { Link } from 'react-router-dom';
import { Artwork } from '@/components/ArtworkCard';

interface RelatedArtworksProps {
  artworks: Artwork[];
}

const RelatedArtworks = ({ artworks }: RelatedArtworksProps) => {
  if (!artworks.length) return null;
  
  return (
    <section className="mt-16 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="group">
            <Link to={`/artwork/${artwork.id}`} className="block">
              <div className="rounded-lg overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-lg">
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src={artwork.imageUrl} 
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-medium text-gallery-dark group-hover:text-gallery-teal transition-colors">
                    {artwork.title}
                  </h3>
                  <p className="text-sm text-gray-500">{artwork.artistName}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedArtworks; 