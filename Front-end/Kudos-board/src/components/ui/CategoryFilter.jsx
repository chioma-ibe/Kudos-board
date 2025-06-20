import React from 'react';

function CategoryFilter({ activeFilter, setActiveFilter }) {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'recent', label: 'Recent' },
    { id: 'celebration', label: 'Celebration' },
    { id: 'thank_you', label: 'Thank You' },
    { id: 'inspiration', label: 'Inspiration' }
  ];

  return (
    <div className="category-buttons">
      {categories.map(category => (
        <button
          key={category.id}
          className={activeFilter === category.id ? 'active' : ''}
          onClick={() => setActiveFilter(category.id)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
