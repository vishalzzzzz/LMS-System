import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  groupPricePerDay: {
    type: Number,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  currentBorrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
