import mongoose from 'mongoose';
import { ENV } from './env';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[INDUSMIND DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`[INDUSMIND DB Warning] MongoDB Connection Error: ${error.message}`);
    console.warn(`[INDUSMIND DB Warning] Running in memory-buffered offline mode.`);
  }
};
