import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { getPagination, paginatedResponse, getSortOption } from '../utils/pagination.js';

export const getAdminStats = async (req, res) => {
  const [totalUsers, totalProducts, orders, revenueAgg] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.find().sort('-createdAt').limit(5).populate('user', 'name email avatar'),
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
  ]);

  const totalOrders = await Order.countDocuments();
  const totalRevenue = revenueAgg[0]?.total || 0;

  const monthlyRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 6 },
  ]);

  res.json({
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    recentOrders: orders,
    monthlyRevenue,
  });
};

export const getUsersPaginated = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 10);
  const sort = getSortOption(req.query.sort, '-createdAt');
  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { email: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const totalItems = await User.countDocuments(keyword);
  const users = await User.find(keyword)
    .select('-password')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res.json(paginatedResponse(users, totalItems, page, limit));
};

export const getOrdersPaginated = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 10);
  const sort = getSortOption(req.query.sort, '-createdAt');

  const totalItems = await Order.countDocuments();
  const orders = await Order.find()
    .populate('user', 'name email avatar')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res.json(paginatedResponse(orders, totalItems, page, limit));
};
