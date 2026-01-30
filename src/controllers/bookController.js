const { Book } = require('../models');

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: 'Buku tidak ditemukan' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new book (Admin only)
const createBook = async (req, res) => {
  try {
    const { title, author, stock } = req.body;
    
    // Validation
    if (!title || !author) {
      return res.status(400).json({ error: 'Title dan author tidak boleh kosong' });
    }
    
    const newBook = await Book.create({
      title,
      author,
      stock: stock || 1
    });
    
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update book (Admin only)
const updateBook = async (req, res) => {
  try {
    const { title, author, stock } = req.body;
    const book = await Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: 'Buku tidak ditemukan' });
    }
    
    // Validation
    if (title === '' || author === '') {
      return res.status(400).json({ error: 'Title dan author tidak boleh kosong' });
    }
    
    await book.update({
      title: title || book.title,
      author: author || book.author,
      stock: stock !== undefined ? stock : book.stock
    });
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete book (Admin only)
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: 'Buku tidak ditemukan' });
    }
    
    await book.destroy();
    res.json({ message: 'Buku berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};