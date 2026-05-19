import User from '../models/User.js';
import Product from '../models/Product.js';
import { configureCloudinary } from '../config/cloudinary.js';
import { uploadImageBuffer, deleteImage } from '../services/cloudinaryService.js';
import { formatUser } from '../utils/userResponse.js';
import { normalizeEmail, normalizePhone } from '../utils/authHelpers.js';

export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.body.name) user.name = req.body.name.trim();

  if (req.body.email) {
    const email = normalizeEmail(req.body.email);
    const taken = await User.findOne({ email, _id: { $ne: user._id } });
    if (taken) {
      return res.status(400).json({ message: 'Email is already in use' });
    }
    user.email = email;
  }

  if (req.body.phone) {
    const phone = normalizePhone(req.body.phone);
    if (!phone) {
      return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
    }
    const taken = await User.findOne({ phone, _id: { $ne: user._id } });
    if (taken) {
      return res.status(400).json({ message: 'Phone number is already in use' });
    }
    user.phone = phone;
  }

  if (req.body.countryCode) user.countryCode = req.body.countryCode.trim();

  const updated = await user.save();
  res.json(formatUser(updated));
};

export const uploadProfilePhoto = async (req, res) => {
  if (!configureCloudinary()) {
    return res.status(503).json({
      message: 'Cloudinary is not configured. Add CLOUDINARY_* keys to server/.env',
    });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.avatarPublicId) {
    await deleteImage(user.avatarPublicId);
  }

  const result = await uploadImageBuffer(req.file.buffer, 'shopby/avatars');
  user.avatar = result.secure_url;
  user.avatarPublicId = result.public_id;
  await user.save();

  res.json({
    message: 'Profile photo updated',
    avatar: user.avatar,
    user: formatUser(user),
  });
};

export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json(user?.wishlist || []);
};

export const addToWishlist = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const user = await User.findById(req.user._id);
  if (user.wishlist.some((id) => id.toString() === product._id.toString())) {
    return res.status(400).json({ message: 'Product already in wishlist' });
  }

  user.wishlist.push(product._id);
  await user.save();
  const populated = await User.findById(user._id).populate('wishlist');
  res.status(201).json(populated.wishlist);
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password updated successfully' });
};

export const removeFromWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.productId);
  await user.save();
  const populated = await User.findById(user._id).populate('wishlist');
  res.json(populated.wishlist);
};
