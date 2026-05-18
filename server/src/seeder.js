import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import products from './data/products.js';
import Product from './models/Product.js';
import User from './models/User.js';
import connectDB from './config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await User.deleteMany();

    await Product.insertMany(products);

    await User.create({
      name: 'Admin User',
      email: 'admin@shopby.com',
      password: 'admin123',
      isAdmin: true,
    });

    await User.create({
      name: 'Demo User',
      email: 'demo@shopby.com',
      password: 'demo123',
    });

    //console.log('Data imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await User.deleteMany();
    //console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
