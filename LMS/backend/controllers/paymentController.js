import Payment from '../models/Payment.js';

// @desc    Get payment history for user
// @route   GET /api/payments/history
// @access  Private
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate({
        path: 'borrow',
        populate: {
          path: 'book',
          select: 'title author bookId'
        }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history',
      error: error.message
    });
  }
};

// @desc    Mark payment as paid (simulate payment)
// @route   POST /api/payments/:paymentId/pay
// @access  Private
export const markPaymentAsPaid = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check authorization
    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay this payment'
      });
    }

    if (payment.status === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment is already paid'
      });
    }

    payment.status = 'Paid';
    payment.paymentDate = new Date();
    await payment.save();

    // Update user debt
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.user._id);
    user.totalDebt -= payment.amount;
    user.balance += payment.amount;
    await user.save();

    res.json({
      success: true,
      message: 'Payment marked as paid',
      payment
    });
  } catch (error) {
    console.error('Mark payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message
    });
  }
};
