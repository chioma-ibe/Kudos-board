const API_URL = 'http://localhost:3001';

const api = {
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
};

export default api;
