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
    logger.info(`Processing API fetch job for ${provider}: ${query}`);

    try {
      const results = await fetchFromApi(provider, query, metadata);

      if (results && results.length > 0) {
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
          } catch (err) {
            logger.error(`Error saving raw data for ${item.url}: ${err}`);
          }
        }
        logger.info(`Successfully fetched and saved ${results.length} items from ${provider}`);
      } else {
        logger.info(`No results found for ${provider} with query: ${query}`);
      }
    } catch (error) {
      logger.error(`API Fetch Worker Error (${provider}): ${error}`);
      throw error;
    }
  },
  { connection: redisConnection, concurrency: 2 }
);

logger.info("API Fetch Worker initialized");
