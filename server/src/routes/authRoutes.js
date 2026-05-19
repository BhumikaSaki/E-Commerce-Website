import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter, forgotPasswordLimiter } from '../middleware/rateLimiter.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.post('/register', authLimiter, asyncHandler(registerUser));
router.post('/login', authLimiter, asyncHandler(loginUser));
router.post('/forgot-password', forgotPasswordLimiter, asyncHandler(forgotPassword));
router.put('/reset-password/:token', authLimiter, asyncHandler(resetPassword));
router.get('/profile', protect, asyncHandler(getUserProfile));

export default router;
