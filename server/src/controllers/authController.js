import crypto from 'crypto';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { formatUser } from '../utils/userResponse.js';
import { normalizeEmail, normalizePhone } from '../utils/authHelpers.js';
import { sendPasswordResetEmail } from '../services/emailService.js';

export const registerUser = async (req, res) => {
  const { name, password, countryCode = '+91' } = req.body;
  const email = normalizeEmail(req.body.email);
  const phone = normalizePhone(req.body.phone);

  if (!name?.trim()) {
    return res.status(400).json({ message: 'Name is required' });
  }
  if (!email) {
    return res.status(400).json({ message: 'Valid email is required' });
  }
  if (!phone) {
    return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).json({ message: 'An account with this email already exists' });
  }

  const phoneExists = await User.findOne({ phone });
  if (phoneExists) {
    return res.status(400).json({ message: 'This phone number is already registered' });
  }

  const user = await User.create({
    name: name.trim(),
    email,
    phone,
    countryCode: countryCode.trim(),
    password,
  });

  res.status(201).json(formatUser(user, generateToken(user)));
};

export const loginUser = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json(formatUser(user, generateToken(user)));
};

export const getUserProfile = async (req, res) => {
  res.json(formatUser(req.user));
};

export const forgotPassword = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await User.findOne({ email });

  if (user) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    try {
      const result = await sendPasswordResetEmail(user.email, resetUrl);
      if (result.devMode) {
        return res.json({
          message: 'SMTP not configured. Check server console for reset link.',
          devResetUrl: resetUrl,
        });
      }
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Email could not be sent. Try again later.' });
    }
  }

  res.json({
    message: 'If an account exists with that email, a reset link has been sent.',
  });
};

export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({
    message: 'Password reset successful. You can now sign in.',
    user: formatUser(user, generateToken(user)),
  });
};
