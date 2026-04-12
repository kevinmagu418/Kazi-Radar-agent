import { Source } from "../models/Source.js";
import { scrapeQueue } from "../queue/index.js";
import pino from "pino";

const logger = pino({ level: "info" });

export const discoverAndQueueSources = async () => {
  logger.info("🚀 Starting Crawler Discovery...");
  try {
    const activeSources = await Source.find({ active: true });
    if (activeSources.length === 0) {
      logger.info("⚠️ No active sources found to crawl.");
      return;
    }

    for (const source of activeSources) {
      logger.info(`Adding to scrape queue: ${source.url} (${source.category})`);
      await scrapeQueue.add(`scrape-${source._id}`, {
        url: source.url,
        category: source.category,
      });
      
      source.lastCrawledAt = new Date();
      await source.save();
    }
    logger.info(`✅ Successfully queued ${activeSources.length} sources.`);
  } catch (err) {
    logger.error(`❌ Crawler error: ${err}`);
    throw err;
  }
};
