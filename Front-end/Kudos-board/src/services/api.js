const API_URL = 'http://localhost:3001';
const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
const GIPHY_API_URL = 'https://api.giphy.com/v1/gifs';

const api = {
  getTrendingGifs: async (limit = 20) => {
    try {
      const response = await fetch(`${GIPHY_API_URL}/trending?api_key=${GIPHY_API_KEY}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching trending GIFs:', error);
      throw error;
    }
  },

  searchGifs: async (query, limit = 20) => {
    try {
      const response = await fetch(`${GIPHY_API_URL}/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error searching GIFs:', error);
      throw error;
    }
  },

  getBoards: async () => {
    try {
      const response = await fetch(`${API_URL}/boards`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching boards:', error);
      throw error;
    }
  },

  getBoardById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/boards/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching board ${id}:`, error);
      throw error;
    }
  },

  createBoard: async (boardData) => {
    try {
      const response = await fetch(`${API_URL}/boards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(boardData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating board:', error);
      throw error;
    }
  },

  updateBoard: async (id, boardData) => {
    try {
      const response = await fetch(`${API_URL}/boards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(boardData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating board ${id}:`, error);
      throw error;
    }
  },

  deleteBoard: async (id) => {
    try {
      const response = await fetch(`${API_URL}/boards/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting board ${id}:`, error);
      throw error;
    }
  },

  createCard: async (boardId, cardData) => {
    try {
      const response = await fetch(`${API_URL}/boards/${boardId}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error creating card for board ${boardId}:`, error);
      throw error;
    }
  },

  updateCard: async (id, cardData) => {
    try {
      const response = await fetch(`${API_URL}/cards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating card ${id}:`, error);
      throw error;
    }
  },

  deleteCard: async (id) => {
    try {
      const response = await fetch(`${API_URL}/cards/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting card ${id}:`, error);
      throw error;
    }
  },

  voteCard: async (id) => {
    try {
      const response = await fetch(`${API_URL}/cards/${id}/vote`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error voting for card ${id}:`, error);
      throw error;
    }
  },

  // Comment related API calls
  getComments: async (cardId) => {
    try {
      const response = await fetch(`${API_URL}/cards/${cardId}/comments`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching comments for card ${cardId}:`, error);
      throw error;
    }
  },

  addComment: async (cardId, commentData) => {
    try {
      const response = await fetch(`${API_URL}/cards/${cardId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error adding comment to card ${cardId}:`, error);
      throw error;
    }
  },

  deleteComment: async (commentId) => {
    try {
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error);
      throw error;
    }
  },

};

export default api;
