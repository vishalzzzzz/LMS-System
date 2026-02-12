import Borrow from '../models/Borrow.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get active borrows count
    const activeBorrows = await Borrow.countDocuments({
      user: userId,
      status: 'Active'
    });

    // Get total amount due (pending payments)
    const pendingPayments = await Payment.find({
      user: userId,
      status: 'Pending'
    });

    const totalAmountDue = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0);

    // Get history count
    const historyCount = await Borrow.countDocuments({
      user: userId,
      status: { $in: ['Returned', 'Overdue'] }
    });

    // Get user balance and debt
    const user = await User.findById(userId);

    // Get recent borrows
    const recentBorrows = await Borrow.find({ user: userId })
      .populate('book', 'title author')
      .sort({ borrowDate: -1 })
      .limit(5);

    // Get overdue count
    const overdueCount = await Borrow.countDocuments({
      user: userId,
      status: 'Overdue'
    });

    res.json({
      success: true,
      summary: {
        activeBorrows,
        totalAmountDue: totalAmountDue.toFixed(2),
        balance: user.balance.toFixed(2),
        totalDebt: user.totalDebt.toFixed(2),
        historyCount,
        overdueCount,
        recentBorrows,
        hasActiveBorrow: user.hasActiveBorrow
      }
    });
  } catch (error) {
    console.error('Get dashboard summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard summary',
      error: error.message
    });
  }
};
