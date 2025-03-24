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

const authService = {
  // Register a new user
  register: async (userData: { username: string; email: string; password: string; is_artist?: boolean }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Log in a user
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Update user's artist status
  updateArtistStatus: async (isArtist: boolean, token: string) => {
    try {
      console.log('Sending update artist status request with token:', token ? 'Token provided' : 'No token');
      const response = await axios.put(
        `${API_URL}/update-artist-status`, 
        { is_artist: isArtist },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      console.log('Artist status update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating artist status:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server response:', error.response.data);
      }
      throw error;
    }
  },

  // Get current user information
  getCurrentUser: async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }
};

export default authService; 