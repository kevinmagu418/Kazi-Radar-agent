import { Worker, Job } from "bullmq";
import { redisConnection } from "../../config/redis.js";
import { scrapeAndSave } from "../../scraper/index.js";
import { RawData } from "../../models/RawData.js";
import pino from "pino";

const logger = pino({ level: "info" });

export const scrapeWorker = new Worker(
  "scrapeQueue",
  async (job: Job) => {
    const { url, category } = job.data;

    // Check if URL was scraped recently (within the last 12 hours)
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const existing = await RawData.findOne({ url, scrapedAt: { $gte: twelveHoursAgo } });

    if (existing) {
      logger.info(`Skipping scrape for ${url} (already scraped within 12 hours)`);
      return;
    }

    await scrapeAndSave(url, category);
  },
  { 
    connection: redisConnection,
    concurrency: parseInt(process.env.SCRAPE_CONCURRENCY || "3"),
    limiter: {
      max: 10,
      duration: 1000,
    }
  }
);

scrapeWorker.on("completed", (job) => {
  logger.info(`Scrape Job ${job.id} completed!`);
});

scrapeWorker.on("failed", (job, err) => {
  logger.error(`Scrape Job ${job?.id} failed: ${err.message}`);
});
