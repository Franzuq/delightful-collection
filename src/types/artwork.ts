export interface Artwork {
  id: number | string;
  title: string;
  artistName: string;
  imageUrl: string;
  isFavorited?: boolean;
}

export interface ArtworkDetails {
  description: string;
  medium: string;
  dimensions: string;
  year: number;
  category: string;
  location: string;
  likes: number;
  dislikes: number;
}

export interface ArtworkWithDetails extends Artwork {
  details: ArtworkDetails;
  isDisliked?: boolean;
}

export interface SocialInteraction {
  artworkId: number;
  userId: number;
  type: 'like' | 'dislike' | 'favorite';
  timestamp: Date;
} 