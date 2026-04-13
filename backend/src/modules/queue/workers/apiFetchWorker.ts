import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis.js";
import { apiFetchQueue } from "../index.js";
import { fetchFromApi } from "../../fetcher/index.js";
import { RawData } from "../../models/RawData.js";
import pino from "pino";

const logger = pino({ level: "info" });

export const apiFetchWorker = new Worker(
  "apiFetchQueue",
  async (job) => {
    const { provider, query, metadata, category, sourceId } = job.data;
    logger.info(`[ApiFetchWorker] Starting job ${job.id} for ${provider}: ${query}`);

    try {
      const results = await fetchFromApi(provider, query, metadata);

      if (results && results.length > 0) {
        let savedCount = 0;
        for (const item of results) {
          try {
            await RawData.findOneAndUpdate(
              { url: item.url },
              {
                title: item.title,
                url: item.url,
                category: category || "general",
                rawContent: {
                  text: item.content,
                  proofLinks: item.proofLinks,
                  provider: item.provider,
                },
                isProcessed: false,
                scrapedAt: new Date(),
              },
              { upsert: true, new: true }
            );
            savedCount++;
          } catch (err) {
            logger.error(`[ApiFetchWorker] Error saving raw data for ${item.url}: ${err}`);
          }
        }
        logger.info(`[ApiFetchWorker] Successfully fetched and saved ${savedCount} items from ${provider}`);
      } else {
        logger.info(`[ApiFetchWorker] No results found for ${provider} with query: ${query}`);
      }
    } catch (error) {
      logger.error(`API Fetch Worker Error (${provider}): ${error}`);
      throw error;
    }
  },
  { connection: redisConnection, concurrency: 2 }
);

logger.info("API Fetch Worker initialized");
