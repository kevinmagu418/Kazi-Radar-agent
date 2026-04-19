import mongoose from "mongoose";
import dotenv from "dotenv";
import { RawData } from "../models/RawData.js";
import { ProcessedData } from "../models/ProcessedData.js";
import { extractOpportunities } from "../ai/processor.js";

dotenv.config();

async function forceProcess() {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Connected to DB. Finding unprocessed records...");
  
  const rawRecords = await RawData.find({ isProcessed: false });
  console.log(`Found ${rawRecords.length} records to process.`);

  for (const record of rawRecords) {
    console.log(`Processing: ${record.title}`);
    const opportunities = await extractOpportunities(record.rawContent);
    console.log(`AI extracted ${opportunities.length} opportunities.`);

    if (opportunities && opportunities.length > 0) {
      for (const opt of opportunities) {
        await ProcessedData.create({
          ...opt,
          title: opt.title || "Untitled Opportunity",
          category: opt.category || record.category,
          url: opt.url || record.url,
          proofLinks: opt.proofLinks || [record.url],
          providerName: record.rawContent?.provider || "Web Scraper",
          originalUrl: record.url,
          scrapedAt: record.scrapedAt,
        });
      }
    }
    
    record.isProcessed = true;
    await record.save();
  }

  console.log("Done!");
  await mongoose.disconnect();
  process.exit(0);
}

forceProcess();
