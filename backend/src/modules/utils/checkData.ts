import mongoose from "mongoose";
import dotenv from "dotenv";
import { RawData } from "../models/RawData.js";
import { ProcessedData } from "../models/ProcessedData.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

async function checkData() {
  try {
    await mongoose.connect(MONGO_URI);
    const rawCount = await RawData.countDocuments();
    const processedCount = await ProcessedData.countDocuments();
    
    console.log(`Raw Data records: ${rawCount}`);
    console.log(`Processed Data records: ${processedCount}`);
    
    if (rawCount > 0) {
      const latestRaw = await RawData.findOne().sort({ scrapedAt: -1 });
      console.log(`Latest Raw Data scraped at: ${latestRaw?.scrapedAt}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
