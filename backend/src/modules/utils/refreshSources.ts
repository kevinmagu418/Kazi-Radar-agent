import mongoose from "mongoose";
import dotenv from "dotenv";
import { Source } from "../models/Source.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const eliteSources = [
  // Tech
  { url: "software development", type: "api" as const, provider: "adzuna" as const, sourceCategory: "tech" as const, sourceGoal: "jobs" as const },
  { url: "tech startup funding", type: "api" as const, provider: "youtube" as const, sourceCategory: "tech" as const, sourceGoal: "entrepreneurial" as const },
  { url: "venture capital funding", type: "api" as const, provider: "youtube" as const, sourceCategory: "tech" as const, sourceGoal: "entrepreneurial" as const },

  // Agriculture
  { url: "agriculture", type: "api" as const, provider: "remotive" as const, sourceCategory: "agriculture" as const, sourceGoal: "jobs" as const },
  { url: "agriculture grants africa", type: "api" as const, provider: "worldbank" as const, sourceCategory: "agriculture" as const, sourceGoal: "entrepreneurial" as const },
  { url: "agritech startup", type: "api" as const, provider: "youtube" as const, sourceCategory: "agriculture" as const, sourceGoal: "entrepreneurial" as const },

  // Fintech
  { url: "https://remoteok.com/remote-fintech-jobs", type: "scraping" as const, provider: "scraper" as const, sourceCategory: "fintech" as const, sourceGoal: "jobs" as const },
  { url: "fintech startup accelerator", type: "api" as const, provider: "youtube" as const, sourceCategory: "fintech" as const, sourceGoal: "entrepreneurial" as const },

  // General / Scrapers
  { url: "https://www.ungm.org/Public/Notice", type: "scraping" as const, provider: "scraper" as const, sourceCategory: "general" as const, sourceGoal: "both" as const },  
  { url: "https://www.myjobmag.co.ke/", type: "scraping" as const, provider: "scraper" as const, sourceCategory: "general" as const, sourceGoal: "jobs" as const },
  { url: "https://www.tendersunlimited.co.ke/", type: "scraping" as const, provider: "scraper" as const, sourceCategory: "general" as const, sourceGoal: "entrepreneurial" as const },
];

async function refreshSources() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    for (const sourceData of eliteSources) {
      const existing = await Source.findOne({ url: sourceData.url });
      if (!existing) {
        await Source.create(sourceData);
        console.log(`Added source: ${sourceData.url}`);
      } else {
        // Update existing source to ensure categories and types are correct
        Object.assign(existing, sourceData);
        await existing.save();
        console.log(`Updated source: ${sourceData.url}`);
      }
    }

    console.log("Source refresh complete.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

refreshSources();
