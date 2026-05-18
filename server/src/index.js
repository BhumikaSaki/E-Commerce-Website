import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';
import errorHandler from './middleware/errorHandler.js';
import requestLogger from './middleware/requestLogger.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { initSocket, attachIo } from './socket/socketHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

process.on('unhandledRejection', (err) => {
  console.error('[FATAL] Unhandled promise rejection:', err);
});

const startServer = async () => {
  console.log('\n ShopBy API starting...');

  await connectDB();
  const cloudinaryOk = configureCloudinary();
  //console.log(cloudinaryOk ? 'Cloudinary configured' : ' Cloudinary not configured (avatar upload disabled)');

  const app = express();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: ['GET', 'POST'],
    },
  });

  initSocket(io);
  app.use((req, res, next) => attachIo(io)(req, res, next));

  app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));
  app.use(express.json());
  app.use(requestLogger);

  app.get('/api/health', (req, res) => {
    const dbOk = mongoose.connection.readyState === 1;
    res.status(dbOk ? 200 : 503).json({
      status: dbOk ? 'ok' : 'degraded',
      app: 'ShopBy API',
      db: dbOk ? 'connected' : 'disconnected',
      cloudinary: cloudinaryOk,
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/admin', adminRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
  });

  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;

  server.listen(PORT, () => {
    //console.log(`\n ShopBy server running on http://localhost:${PORT}`);
    //console.log(`Socket.IO enabled for real-time notifications\n`);
  });
};

startServer();
