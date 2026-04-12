import { Worker, Job } from "bullmq";
import { redisConnection } from "../../config/redis.js";
import { RawData } from "../../models/RawData.js";
import { ProcessedData } from "../../models/ProcessedData.js";
import { extractOpportunities } from "../../ai/processor.js";
import pino from "pino";

const logger = pino({ level: "info" });

export const processWorker = new Worker(
  "processQueue",
  async (job: Job) => {
    logger.info("Starting Process Job");
    try {
      const rawRecords = await RawData.find({ isProcessed: false }).limit(5);

      if (rawRecords.length === 0) {
        logger.info("No unprocessed raw records found.");
        return;
      }

      for (const record of rawRecords) {
        logger.info(`Processing RawData: ${record.title} (${record.url})`);

        const opportunities = await extractOpportunities(record.rawContent.text);

        if (Array.isArray(opportunities) && opportunities.length > 0) {
          logger.info(`Extracted ${opportunities.length} opportunities from ${record.url}`);
          
          for (const opt of opportunities) {
            await ProcessedData.create({
              title: opt.title || "Untitled Opportunity",
              category: opt.category || record.category,
              type: opt.type,
              location: opt.location,
              relevanceScore: opt.relevanceScore,
              url: record.url,
              scrapedAt: record.scrapedAt,
            });
          }
        } else {
          logger.info(`No structured opportunities found in ${record.url}`);
        }

        record.isProcessed = true;
        await record.save();
      }
      
      logger.info(`Successfully processed ${rawRecords.length} records.`);
    } catch (err) {
      logger.error(`Process worker error: ${err}`);
      throw err;
    }
  },
  { connection: redisConnection }
);

processWorker.on("completed", (job) => {
  logger.info(`Process Job ${job.id} completed!`);
});

processWorker.on("failed", (job, err) => {
  logger.error(`Process Job ${job?.id} failed: ${err.message}`);
});
