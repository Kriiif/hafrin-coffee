import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!; 

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in .env.local");
}

let isConnected = false; 

export async function connectDB() {
  if (isConnected) {
    console.log("⚡ MongoDB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connection.readyState === 1;

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err; 
  }
}