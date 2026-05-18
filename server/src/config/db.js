import mongoose from 'mongoose';

const maskUri = (uri) => uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('MONGO_URI is missing in server/.env');
    process.exit(1);
  }

  if (uri.includes('mongodb+srv://') && !uri.includes('@')) {
    console.error('Invalid Atlas URI — missing username:password before @');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(` MongoDB connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('\n MongoDB connection failed.');
    console.error(`   URI: ${maskUri(uri)}`);
    console.error(`   Error: ${error.message}\n`);

    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('── Atlas authentication fix ──');
      console.error('1. Open https://cloud.mongodb.com → your project → Database Access');
      console.error('2. Edit your database user → Edit password → set a NEW password');
      console.error('3. Update server/.env MONGO_URI with the new password');
      console.error('4. Use this format (replace USER, PASS, CLUSTER):');
      console.error(
        '   MONGO_URI=mongodb+srv://USER:PASS@CLUSTER.mongodb.net/shopby?retryWrites=true&w=majority'
      );
      console.error('5. If password has @ # : / etc., URL-encode it (e.g. @ → %40)');
      console.error('6. Network Access → Add IP Address → allow your current IP (or 0.0.0.0/0 for dev)\n');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('── Local MongoDB ──');
      console.error('   Run in Admin PowerShell: net start MongoDB\n');
    }

    process.exit(1);
  }
};

export default connectDB;
