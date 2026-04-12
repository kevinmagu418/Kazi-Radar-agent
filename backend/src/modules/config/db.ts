// src/config/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI as string;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      // Optimize for performance
      autoIndex: false,          // don't build indexes on every startup
      maxPoolSize: 50,           // connection pool
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,                 // IPv4
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }

  // Optional: Event listeners for production monitoring
  mongoose.connection.on("connected", () => console.log("🔗 Mongoose connected"));
  mongoose.connection.on("error", (err) => console.error("❌ Mongoose connection error:", err));
  mongoose.connection.on("disconnected", () => console.log("⚠️ Mongoose disconnected"));
};