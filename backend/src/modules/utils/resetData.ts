import mongoose from "mongoose";
import dotenv from "dotenv";
import { RawData } from "../models/RawData.js";

dotenv.config();

async function reset() {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Connected to DB. Resetting isProcessed for all RawData...");
  const result = await RawData.updateMany({}, { $set: { isProcessed: false } });
  console.log(`Updated ${result.modifiedCount} records.`);
  await mongoose.disconnect();
  process.exit(0);
}

reset();
