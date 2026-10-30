import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  const uri = process.env['MONGODB_URI'];
  if (!uri) {
    console.warn('⚠️  MONGODB_URI not set — running with in-memory fallback.');
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    console.warn('⚠️  Falling back to in-memory store.');
  }
}

export function isDBConnected(): boolean {
  return isConnected;
}
