import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./modules/config/db.js";
import { setupScheduler } from "./modules/scheduler/scheduler.js";
import opportunityRoutes from "./modules/api/opportunityRoutes.js";
import pino from "pino";

import "./modules/queue/workers/crawlWorker.js";
import "./modules/queue/workers/scrapeWorker.js";
import "./modules/queue/workers/processWorker.js";

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
      logger.info("Seeding initial sources...");
      await Source.create([
        { url: "https://www.myjobmag.co.ke/", category: "general" },
        { url: "https://www.brightermonday.co.ke/", category: "general" },
        { url: "https://news.ycombinator.com/jobs", category: "tech" },
        { url: "https://remoteok.com/", category: "remote-jobs" },
      ]);
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
