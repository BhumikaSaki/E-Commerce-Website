import express from 'express';
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.route('/').post(protect, asyncHandler(createOrder)).get(protect, admin, asyncHandler(getOrders));
router.route('/myorders').get(protect, asyncHandler(getMyOrders));
router.route('/:id').get(protect, asyncHandler(getOrderById));
router.route('/:id/pay').put(protect, asyncHandler(updateOrderToPaid));

export default router;
