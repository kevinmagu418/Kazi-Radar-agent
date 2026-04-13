import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./modules/config/db.js";
import { setupScheduler } from "./modules/scheduler/scheduler.js";
import opportunityRoutes from "./modules/api/opportunityRoutes.js";
import pino from "pino";

// Bull Board Imports
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { crawlQueue, apiFetchQueue, scrapeQueue, processQueue } from "./modules/queue/index.js";

import "./modules/queue/workers/crawlWorker.js";
import "./modules/queue/workers/scrapeWorker.js";
import "./modules/queue/workers/processWorker.js";
import "./modules/queue/workers/apiFetchWorker.js";

import { Source } from "./modules/models/Source.js";

dotenv.config();

const logger = pino({ level: "info" });
const app = express();

app.use(cors()); // Enable CORS for all origins (safe for dev)

// Set up Bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [
    new BullMQAdapter(crawlQueue),
    new BullMQAdapter(apiFetchQueue),
    new BullMQAdapter(scrapeQueue),
    new BullMQAdapter(processQueue),
  ],
  serverAdapter: serverAdapter,
});

app.use(express.json());
app.use("/admin/queues", serverAdapter.getRouter());
app.use("/api", opportunityRoutes);

const start = async () => {
  try {
    await connectDB();
    
    const sourceCount = await Source.countDocuments();
    if (sourceCount === 0) {
      logger.info("Seeding elite sources...");
      await Source.create([
        // Tech
        { url: "software development", type: "api", provider: "adzuna", sourceCategory: "tech", sourceGoal: "jobs" },
        { url: "tech startup funding", type: "api", provider: "youtube", sourceCategory: "tech", sourceGoal: "entrepreneurial" },
        
        // Agriculture
        { url: "agriculture", type: "api", provider: "remotive", sourceCategory: "agriculture", sourceGoal: "jobs" },
        { url: "agriculture grants africa", type: "api", provider: "worldbank", sourceCategory: "agriculture", sourceGoal: "entrepreneurial" },
        
        // Fintech
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
