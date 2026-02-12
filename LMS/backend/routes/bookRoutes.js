import express from 'express';
import { getAllBooks, getAvailableBooks, getBookById } from '../controllers/bookController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllBooks);
router.get('/available', protect, getAvailableBooks);
router.get('/:bookId', protect, getBookById);

export default router;
