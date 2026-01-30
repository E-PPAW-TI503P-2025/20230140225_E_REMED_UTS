const express = require('express');
const router = express.Router();
const { checkRole, checkUser } = require('../middleware/auth');
const {
  borrowBook,
  getBorrowHistory
} = require('../controllers/borrowController');

// User routes (require both role and user ID)
router.post('/', checkRole('user'), checkUser, borrowBook);
router.get('/history', checkRole('user'), checkUser, getBorrowHistory);

module.exports = router;