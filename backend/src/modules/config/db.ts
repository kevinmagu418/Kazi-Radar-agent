// src/config/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI as string;

export const connectDB = async () => {
  if (!MONGO_URI) {
    console.error("MONGO_URI is not defined in .env file");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
      maxPoolSize: 10,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error details:", error);
    process.exit(1);
  }

  // Optional: Event listeners for production monitoring
  mongoose.connection.on("connected", () => console.log("Mongoose connected"));
  mongoose.connection.on("error", (err) => console.error("Mongoose connection error:", err));
  mongoose.connection.on("disconnected", () => console.log("Mongoose disconnected"));
};