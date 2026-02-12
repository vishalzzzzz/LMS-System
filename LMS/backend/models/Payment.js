import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  borrow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Borrow',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  paymentDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
