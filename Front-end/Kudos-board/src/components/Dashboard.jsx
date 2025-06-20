import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SearchBar from './ui/SearchBar';
import CategoryFilter from './ui/CategoryFilter';
import ThemeToggle from './ui/ThemeToggle';

function Dashboard({ boards, setBoards, activeFilter, setActiveFilter, loading }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBoards = boards
    .filter(board => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'recent') {
        const createdAt = board.createdAt ? new Date(board.createdAt) : null;
        if (!createdAt) return false;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return createdAt >= sevenDaysAgo;
      }
      return board.category === activeFilter;
    })
    .filter(board => {
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      return (
        board.title.toLowerCase().includes(query) ||
        board.description.toLowerCase().includes(query) ||
        board.author.toLowerCase().includes(query)
      );
    });

  return (
    <div className="home-page">
      <header className="banner">
        <img
          src="https://kudos-board-exemplar-bck7.onrender.com/static/media/kudoboard_logo.5a582f09c55bf7a5c8cc.png"
          alt="Kudos Board Logo"
          className="dashboard-logo"
        />
        <ThemeToggle />
      </header>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <CategoryFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

      <div className="center-button-container">
        <Link to="/create-board" className="create-button">Create New Board</Link>
      </div>

      <section className="board-grid">
        {loading ? (
          <div className="loading">Loading boards...</div>
        ) : filteredBoards.length > 0 ? (
          filteredBoards.map(board => (
            <div key={board.id} className="board-preview">
              <img src={board.image} alt={board.title} />
              <h3>{board.title}</h3>
              <p>{board.category}</p>
              <Link to={`/board/${board.id}`} className="button-common view-board">View Board</Link>
              <button
                className="button-common delete-board"
                onClick={async () => {
                  try {
                    await api.deleteBoard(board.id);
                    const updatedBoards = boards.filter(b => b.id !== board.id);
                    setBoards(updatedBoards);
                  } catch (error) {
                    console.error('Error deleting board:', error);
                    alert('Failed to delete board. Please try again.');
                  }
                }}
              >
                Delete Board
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h2>No boards found</h2>
            <p>Create a new board to get started!</p>
          </div>
        )}
      </section>

      <footer>
        <p> Kudos Board © 2025</p>
      </footer>
    </div>
  );
}

export default Dashboard;
