import express from 'express';
import {
  validateBorrow,
  calculateCost,
  borrowBook,
  getActiveBorrows,
  getBorrowSummary,
  submitReturn,
  getBorrowHistory
} from '../controllers/borrowController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/validate', protect, validateBorrow);
router.post('/calculate', protect, calculateCost);
router.post('/', protect, borrowBook);
router.get('/active', protect, getActiveBorrows);
router.get('/history', protect, getBorrowHistory);
router.get('/:borrowId/summary', protect, getBorrowSummary);
router.post('/:borrowId/submit', protect, submitReturn);

export default router;
