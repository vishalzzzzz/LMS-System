import express from 'express';
import { signup, login, getProfile, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.post('/logout', protect, logout);

export default router;
