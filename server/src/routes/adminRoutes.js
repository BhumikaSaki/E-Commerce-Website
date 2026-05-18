import express from 'express';
import { getAdminStats, getUsersPaginated, getOrdersPaginated } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.use(protect, admin);

router.get('/stats', asyncHandler(getAdminStats));
router.get('/users', asyncHandler(getUsersPaginated));
router.get('/orders', asyncHandler(getOrdersPaginated));

export default router;
