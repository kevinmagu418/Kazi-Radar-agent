import mongoose from "mongoose";
import { redisConnection } from "../config/redis.js";
import { RawData } from "../models/RawData.js";
import { ProcessedData } from "../models/ProcessedData.js";
import { crawlQueue } from "../queue/index.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/opportunity_scanner";

async function runTest() {
  console.log("🧪 Starting Entrepreneurial Pipeline Test...");

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");
    
    if (redisConnection.status !== "ready") {
       await new Promise(resolve => redisConnection.on("ready", resolve));
    }
    console.log("✅ Redis Connected");

    console.log("🚀 Triggering Manual Scan for Entrepreneurial goals...");
    await crawlQueue.add("manual-test-scan", { 
      categories: ["tech", "agriculture", "fintech", "grants"], 
      goals: ["entrepreneurial"] 
    });

    console.log("📡 Scan triggered. Waiting for data to flow through workers...");
    
    for (let i = 0; i < 12; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const rawCount = await RawData.countDocuments();
      const processedCount = await ProcessedData.countDocuments();
      const entrepreneurialCount = await ProcessedData.countDocuments({ 
        type: { $in: ["entrepreneurial", "entrepreneurial-signal", "grant"] } 
      });
      
      console.log(`⏱️ [Pass ${i+1}/12] Raw: ${rawCount} | Processed: ${processedCount} | Entrepreneurial: ${entrepreneurialCount}`);
      
      if (entrepreneurialCount > 0) break;
    }

    const latest = await ProcessedData.find({ 
      type: { $in: ["entrepreneurial", "entrepreneurial-signal", "grant"] } 
    }).sort({ processedAt: -1 }).limit(5);

    console.log("\n📊 --- Test Result Summary ---");
    console.log(`Entrepreneurial Opportunities Found: ${latest.length}`);
    
    latest.forEach((opt, idx) => {
      console.log(`${idx + 1}. [${opt.type}] ${opt.title} (${opt.category})`);
    });

  } catch (err) {
    console.error("❌ Test Failed with Error:", err);
  } finally {
    await mongoose.disconnect();
    await redisConnection.quit();
    process.exit(0);
  }
}

runTest();
