import { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '../../services/api';

function CardDetailsModal({ isOpen, onClose, card }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ message: '', author: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState('');

  useEffect(() => {
    if (isOpen && card) {
      fetchComments();
    }
  }, [isOpen, card]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await api.getComments(card.id);
      setComments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.message.trim()) {
      setFormFeedback('Comment message is required.');
      return;
    }

    setIsSubmitting(true);
    setFormFeedback('');

    try {
      const commentData = {
        message: newComment.message,
        author: newComment.author.trim() || null
      };

      const createdComment = await api.addComment(card.id, commentData);

      setComments([createdComment, ...comments]);
      setNewComment({ message: '', author: '' });
      setFormFeedback('Comment added successfully!');

      setTimeout(() => {
        setFormFeedback('');
      }, 2000);
    } catch (error) {
      console.error('Error adding comment:', error);
      setFormFeedback('Error adding comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!card) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={card.title}>
      <div className="card-details">
        <div className="card-content">
          <p className="card-description">{card.description}</p>
          <img src={card.gif} alt="Card GIF" className="card-details-gif" />
          <p className="card-author">By: {card.author}</p>
          <p className="card-votes">👍 {card.votes} votes</p>
        </div>

        <div className="comments-section">
          <h3>Comments</h3>

          <form onSubmit={handleSubmit} className="comment-form">
            <div className="form-group">
              <label htmlFor="commentMessage">Message *</label>
              <textarea
                id="commentMessage"
                value={newComment.message}
                onChange={(e) => setNewComment({...newComment, message: e.target.value})}
                placeholder="Add a comment..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="commentAuthor">Your Name (optional)</label>
              <input
                type="text"
                id="commentAuthor"
                value={newComment.author}
                onChange={(e) => setNewComment({...newComment, author: e.target.value})}
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
              {isSubmitting ? 'Adding...' : 'Add Comment'}
            </button>
          </form>

          <div className="comments-list">
            {loading ? (
              <p>Loading comments...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.id} className="comment">
                  <p className="comment-message">{comment.message}</p>
                  <p className="comment-author">
                    By: {comment.author || 'Anonymous'}
                  </p>
                  <p className="comment-date">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default CardDetailsModal;
