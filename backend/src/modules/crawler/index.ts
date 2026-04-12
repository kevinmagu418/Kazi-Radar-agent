import { Source } from "../models/Source.js";
import { scrapeQueue, apiFetchQueue } from "../queue/index.js";
import pino from "pino";

const logger = pino({ level: "info" });

export interface ScanPreferences {
  categories?: string[];
  goals?: string[];
}

export const discoverAndQueueSources = async (preferences: ScanPreferences = {}) => {
  logger.info(`🚀 Starting Crawler Discovery with preferences: ${JSON.stringify(preferences)}`);
  
  try {
    const query: any = { active: true };
    
    if (preferences.categories && preferences.categories.length > 0) {
      query.sourceCategory = { $in: preferences.categories };
    }
    
    if (preferences.goals && preferences.goals.length > 0) {
      if (!preferences.goals.includes("both")) {
        query.sourceGoal = { $in: [...preferences.goals, "both"] };
      }
    }

    const activeSources = await Source.find(query);
    
    if (activeSources.length === 0) {
      logger.info("⚠️ No matching active sources found to crawl.");
      return;
    }

    for (const source of activeSources) {
      if (source.type === "api") {
        logger.info(`Adding to API fetch queue: ${source.provider} (${source.sourceCategory})`);
        // metadata might contain query terms or subreddits
        const searchQuery = source.metadata?.query || source.url; 
        
        await apiFetchQueue.add(`api-${source.provider}-${source._id}`, {
          provider: source.provider,
          query: searchQuery,
          metadata: source.metadata,
          category: source.sourceCategory,
          sourceId: source._id
        });
      } else {
        logger.info(`Adding to scrape queue: ${source.url} (${source.sourceCategory})`);
        await scrapeQueue.add(`scrape-${source._id}`, {
          url: source.url,
          category: source.sourceCategory,
          sourceId: source._id
        });
      }
      
      source.lastCrawledAt = new Date();
      await source.save();
    }
    logger.info(`✅ Successfully queued ${activeSources.length} sources.`);
  } catch (err) {
    logger.error(`❌ Crawler error: ${err}`);
    throw err;
  }
};
