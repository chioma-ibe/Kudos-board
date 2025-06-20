import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import Modal from './ui/Modal';
import GiphySearch from './ui/GiphySearch';

function BoardDetail() {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCard, setNewCard] = useState({
    title: '',
    description: '',
    gif: '',
    author: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGiphySearchOpen, setIsGiphySearchOpen] = useState(false);

  const { id } = useParams();
  const boardId = parseInt(id);

  useEffect(() => {
    const fetchBoardDetails = async () => {
      try {
        setLoading(true);
        const data = await api.getBoardById(boardId);
        setBoard(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching board details:', err);
        setError('Failed to load board details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoardDetails();
  }, [boardId]);

  if (loading) {
    return <div className="loading">Loading board details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!board) {
    return <div className="not-found">Board not found</div>;
  }

  const validateCardForm = () => {
    const newErrors = {};

    if (!newCard.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (newCard.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!newCard.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (newCard.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (newCard.gif && !newCard.gif.match(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i)) {
      newErrors.gif = 'Please enter a valid image URL (ending with png, jpg, jpeg, gif, or webp)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormFeedback('');

    if (validateCardForm()) {
      try {
        const cardData = {
          title: newCard.title,
          description: newCard.description,
          gif: newCard.gif || 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDFtYXJlOGsyZWRnNnQxbWF1NWVxdWJxdWJnNnBnZWJnMWJlcXFtdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif',
          author: newCard.author || 'Anonymous'
        };

        const createdCard = await api.createCard(boardId, cardData);

        setBoard({
          ...board,
          cards: [...board.cards, createdCard]
        });

        setFormFeedback('Card added successfully!');

        setNewCard({
          title: '',
          description: '',
          gif: '',
          author: ''
        });

        setTimeout(() => {
          setFormFeedback('');
          setIsModalOpen(false);
        }, 2000);
      } catch (error) {
        console.error('Error adding card:', error);
        setFormFeedback('Error adding card. Please try again.');
      }
    }

    setIsSubmitting(false);
  };

  const handleUpvote = async (cardId) => {
    try {
      const updatedCard = await api.voteCard(cardId);

      setBoard({
        ...board,
        cards: board.cards.map(card =>
          card.id === cardId ? { ...card, votes: updatedCard.votes } : card
        )
      });
    } catch (error) {
      console.error('Error upvoting card:', error);
      alert('Failed to upvote card. Please try again.');
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await api.deleteCard(cardId);

      setBoard({
        ...board,
        cards: board.cards.filter(card => card.id !== cardId)
      });
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Failed to delete card. Please try again.');
    }
  };

  return (
    <div className="board-detail">
      <div className="board-header">
        <h1>{board.title}</h1>
        <p>{board.description}</p>
        <p className="author">By: {board.author}</p>
        <Link to="/" className="back-button">Back to Dashboard</Link>
      </div>

      <div className="center-button-container">
        <button
          className="add-card-button"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Card
        </button>
      </div>

      <div className="cards-container">
        {board.cards.length > 0 ? (
          board.cards.map(card => (
            <div key={card.id} className="card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <img src={card.gif} alt="GIF" className="card-gif" />
              <p className="author">By: {card.author}</p>
              <div className="card-actions">
                <button
                  className="upvote-button"
                  onClick={() => handleUpvote(card.id)}
                >
                  👍 {card.votes}
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteCard(card.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h2>No cards yet</h2>
            <p>Add a card to get started!</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Card"
      >
        <form onSubmit={handleAddCard}>
          <div className="form-group">
            <label htmlFor="cardTitle">Title *</label>
            <input
              type="text"
              id="cardTitle"
              value={newCard.title}
              onChange={(e) => {
                setNewCard({...newCard, title: e.target.value});
                if (errors.title) {
                  setErrors({...errors, title: ''});
                }
              }}
              className={errors.title ? 'input-error' : ''}
              required
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="cardDescription">Description *</label>
            <textarea
              id="cardDescription"
              value={newCard.description}
              onChange={(e) => {
                setNewCard({...newCard, description: e.target.value});
                if (errors.description) {
                  setErrors({...errors, description: ''});
                }
              }}
              className={errors.description ? 'input-error' : ''}
              required
            />
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="cardGif">GIF URL *</label>
            <div className="gif-input-container">
              <input
                type="text"
                id="cardGif"
                value={newCard.gif}
                onChange={(e) => {
                  setNewCard({...newCard, gif: e.target.value});
                  if (errors.gif) {
                    setErrors({...errors, gif: ''});
                  }
                }}
                className={errors.gif ? 'input-error' : ''}
                placeholder="Paste GIF URL or click search button"
              />
              <button
                type="button"
                className="search-gif-button"
                onClick={() => setIsGiphySearchOpen(true)}
              >
                Find GIFs
              </button>
            </div>
            {errors.gif && <div className="error-message">{errors.gif}</div>}
            {newCard.gif && <img src={newCard.gif} alt="Preview" className="gif-preview" />}
          </div>

          <div className="form-group">
            <label htmlFor="cardAuthor">Author</label>
            <input
              type="text"
              id="cardAuthor"
              value={newCard.author}
              onChange={(e) => setNewCard({...newCard, author: e.target.value})}
              placeholder="Anonymous"
            />
          </div>

          {formFeedback && (
            <div className={`form-feedback ${formFeedback.includes('Error') ? 'error' : 'success'}`}>
              {formFeedback}
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Card'}
          </button>
        </form>
      </Modal>

      {isGiphySearchOpen && (
        <Modal
          isOpen={isGiphySearchOpen}
          onClose={() => setIsGiphySearchOpen(false)}
          title="Search for a GIF"
        >
          <GiphySearch
            onSelect={(gifUrl) => {
              setNewCard({...newCard, gif: gifUrl});
              setIsGiphySearchOpen(false);
              if (errors.gif) {
                setErrors({...errors, gif: ''});
              }
            }}
            onClose={() => setIsGiphySearchOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default BoardDetail;
