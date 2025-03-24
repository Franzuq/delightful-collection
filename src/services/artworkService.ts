import axios from 'axios';

// Dynamically set the API URL based on the environment
const getApiUrl = () => {
  const hostname = window.location.hostname;
  // If we're on localhost, use the development server port
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  // In production, assume API is on the same domain but with /api path
  return `${window.location.origin}/api`;
};

const API_URL = getApiUrl();

// Configure axios defaults
axios.defaults.withCredentials = true;

const artworkService = {
  // Get all artworks with optional filters
  getAllArtworks: async (filters = {}) => {
    try {
      console.log('Attempting to fetch artworks from:', `${API_URL}/artworks`);
      const response = await axios.get(`${API_URL}/artworks`, { 
        params: filters,
        // Adding debugging information
        headers: {
          'X-Debug-Info': 'Debugging API connection'
        }
      });
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching artworks:', error);
      // For debugging purposes, return some mock data if the API fails
      return {
        artworks: [
          {
            id: 1,
            title: "Debugging Artwork",
            artist_name: "Debug Artist",
            image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
            description: "This is a fallback artwork for debugging"
          }
        ],
        count: 1
      };
    }
  },

  // Get single artwork by ID
  getArtworkById: async (id: string) => {
    const response = await axios.get(`${API_URL}/artworks/${id}`);
    return response.data;
  },

  // Add new artwork
  addArtwork: async (artworkData: FormData, token: string) => {
    try {
      console.log('Sending artwork data with token:', token ? 'Token provided' : 'No token');
      const response = await axios.post(`${API_URL}/artworks`, artworkData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't manually set Content-Type when sending FormData
          // axios will set the correct multipart/form-data content type with boundary
        },
        // Enable credentials for CORS
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error creating artwork:', error);
      throw error;
    }
  },

  // Like/dislike an artwork
  toggleLike: async (artworkId: string, token: string) => {
    try {
      const response = await axios.post(`${API_URL}/artworks/${artworkId}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  // Favorite/unfavorite an artwork
  toggleFavorite: async (artworkId: string, token: string) => {
    try {
      const response = await axios.post(`${API_URL}/artworks/${artworkId}/favorite`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  // Get user's favorites
  getUserFavorites: async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  },

  // Add a comment to artwork
  addComment: async (artworkId: string, content: string, token: string) => {
    try {
      const response = await axios.post(`${API_URL}/artworks/${artworkId}/comments`, 
        { content },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Get artwork comments
  getComments: async (artworkId: string) => {
    try {
      const response = await axios.get(`${API_URL}/artworks/${artworkId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }
};

export default artworkService; 