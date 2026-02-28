// API service for making requests to the backend
/*
We use Firebase Authentication for identity verification and maintain 
user profile metadata in our backend database.

*/
const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Get all matches for a user
  getMatches: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/matches/${userId}`);
    return response.json();
  },

  // Get user profile
  getProfile: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
    return response.json();
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    return response.json();
  },

  // Login
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },
};

export default api;
