import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

const queueOptions = {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: 100,
  },
};

export const crawlQueue = new Queue("crawlQueue", queueOptions);
export const scrapeQueue = new Queue("scrapeQueue", queueOptions);
export const processQueue = new Queue("processQueue", queueOptions);

console.log("BullMQ Queues initialized");
