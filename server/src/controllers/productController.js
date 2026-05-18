import Product from '../models/Product.js';
import { getPagination, paginatedResponse, getSortOption } from '../utils/pagination.js';

const buildProductFilter = (query) => {
  const filter = {};
  if (query.keyword) {
    filter.name = { $regex: query.keyword, $options: 'i' };
  }
  if (query.category) {
    filter.category = query.category;
  }
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  return filter;
};

export const getProducts = async (req, res) => {
  const filter = buildProductFilter(req.query);
  const { page, limit, skip } = getPagination(req.query, 12);
  const sort = getSortOption(req.query.sort, '-createdAt');

  const totalItems = await Product.countDocuments(filter);
  const products = await Product.find(filter).sort(sort).skip(skip).limit(limit);

  res.json(paginatedResponse(products, totalItems, page, limit));
};

export const searchSuggestions = async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q || q.length < 2) {
    return res.json([]);
  }

  const limit = Math.min(10, parseInt(req.query.limit, 10) || 5);
  const products = await Product.find({
    name: { $regex: q, $options: 'i' },
  })
    .select('name image price')
    .limit(limit);

  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

export const createProduct = async (req, res) => {
  const product = new Product({
    name: 'Sample Product',
    price: 0,
    description: 'Sample description',
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
  });

  const created = await product.save();
  res.status(201).json(created);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};
