import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchSuggestions,
} from '../controllers/productController.js';
import { createProductReview } from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/auth.js';
import ensureDB from '../middleware/ensureDB.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.use(ensureDB);

router.get('/search/suggest', asyncHandler(searchSuggestions));
router.route('/').get(asyncHandler(getProducts)).post(protect, admin, asyncHandler(createProduct));
router.route('/:id/reviews').post(protect, asyncHandler(createProductReview));
router
  .route('/:id')
  .get(asyncHandler(getProductById))
  .put(protect, admin, asyncHandler(updateProduct))
  .delete(protect, admin, asyncHandler(deleteProduct));

export default router;
