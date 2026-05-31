import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import dotenv from "dotenv";
import pino from "pino";
import ws from "ws";

dotenv.config();

const logger = pino({ level: "info" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey, {
      realtime: {
        transport: ws as any,
      },
    }) 
  : null;

if (!supabase) {
  logger.error("Supabase credentials missing in environment variables. Actions requiring Supabase will be skipped.");
}

/**
 * Generates a stable hash for the opportunity to prevent duplicates in Supabase.
 */
export const generateContentHash = (opportunity: any) => {
  const sourceString = `${opportunity.title}-${opportunity.originalUrl}-${opportunity.category}`.toLowerCase();
  return crypto.createHash("md5").update(sourceString).digest("hex");
};

/**
 * Syncs a processed opportunity from MongoDB to Supabase.
 * If userId is provided, it also populates the personalized intelligence_feed.
 */
export const syncToSupabase = async (opportunity: any, userId?: string) => {
  if (!supabase) {
    logger.error("Skipping Supabase sync: Client not initialized.");
    return null;
  }
  try {
    const contentHash = generateContentHash(opportunity);

    const { data: oppData, error: oppError } = await supabase
      .from("opportunities")
      .upsert(
        {
          content_hash: contentHash,
          title: opportunity.title,
          category: opportunity.category,
          type: opportunity.type || "general",
          location: opportunity.location || "Remote",
          relevance_score: opportunity.relevanceScore || 0,
          url: opportunity.url,
          proof_links: opportunity.proofLinks || [],
          provider_name: opportunity.providerName || "KaziRadar Scout",
          original_url: opportunity.originalUrl,
          scraped_at: opportunity.scrapedAt,
          processed_at: new Date(),
          description: opportunity.title, 
        },
        { onConflict: "content_hash" }
      )
      .select()
      .single();

    if (oppError) {
      logger.error(`Supabase Opportunity Sync Error: ${oppError.message}`);
      return null;
    }

    // If a userId is associated, sync to their personalized intelligence feed
    if (userId && oppData) {
      const { error: feedError } = await supabase
        .from("intelligence_feed")
        .upsert({
          user_id: userId,
          opportunity_id: oppData.id,
          relevance_score: opportunity.relevanceScore,
          why_surfaced: opportunity.explanation || null,
          status: 'unseen'
        }, { onConflict: 'user_id,opportunity_id' });

      if (feedError) {
        logger.error(`Supabase Intelligence Feed Sync Error: ${feedError.message}`);
      } else {
        logger.info(`Personalized feed entry created for user ${userId}`);
      }
    }

    logger.info(`Successfully synced to Supabase: ${opportunity.title}`);
    return oppData;
  } catch (err) {
    logger.error(`Failed to sync to Supabase: ${err}`);
    return null;
  }
};
