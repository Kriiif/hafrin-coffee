import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!; 

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in .env.local");
}

let isConnected = false; 

export async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("⚡ MongoDB already connected");
    return;
  }

  try {
    console.log("🔄 Connecting to MongoDB...");
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "hafrincoffee",
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000,
    });
    isConnected = db.connection.readyState === 1;

    console.log("✅ MongoDB Connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    isConnected = false;
    throw new Error(`Database connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`); 
  }
}