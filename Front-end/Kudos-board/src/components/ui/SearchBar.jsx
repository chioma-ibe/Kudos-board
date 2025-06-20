import React from 'react';

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <main className="search">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search boards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button className="search-button">
          Search
        </button>
        {searchQuery && (
          <button
            className="clear-button"
            onClick={() => setSearchQuery('')}
          >
            Clear
          </button>
        )}
      </div>
    </main>
  );
}

export default SearchBar;
