import express from 'express';
import {
  updateUserProfile,
  uploadProfilePhoto,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { uploadAvatar, handleMulterError } from '../middleware/upload.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.use(protect);

router.put('/profile', asyncHandler(updateUserProfile));
router.post(
  '/avatar',
  (req, res, next) => {
    uploadAvatar(req, res, (err) => {
      if (err) return handleMulterError(err, req, res, next);
      next();
    });
  },
  asyncHandler(uploadProfilePhoto)
);
router.get('/wishlist', asyncHandler(getWishlist));
router.post('/wishlist/:productId', asyncHandler(addToWishlist));
router.delete('/wishlist/:productId', asyncHandler(removeFromWishlist));

export default router;
