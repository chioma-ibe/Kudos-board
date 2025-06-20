import { useState, useEffect } from 'react';
import api from '../../services/api';
import './GiphySearch.css';

function GiphySearch({ onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchTrendingGifs = async () => {
      try {
        setLoading(true);
        const trendingGifs = await api.getTrendingGifs();
        console.log('Trending GIFs loaded:', trendingGifs.length);
        setGifs(trendingGifs);
        setError(null);
      } catch (err) {
        console.error('Error fetching trending GIFs:', err);
        setError('Failed to load trending GIFs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingGifs();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      const searchResults = await api.searchGifs(searchTerm);
      console.log('Search results:', searchResults.length);
      setGifs(searchResults);
      setError(null);
    } catch (err) {
      console.error('Error searching GIFs:', err);
      setError('Failed to search GIFs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGifSelect = (gif) => {
    console.log('Selected GIF:', gif.images.original.url);
    onSelect(gif.images.original.url);
    onClose();
  };

  return (
    <div className="giphy-search">
      <div className="giphy-search-header">
        <h3>Search for a GIF</h3>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type keywords to find GIFs..."
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Find GIFs'}
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="gifs-container">
        {loading ? (
          <div className="loading">Loading GIFs...</div>
        ) : gifs.length > 0 ? (
          <>
            <div className="gifs-header">
              {searchTerm ? 'Search results:' : 'Trending GIFs:'}
            </div>
            <div className="gifs-grid">
              {gifs.map((gif) => (
                <div
                  key={gif.id}
                  className="gif-item"
                  onClick={() => handleGifSelect(gif)}
                >
                  <img
                    src={gif.images.fixed_height.url}
                    alt={gif.title}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-results">No GIFs found. Try a different search term.</div>
        )}
      </div>
    </div>
  );
}

export default GiphySearch;
