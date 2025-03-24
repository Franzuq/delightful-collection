import axios from 'axios';

// Using direct URL for debugging
const API_URL = 'http://localhost:5000/api';

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
    const response = await axios.post(`${API_URL}/artworks`, artworkData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  },

  // Like/dislike an artwork
  toggleLike: async (artworkId: string, token: string) => {
    const response = await axios.post(`${API_URL}/artworks/${artworkId}/like`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Favorite/unfavorite an artwork
  toggleFavorite: async (artworkId: string, token: string) => {
    const response = await axios.post(`${API_URL}/artworks/${artworkId}/favorite`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Get user's favorites
  getUserFavorites: async (token: string) => {
    const response = await axios.get(`${API_URL}/favorites`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Add a comment to artwork
  addComment: async (artworkId: string, content: string, token: string) => {
    const response = await axios.post(`${API_URL}/artworks/${artworkId}/comments`, 
      { content },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  // Get artwork comments
  getComments: async (artworkId: string) => {
    const response = await axios.get(`${API_URL}/artworks/${artworkId}/comments`);
    return response.data;
  }
};

export default artworkService; 