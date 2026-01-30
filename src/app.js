const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const { sequelize } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.static('public')); // ← TAMBAH BARIS INI
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
(async () => {
  try {
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('✓ Database connection OK');
    
    // Sync database
    console.log('Syncing database tables...');
    await sequelize.sync({ force: false });
    console.log('✓ Database tables synced');
    
    // Tambah sample data
    const Book = require('./models/Book');
    const bookCount = await Book.count();
    if (bookCount === 0) {
      await Book.bulkCreate([
        { title: 'Harry Potter', author: 'J.K. Rowling', stock: 5 },
        { title: 'The Hobbit', author: 'J.R.R. Tolkien', stock: 3 },
        { title: 'Clean Code', author: 'Robert C. Martin', stock: 7 },
        { title: 'The Pragmatic Programmer', author: 'David Thomas, Andrew Hunt', stock: 4 },
        { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', stock: 6 }
      ]);
      console.log('✓ Sample books added');
    }
  } catch (error) {
    console.error('✗ Database error:', error.message);
  }
})();

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Library Management API is running',
    database: 'Check console for status',
    frontend: 'Visit /index.html for web interface'
  });
});

// Database health endpoint
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      database: 'Connected',
      status: 'Healthy'
    });
  } catch (error) {
    res.status(500).json({ 
      database: 'Disconnected',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: err.message || 'Something went wrong!',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;