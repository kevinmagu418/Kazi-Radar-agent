import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./modules/config/db.js";
import { setupScheduler } from "./modules/scheduler/scheduler.js";
import opportunityRoutes from "./modules/api/opportunityRoutes.js";
import pino from "pino";

import "./modules/queue/workers/crawlWorker.js";
import "./modules/queue/workers/scrapeWorker.js";
import "./modules/queue/workers/processWorker.js";
import "./modules/queue/workers/apiFetchWorker.js";

import { Source } from "./modules/models/Source.js";

dotenv.config();

const logger = pino({ level: "info" });
const app = express();

app.use(express.json());
app.use("/api", opportunityRoutes);

const start = async () => {
  try {
    await connectDB();
    
    const sourceCount = await Source.countDocuments();
    if (sourceCount === 0) {
      logger.info("Seeding elite sources...");
      await Source.create([
        // Tech
        { url: "forhire", type: "api", provider: "reddit", sourceCategory: "tech", sourceGoal: "jobs" },
        { url: "remotejs", type: "api", provider: "reddit", sourceCategory: "tech", sourceGoal: "jobs" },
        { url: "software development", type: "api", provider: "adzuna", sourceCategory: "tech", sourceGoal: "jobs" },
        { url: "tech startup funding", type: "api", provider: "youtube", sourceCategory: "tech", sourceGoal: "entrepreneurial" },
        
        // Agriculture
        { url: "farming", type: "api", provider: "reddit", sourceCategory: "agriculture", sourceGoal: "both" },
        { url: "agriculture", type: "api", provider: "remotive", sourceCategory: "agriculture", sourceGoal: "jobs" },
        { url: "agriculture grants africa", type: "api", provider: "worldbank", sourceCategory: "agriculture", sourceGoal: "entrepreneurial" },
        
        // Fintech
        { url: "fintech", type: "api", provider: "reddit", sourceCategory: "fintech", sourceGoal: "both" },
        { url: "startups", type: "api", provider: "reddit", sourceCategory: "fintech", sourceGoal: "entrepreneurial" },
        
        // General / Scrapers
        { url: "https://www.ungm.org/Public/Notice", type: "scraping", provider: "scraper", sourceCategory: "general", sourceGoal: "both" },
        { url: "https://www.myjobmag.co.ke/", type: "scraping", provider: "scraper", sourceCategory: "general", sourceGoal: "jobs" },
      ]);
      logger.info("Seeding complete.");
    }

    await setupScheduler();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`App initialization error: ${error}`);
    process.exit(1);
  }
};

start();
