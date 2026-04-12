import { crawlQueue, processQueue } from "../queue/index.js";
import pino from "pino";

const logger = pino({ level: "info" });

export const setupScheduler = async () => {
  try {
    await crawlQueue.add(
      "scheduled-crawl",
      {},
      {
        repeat: {
          pattern: "*/10 * * * *", // every 10 mins
        },
      }
    );
    logger.info("Scheduled crawl job every 10 minutes");

    await processQueue.add(
      "scheduled-process",
      {},
      {
        repeat: {
          pattern: "*/2 * * * *", // every 2 mins
        },
      }
    );
    logger.info("Scheduled process job every 2 minutes");
  } catch (err) {
    logger.error(`Error setting up scheduler: ${err}`);
  }
};
