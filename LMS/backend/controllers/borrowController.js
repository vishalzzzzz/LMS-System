import Borrow from '../models/Borrow.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';

const MAX_BORROW_DAYS = 30;

// @desc    Validate if user can borrow
// @route   POST /api/borrow/validate
// @access  Private
export const validateBorrow = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide book ID'
      });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if book is available
    if (!book.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing'
      });
    }

    // Check if user has active borrow
    const user = await User.findById(userId);
    if (user.hasActiveBorrow) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active borrow. Please return it first.'
      });
    }

    // Check if user has debt
    if (user.totalDebt > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have outstanding debt. Please clear it before borrowing.'
      });
    }

    res.json({
      success: true,
      message: 'You can borrow this book',
      book: {
        id: book._id,
        title: book.title,
        author: book.author,
        pricePerDay: book.pricePerDay
      }
    });
  } catch (error) {
    console.error('Validate borrow error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating borrow',
      error: error.message
    });
  }
};

// @desc    Calculate borrow cost
// @route   POST /api/borrow/calculate
// @access  Private
export const calculateCost = async (req, res) => {
  try {
    const { bookId, numberOfDays } = req.body;

    if (!bookId || !numberOfDays) {
      return res.status(400).json({
        success: false,
        message: 'Please provide book ID and number of days'
      });
    }

    if (numberOfDays <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Number of days must be greater than 0'
      });
    }

    if (numberOfDays > MAX_BORROW_DAYS) {
      return res.status(400).json({
        success: false,
        message: `Maximum borrow period is ${MAX_BORROW_DAYS} days`
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const totalCost = book.pricePerDay * numberOfDays;

    res.json({
      success: true,
      calculation: {
        bookTitle: book.title,
        pricePerDay: book.pricePerDay,
        numberOfDays: parseInt(numberOfDays),
        totalCost: totalCost.toFixed(2),
        maxBorrowDays: MAX_BORROW_DAYS
      }
    });
  } catch (error) {
    console.error('Calculate cost error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating cost',
      error: error.message
    });
  }
};

// @desc    Borrow a book
// @route   POST /api/borrow
// @access  Private
export const borrowBook = async (req, res) => {
  try {
    const { bookId, numberOfDays } = req.body;
    const userId = req.user._id;

    // Validation
    if (!bookId || !numberOfDays) {
      return res.status(400).json({
        success: false,
        message: 'Please provide book ID and number of days'
      });
    }

    if (numberOfDays <= 0 || numberOfDays > MAX_BORROW_DAYS) {
      return res.status(400).json({
        success: false,
        message: `Number of days must be between 1 and ${MAX_BORROW_DAYS}`
      });
    }

    const book = await Book.findById(bookId);
    const user = await User.findById(userId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (!book.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available'
      });
    }

    if (user.hasActiveBorrow) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active borrow'
      });
    }

    if (user.totalDebt > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please clear your debt first'
      });
    }

    // Calculate dates and cost
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(numberOfDays));
    
    const totalCost = book.pricePerDay * numberOfDays;

    // Create borrow record
    const borrow = await Borrow.create({
      user: userId,
      book: bookId,
      borrowDate,
      dueDate,
      numberOfDays: parseInt(numberOfDays),
      pricePerDay: book.pricePerDay,
      totalCost,
      totalAmount: totalCost,
      status: 'Active'
    });

    // Update book
    book.isAvailable = false;
    book.currentBorrower = userId;
    await book.save();

    // Update user
    user.hasActiveBorrow = true;
    user.totalDebt += totalCost;
    await user.save();

    // Create pending payment
    await Payment.create({
      user: userId,
      borrow: borrow._id,
      amount: totalCost,
      status: 'Pending'
    });

    const populatedBorrow = await Borrow.findById(borrow._id)
      .populate('book', 'title author bookId')
      .populate('user', 'name email studentId');

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      borrow: populatedBorrow
    });
  } catch (error) {
    console.error('Borrow book error:', error);
    res.status(500).json({
      success: false,
      message: 'Error borrowing book',
      error: error.message
    });
  }
};

// @desc    Get active borrows for user
// @route   GET /api/borrows/active
// @access  Private
export const getActiveBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({
      user: req.user._id,
      status: 'Active'
    })
      .populate('book', 'title author bookId pricePerDay')
      .sort({ borrowDate: -1 });

    res.json({
      success: true,
      count: borrows.length,
      borrows
    });
  } catch (error) {
    console.error('Get active borrows error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active borrows',
      error: error.message
    });
  }
};

// @desc    Get borrow summary by ID
// @route   GET /api/borrows/:borrowId/summary
// @access  Private
export const getBorrowSummary = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.borrowId)
      .populate('book', 'title author bookId pricePerDay')
      .populate('user', 'name email studentId');

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found'
      });
    }

    // Check authorization
    if (borrow.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this borrow record'
      });
    }

    res.json({
      success: true,
      borrow
    });
  } catch (error) {
    console.error('Get borrow summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching borrow summary',
      error: error.message
    });
  }
};

// @desc    Submit/Return borrowed book
// @route   POST /api/borrows/:borrowId/submit
// @access  Private
export const submitReturn = async (req, res) => {
  try {
    const { returnDate } = req.body;
    const borrowId = req.params.borrowId;

    if (!returnDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide return date'
      });
    }

    const borrow = await Borrow.findById(borrowId).populate('book');

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found'
      });
    }

    // Check authorization
    if (borrow.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to return this book'
      });
    }

    if (borrow.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'This borrow is already returned'
      });
    }

    // Update borrow record
    borrow.returnDate = new Date(returnDate);
    borrow.status = 'Returned';

    // Calculate overdue if applicable
    const dueDate = new Date(borrow.dueDate);
    const actualReturnDate = new Date(returnDate);

    if (actualReturnDate > dueDate) {
      const diffTime = Math.abs(actualReturnDate - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      borrow.overdueDays = diffDays;
      borrow.overdueAmount = diffDays * borrow.pricePerDay * 0.5; // 50% overdue fee
      borrow.totalAmount = borrow.totalCost + borrow.overdueAmount;
      borrow.status = 'Overdue';
    }

    await borrow.save();

    // Update book
    const book = await Book.findById(borrow.book._id);
    book.isAvailable = true;
    book.currentBorrower = null;
    await book.save();

    // Update user
    const user = await User.findById(borrow.user);
    user.hasActiveBorrow = false;
    await user.save();

    // Update payment
    const payment = await Payment.findOne({ borrow: borrowId });
    if (payment) {
      payment.amount = borrow.totalAmount;
      await payment.save();
    }

    const updatedBorrow = await Borrow.findById(borrowId)
      .populate('book', 'title author bookId')
      .populate('user', 'name email studentId');

    res.json({
      success: true,
      message: 'Book returned successfully',
      borrow: updatedBorrow
    });
  } catch (error) {
    console.error('Submit return error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting return',
      error: error.message
    });
  }
};

// @desc    Get borrow history
// @route   GET /api/borrows/history
// @access  Private
export const getBorrowHistory = async (req, res) => {
  try {
    const borrows = await Borrow.find({
      user: req.user._id,
      status: { $in: ['Returned', 'Overdue'] }
    })
      .populate('book', 'title author bookId')
      .sort({ returnDate: -1 });

    res.json({
      success: true,
      count: borrows.length,
      borrows
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching history',
      error: error.message
    });
  }
};
