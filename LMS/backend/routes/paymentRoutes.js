import express from 'express';
import { getPaymentHistory, markPaymentAsPaid } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/history', protect, getPaymentHistory);
router.post('/:paymentId/pay', protect, markPaymentAsPaid);

export default router;
