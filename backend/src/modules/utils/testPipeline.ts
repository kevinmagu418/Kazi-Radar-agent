import mongoose from "mongoose";
import { redisConnection } from "../config/redis.js";
import { Source } from "../models/Source.js";
import { RawData } from "../models/RawData.js";
import { ProcessedData } from "../models/ProcessedData.js";
import { crawlQueue } from "../queue/index.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/opportunity_scanner";

async function runTest() {
  console.log("🧪 Starting End-to-End Pipeline Test...");

  try {
    // 1. Connect
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");
    
    if (redisConnection.status !== "ready") {
       await new Promise(resolve => redisConnection.on("ready", resolve));
    }
    console.log("✅ Redis Connected");

    // 2. Clear previous test data (optional, but good for clean run)
    // await RawData.deleteMany({});
    // await ProcessedData.deleteMany({});
    
    // 3. Trigger Scan
    console.log("🚀 Triggering Manual Scan for 'Tech' category...");
    await crawlQueue.add("manual-test-scan", { 
      categories: ["tech"], 
      goals: ["jobs"] 
    });

    console.log("📡 Scan triggered. Waiting for data to flow through workers...");
    
    // 4. Poll for results
    let foundRaw = false;
    let foundProcessed = false;
    
    for (let i = 0; i < 6; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const rawCount = await RawData.countDocuments();
      const processedCount = await ProcessedData.countDocuments();
      
      console.log(`⏱️ [Pass ${i+1}/6] Raw: ${rawCount} | Processed: ${processedCount}`);
      
      if (rawCount > 0) foundRaw = true;
      if (processedCount > 0) foundProcessed = true;
      
      if (foundRaw && foundProcessed) break;
    }

    console.log("\n📊 --- Test Result Summary ---");
    console.log(`Source Discovery: ${foundRaw ? "✅ SUCCESS" : "❌ FAILED (No RawData found)"}`);
    console.log(`AI Processing:    ${foundProcessed ? "✅ SUCCESS" : "❌ FAILED (No ProcessedData found)"}`);
    
    if (foundRaw && foundProcessed) {
      const latest = await ProcessedData.findOne().sort({ processedAt: -1 });
      console.log(`\n✨ Latest Opportunity Found: "${latest?.title}"`);
    }

  } catch (err) {
    console.error("❌ Test Failed with Error:", err);
  } finally {
    await mongoose.disconnect();
    await redisConnection.quit();
    process.exit(0);
  }
}

runTest();
