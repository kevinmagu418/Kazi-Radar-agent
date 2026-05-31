import express from "express";
import { ProcessedData } from "../models/ProcessedData.js";
import { Source } from "../models/Source.js";
import { crawlQueue } from "../queue/index.js";
import pino from "pino";

import mongoose from "mongoose";
import { redisConnection } from "../config/redis.js";
import { RawData } from "../models/RawData.js";

const router = express.Router();
const logger = pino({ level: "info" });

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Detailed status
router.get("/status", async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  const redisStatus = redisConnection.status === "ready" ? "connected" : "disconnected";
  
  res.json({
    services: {
      mongodb: dbStatus,
      redis: redisStatus,
    },
    timestamp: new Date()
  });
});

// Stats overview
router.get("/stats", async (req, res) => {
  try {
    const totalSources = await Source.countDocuments();
    const activeSources = await Source.countDocuments({ active: true });
    const rawCount = await RawData.countDocuments();
    const processedCount = await ProcessedData.countDocuments();
    
    res.json({
      sources: { total: totalSources, active: activeSources },
      data: { raw: rawCount, processed: processedCount }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Fetch all opportunities
router.get("/opportunities", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    const opportunities = await ProcessedData.find(filter).sort({ processedAt: -1 });
    res.json(opportunities);
  } catch (err) {
    logger.error(`Error fetching opportunities: ${err}`);
    res.status(500).json({ error: "Server error" });
  }
});

// Get categories
router.get("/categories", (req, res) => {
  const categories = ["tech", "fintech", "agriculture", "grants", "remote-jobs", "general"];
  res.json(categories);
});

import { syncToSupabase, supabase } from "../utils/supabaseSync.js";

// Manual trigger for scanning with preferences
router.post("/scan", async (req, res) => {
  try {
    const { categories, goals, userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: "userId is required for scanning." });
    }

    if (!supabase) {
      logger.error("Scan failed: Supabase client not initialized.");
      return res.status(500).json({ error: "Intelligence terminal synchronization unavailable. Please contact support." });
    }

    // Check user tier and credits in Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('account_tier, scan_credits')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      logger.error(`Error fetching profile for scan: ${profileError?.message}`);
      return res.status(404).json({ error: "User profile not found." });
    }

    // Enforcement Logic
    if (profile.account_tier === 'free') {
      if ((profile.scan_credits || 0) <= 0) {
        return res.status(403).json({ 
          error: "You have run out of scan credits. Upgrade to a paid plan for unlimited scans!",
          outOfCredits: true 
        });
      }

      // Decrement 1 credit
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ scan_credits: profile.scan_credits - 1 })
        .eq('id', userId);

      if (updateError) {
        logger.error(`Error decrementing credits: ${updateError.message}`);
        return res.status(500).json({ error: "Failed to process scan credit." });
      }
      
      logger.info(`User ${userId} used 1 credit. Remaining: ${profile.scan_credits - 1}`);
    } else {
      logger.info(`User ${userId} is on ${profile.account_tier} plan. Unlimited scans enabled.`);
    }

    const preferences = { categories, goals };
    logger.info(`Starting Crawler Discovery for user ${userId} with preferences: ${JSON.stringify(preferences)}`);
    
    await crawlQueue.add("manual-scan", { 
      categories: categories || [], 
      goals: goals || [],
      userId 
    });

    res.json({ 
      message: "Scan triggered successfully.", 
      remainingCredits: profile.account_tier === 'free' ? profile.scan_credits - 1 : 'unlimited' 
    });
  } catch (err) {
    logger.error(`Error triggering scan: ${err}`);
    res.status(500).json({ error: "Failed to trigger scan." });
  }
});

// Add a source (utility)
router.post("/sources", async (req, res) => {
  const { url, sourceCategory, type, provider, sourceGoal, metadata } = req.body;
  try {
    const source = await Source.create({ 
      url, 
      sourceCategory: sourceCategory || "general",
      type: type || "scraping",
      provider: provider || "scraper",
      sourceGoal: sourceGoal || "both",
      metadata: metadata || {}
    });
    res.status(201).json(source);
  } catch (err) {
    logger.error(`Error adding source: ${err}`);
    res.status(400).json({ error: "Failed to add source (maybe duplicate url?)" });
  }
});

export default router;
