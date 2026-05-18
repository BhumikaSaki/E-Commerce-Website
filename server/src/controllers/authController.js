import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { formatUser } from '../utils/userResponse.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password });
  res.status(201).json(formatUser(user, generateToken(user._id)));
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json(formatUser(user, generateToken(user._id)));
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

export const getUserProfile = async (req, res) => {
  res.json(formatUser(req.user));
};
