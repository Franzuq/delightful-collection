import { Artwork } from "@/types/artwork";
import { ArtworkDetails } from "@/types/artwork";

// Mock data for a single artwork
export const SAMPLE_ARTWORK: Artwork = {
  id: 1,
  title: "Ethereal Dreams",
  artistName: "Sophia Chen",
  imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  isFavorited: false
};

// Mock artwork details extension
export const ARTWORK_DETAILS: ArtworkDetails = {
  description: "This mesmerizing abstract piece explores the fluid boundary between dreams and reality. Using a vibrant palette dominated by blues and purples, the artist creates an ethereal landscape that invites viewers to lose themselves in its depths. The flowing brushstrokes and layered textures evoke a sense of movement and transformation, while delicate highlights suggest moments of clarity amidst the dream-like haze.",
  medium: "Acrylic on Canvas",
  dimensions: "36 × 48 inches",
  year: 2023,
  category: "Abstract",
  location: "New York, USA",
  likes: 142,
  dislikes: 8
};

// Related artworks
export const RELATED_ARTWORKS: Artwork[] = [
  {
    id: 2,
    title: "Urban Symphony",
    artistName: "Marcus Lee",
    imageUrl: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    title: "Celestial Harmony", 
    artistName: "Elena Rivera",
    imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    title: "Whispers of Nature",
    artistName: "Julian Wright",
    imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
]; 