const { Book, BorrowLog } = require('../models');

// Borrow a book
const borrowBook = async (req, res) => {
  try {
    const { bookId, latitude, longitude } = req.body;
    const userId = req.userId;
    
    // Validation
    if (!bookId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ 
        error: 'bookId, latitude, dan longitude harus diisi' 
      });
    }
    
    // Check if coordinates are valid
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({ 
        error: 'Koordinat tidak valid' 
      });
    }
    
    // Find the book
    const book = await Book.findByPk(bookId);
    
    if (!book) {
      return res.status(404).json({ error: 'Buku tidak ditemukan' });
    }
    
    // Check stock
    if (book.stock <= 0) {
      return res.status(400).json({ error: 'Stok buku habis' });
    }
    
    // Create transaction
    await Book.sequelize.transaction(async (t) => {
      // Reduce book stock
      await book.decrement('stock', { by: 1, transaction: t });
      
      // Create borrow log
      const borrowLog = await BorrowLog.create({
        userId,
        bookId,
        latitude,
        longitude,
        borrowDate: new Date()
      }, { transaction: t });
      
      res.status(201).json({
        message: 'Buku berhasil dipinjam',
        borrowLog,
        remainingStock: book.stock - 1
      });
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get borrow history (Optional enhancement)
const getBorrowHistory = async (req, res) => {
  try {
    const userId = req.userId;
    
    const borrowLogs = await BorrowLog.findAll({
      where: { userId },
      include: [{
        model: Book,
        attributes: ['id', 'title', 'author']
      }],
      order: [['borrowDate', 'DESC']]
    });
    
    res.json(borrowLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  borrowBook,
  getBorrowHistory
};