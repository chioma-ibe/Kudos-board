import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function CreateBoard({ setBoards }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('celebration');
  const [image, setImage] = useState('');
  const [author, setAuthor] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (image && !image.match(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i)) {
      newErrors.image = 'Please enter a valid image URL (ending with png, jpg, jpeg, gif, or webp)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormFeedback('');

    if (validateForm()) {
      try {
        const boardData = {
          title,
          description,
          category,
          image: image || `https://source.unsplash.com/random/300x200/?${category}`,
          author: author || 'Anonymous'
        };

        const newBoard = await api.createBoard(boardData);

        setBoards(prevBoards => [newBoard, ...prevBoards]);

        setFormFeedback('Board created successfully!');

        setTitle('');
        setDescription('');
        setCategory('celebration');
        setImage('');
        setAuthor('');

        setTimeout(() => {
          navigate('/');
        }, 1000);
      } catch (error) {
        console.error('Error creating board:', error);
        setFormFeedback('Error creating board. Please try again.');
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="create-board">
      <h1>Create New Kudos Board</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
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
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
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
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="celebration">Celebration</option>
            <option value="thank_you">Thank You</option>
            <option value="inspiration">Inspiration</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL *</label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
              if (errors.image) {
                setErrors({...errors, image: ''});
              }
            }}
            className={errors.image ? 'input-error' : ''}
            placeholder="Leave blank for random image"
          />
          {errors.image && <div className="error-message">{errors.image}</div>}
          {image && <img src={image} alt="Preview" className="image-preview" />}
        </div>

        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Anonymous"
          />
        </div>

        {formFeedback && (
          <div className={`form-feedback ${formFeedback.includes('Error') ? 'error' : 'success'}`}>
            {formFeedback}
          </div>
        )}

        <div className="form-actions">
          <Link to="/" className="cancel-button">Cancel</Link>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Board'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateBoard;
