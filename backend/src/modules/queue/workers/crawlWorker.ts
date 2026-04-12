import { Worker, Job } from "bullmq";
import { redisConnection } from "../../config/redis.js";
import { discoverAndQueueSources } from "../../crawler/index.js";
import pino from "pino";

const logger = pino({ level: "info" });

export const crawlWorker = new Worker(
  "crawlQueue",
  async (job: Job) => {
    logger.info(`Starting Crawl Job [${job.id}]`);
    await discoverAndQueueSources();
  },
  { connection: redisConnection }
);

crawlWorker.on("completed", (job) => {
  logger.info(`Crawl Job ${job.id} completed!`);
});

crawlWorker.on("failed", (job, err) => {
  logger.error(`Crawl Job ${job?.id} failed: ${err.message}`);
});
