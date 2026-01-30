const { sequelize } = require('../config/database');
const Book = require('./Book');
const BorrowLog = require('./BorrowLog');

// Define associations
Book.hasMany(BorrowLog, { foreignKey: 'bookId' });
BorrowLog.belongsTo(Book, { foreignKey: 'bookId' });

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

module.exports = {
  sequelize,
  Book,
  BorrowLog,
  syncDatabase
};