import Book from '../models/Book.js';

// Hardcoded 20 books data
const booksData = [
  { bookId: 'B001', title: 'To Kill a Mockingbird', author: 'Harper Lee', pricePerDay: 2.5, groupPricePerDay: 1.8 },
  { bookId: 'B002', title: '1984', author: 'George Orwell', pricePerDay: 3.0, groupPricePerDay: 2.2 },
  { bookId: 'B003', title: 'Pride and Prejudice', author: 'Jane Austen', pricePerDay: 2.0, groupPricePerDay: 1.5 },
  { bookId: 'B004', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', pricePerDay: 2.8, groupPricePerDay: 2.0 },
  { bookId: 'B005', title: 'Moby Dick', author: 'Herman Melville', pricePerDay: 3.5, groupPricePerDay: 2.5 },
  { bookId: 'B006', title: 'War and Peace', author: 'Leo Tolstoy', pricePerDay: 4.0, groupPricePerDay: 3.0 },
  { bookId: 'B007', title: 'The Catcher in the Rye', author: 'J.D. Salinger', pricePerDay: 2.5, groupPricePerDay: 1.8 },
  { bookId: 'B008', title: 'The Hobbit', author: 'J.R.R. Tolkien', pricePerDay: 3.0, groupPricePerDay: 2.3 },
  { bookId: 'B009', title: 'Fahrenheit 451', author: 'Ray Bradbury', pricePerDay: 2.7, groupPricePerDay: 2.0 },
  { bookId: 'B010', title: 'Jane Eyre', author: 'Charlotte Bronte', pricePerDay: 2.5, groupPricePerDay: 1.8 },
  { bookId: 'B011', title: 'Animal Farm', author: 'George Orwell', pricePerDay: 2.2, groupPricePerDay: 1.6 },
  { bookId: 'B012', title: 'Brave New World', author: 'Aldous Huxley', pricePerDay: 2.8, groupPricePerDay: 2.1 },
  { bookId: 'B013', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', pricePerDay: 4.5, groupPricePerDay: 3.5 },
  { bookId: 'B014', title: 'Wuthering Heights', author: 'Emily Bronte', pricePerDay: 2.6, groupPricePerDay: 1.9 },
  { bookId: 'B015', title: 'The Chronicles of Narnia', author: 'C.S. Lewis', pricePerDay: 3.2, groupPricePerDay: 2.4 },
  { bookId: 'B016', title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', pricePerDay: 3.8, groupPricePerDay: 2.8 },
  { bookId: 'B017', title: 'The Odyssey', author: 'Homer', pricePerDay: 3.5, groupPricePerDay: 2.6 },
  { bookId: 'B018', title: 'Great Expectations', author: 'Charles Dickens', pricePerDay: 2.9, groupPricePerDay: 2.2 },
  { bookId: 'B019', title: 'Hamlet', author: 'William Shakespeare', pricePerDay: 3.0, groupPricePerDay: 2.3 },
  { bookId: 'B020', title: 'The Divine Comedy', author: 'Dante Alighieri', pricePerDay: 4.2, groupPricePerDay: 3.2 }
];

// Initialize books in database
export const initializeBooks = async () => {
  try {
    const count = await Book.countDocuments();
    if (count === 0) {
      await Book.insertMany(booksData);
      console.log('📚 Books initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing books:', error);
  }
};

// @desc    Get all books
// @route   GET /api/books
// @access  Private
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('currentBorrower', 'name studentId');

    res.json({
      success: true,
      count: books.length,
      books
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching books',
      error: error.message
    });
  }
};

// @desc    Get available books
// @route   GET /api/books/available
// @access  Private
export const getAvailableBooks = async (req, res) => {
  try {
    const books = await Book.find({ isAvailable: true });

    res.json({
      success: true,
      count: books.length,
      books
    });
  } catch (error) {
    console.error('Get available books error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available books',
      error: error.message
    });
  }
};

// @desc    Get book by ID
// @route   GET /api/books/:bookId
// @access  Private
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId).populate('currentBorrower', 'name studentId');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      book
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching book',
      error: error.message
    });
  }
};
