import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { getPagination, paginatedResponse, getSortOption } from '../utils/pagination.js';

export const createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems?.length) {
    return res.status(400).json({ message: 'No order items' });
  }

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock -= item.qty;
      await product.save();

      if (req.io) {
        req.io.emit('stockUpdate', {
          productId: product._id,
          name: product.name,
          countInStock: product.countInStock,
        });
      }
    }
  }

  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const created = await order.save();

  if (req.io) {
    req.io.to('admin').emit('newOrder', {
      orderId: created._id,
      totalPrice: created.totalPrice,
      user: req.user.name,
      createdAt: created.createdAt,
    });
  }

  res.status(201).json(created);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email avatar');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

export const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    const updated = await order.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

export const getMyOrders = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 10);
  const sort = getSortOption(req.query.sort, '-createdAt');
  const filter = { user: req.user._id };

  const totalItems = await Order.countDocuments(filter);
  const orders = await Order.find(filter).sort(sort).skip(skip).limit(limit);

  res.json(paginatedResponse(orders, totalItems, page, limit));
};

export const getOrders = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 10);
  const sort = getSortOption(req.query.sort, '-createdAt');

  const totalItems = await Order.countDocuments();
  const orders = await Order.find()
    .populate('user', 'id name email avatar')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res.json(paginatedResponse(orders, totalItems, page, limit));
};
