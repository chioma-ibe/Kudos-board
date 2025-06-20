const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const validateBoardData = (req, res, next) => {
  const { title, description, category, image, author } = req.body;
  const errors = [];

  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }

  if (!description || description.trim() === '') {
    errors.push('Description is required');
  }

  if (!category || !['celebration', 'thank_you', 'inspiration'].includes(category)) {
    errors.push('Valid category is required (celebration, thank_you, or inspiration)');
  }

  if (!image || image.trim() === '') {
    errors.push('Image URL is required');
  }

  if (!author || author.trim() === '') {
    errors.push('Author name is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateCardData = (req, res, next) => {
  const { title, description, gif, author } = req.body;
  const errors = [];

  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }

  if (!description || description.trim() === '') {
    errors.push('Description is required');
  }

  if (!gif || gif.trim() === '') {
    errors.push('GIF URL is required');
  }

  if (!author || author.trim() === '') {
    errors.push('Author name is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateIdParam = (req, res, next) => {
  const paramName = req.params.id ? 'id' : 'cardId';
  const id = parseInt(req.params[paramName]);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  req.parsedId = id;
  next();
};

const validateBoardIdParam = (req, res, next) => {
  const boardId = parseInt(req.params.boardId);
  if (isNaN(boardId)) {
    return res.status(400).json({ error: 'Invalid board ID format' });
  }
  req.parsedBoardId = boardId;
  next();
};

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to Kudos Board by Chioma' });
});

app.get('/boards', async (_, res) => {
  try {
    const boards = await prisma.board.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(boards);
  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
});

app.get('/boards/:id', validateIdParam, async (req, res) => {
  try {
    const board = await prisma.board.findUnique({
      where: { id: req.parsedId },
      include: { cards: true }
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.json(board);
  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({ error: 'Failed to fetch board' });
  }
});

app.post('/boards', validateBoardData, async (req, res) => {
  try {
    const { title, description, category, image, author } = req.body;
    const newBoard = await prisma.board.create({
      data: {
        title,
        description,
        category,
        image,
        author
      }
    });
    res.status(201).json(newBoard);
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({ error: 'Failed to create board' });
  }
});

app.put('/boards/:id', validateIdParam, validateBoardData, async (req, res) => {
  try {
    const { title, description, category, image, author } = req.body;

    const existingBoard = await prisma.board.findUnique({
      where: { id: req.parsedId }
    });

    if (!existingBoard) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const updatedBoard = await prisma.board.update({
      where: { id: req.parsedId },
      data: {
        title,
        description,
        category,
        image,
        author
      }
    });

    res.json(updatedBoard);
  } catch (error) {
    console.error('Error updating board:', error);
    res.status(500).json({ error: 'Failed to update board' });
  }
});

app.delete('/boards/:id', validateIdParam, async (req, res) => {
  try {
    const existingBoard = await prisma.board.findUnique({
      where: { id: req.parsedId }
    });

    if (!existingBoard) {
      return res.status(404).json({ error: 'Board not found' });
    }

    await prisma.board.delete({
      where: { id: req.parsedId }
    });

    res.status(200).json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

app.get('/cards', async (_, res) => {
  try {
    const cards = await prisma.card.findMany({
      orderBy: { boardId: 'asc' }
    });
    res.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

app.get('/cards/:id', validateIdParam, async (req, res) => {
  try {
    const card = await prisma.card.findUnique({
      where: { id: req.parsedId }
    });

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json(card);
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({ error: 'Failed to fetch card' });
  }
});

app.post('/boards/:boardId/cards', validateBoardIdParam, validateCardData, async (req, res) => {
  try {
    const { title, description, gif, author } = req.body;

    const existingBoard = await prisma.board.findUnique({
      where: { id: req.parsedBoardId }
    });

    if (!existingBoard) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const newCard = await prisma.card.create({
      data: {
        title,
        description,
        gif,
        author,
        boardId: req.parsedBoardId
      }
    });

    res.status(201).json(newCard);
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ error: 'Failed to create card' });
  }
});

app.put('/cards/:id', validateIdParam, validateCardData, async (req, res) => {
  try {
    const { title, description, gif, author } = req.body;

    const existingCard = await prisma.card.findUnique({
      where: { id: req.parsedId }
    });

    if (!existingCard) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const updatedCard = await prisma.card.update({
      where: { id: req.parsedId },
      data: {
        title,
        description,
        gif,
        author
      }
    });

    res.json(updatedCard);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

app.put('/cards/:id/vote', validateIdParam, async (req, res) => {
  try {
    const existingCard = await prisma.card.findUnique({
      where: { id: req.parsedId }
    });

    if (!existingCard) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const updatedCard = await prisma.card.update({
      where: { id: req.parsedId },
      data: { votes: { increment: 1 } }
    });

    res.json(updatedCard);
  } catch (error) {
    console.error('Error updating vote:', error);
    res.status(500).json({ error: 'Failed to update vote' });
  }
});


app.delete('/cards/:id', validateIdParam, async (req, res) => {
  try {
    const existingCard = await prisma.card.findUnique({
      where: { id: req.parsedId }
    });

    if (!existingCard) {
      return res.status(404).json({ error: 'Card not found' });
    }

    await prisma.card.delete({
      where: { id: req.parsedId }
    });

    res.status(200).json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ error: 'Failed to delete card' });
  }
});


app.get('/cards/:cardId/comments', validateIdParam, async (req, res) => {
  try {
    const cardId = req.parsedId;

    const card = await prisma.card.findUnique({
      where: { id: cardId }
    });

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const comments = await prisma.comment.findMany({
      where: { cardId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

const validateCommentData = (req, res, next) => {
  const { message } = req.body;
  const errors = [];

  if (!message || message.trim() === '') {
    errors.push('Message is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

app.post('/cards/:cardId/comments', validateIdParam, validateCommentData, async (req, res) => {
  try {
    const cardId = req.parsedId;
    const { message, author } = req.body;


    const card = await prisma.card.findUnique({
      where: { id: cardId }
    });

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const newComment = await prisma.comment.create({
      data: {
        message,
        author: author || null,
        cardId
      }
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

app.delete('/comments/:id', validateIdParam, async (req, res) => {
  try {
    const commentId = req.parsedId;

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await prisma.comment.delete({
      where: { id: commentId }
    });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Error starting server:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try a different port.`);
  }
});
