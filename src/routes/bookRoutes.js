const express = require('express');
const router = express.Router();
const { checkRole } = require('../middleware/auth');
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

// Public routes
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// Admin routes
router.post('/', checkRole('admin'), createBook);
router.put('/:id', checkRole('admin'), updateBook);
router.delete('/:id', checkRole('admin'), deleteBook);

module.exports = router;