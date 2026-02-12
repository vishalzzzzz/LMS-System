import mongoose from 'mongoose';

const borrowSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrowDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date,
    default: null
  },
  numberOfDays: {
    type: Number,
    required: true
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  overdueDays: {
    type: Number,
    default: 0
  },
  overdueAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Returned', 'Overdue'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Calculate overdue before saving
borrowSchema.pre('save', function(next) {
  if (this.status === 'Returned' && this.returnDate) {
    const dueDate = new Date(this.dueDate);
    const returnDate = new Date(this.returnDate);
    
    if (returnDate > dueDate) {
      const diffTime = Math.abs(returnDate - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.overdueDays = diffDays;
      this.overdueAmount = diffDays * this.pricePerDay * 0.5; // 50% of price per day as overdue fee
    }
    this.totalAmount = this.totalCost + this.overdueAmount;
  }
  next();
});

const Borrow = mongoose.model('Borrow', borrowSchema);

export default Borrow;
