import mongoose from 'mongoose';

const ensureDB = (req, res, next) => {
  const state = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (state !== 1) {
    console.error(`[DB] Request blocked — MongoDB readyState=${state} (1=connected)`);
    return res.status(503).json({
      message:
        'Database is not connected. Start MongoDB locally (net start MongoDB) or set MONGO_URI in server/.env, then restart the API.',
      readyState: state,
    });
  }
  next();
};

export default ensureDB;
