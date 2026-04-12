import express from "express";
import { ProcessedData } from "../models/ProcessedData.js";
import { Source } from "../models/Source.js";
import { crawlQueue } from "../queue/index.js";
import pino from "pino";

const router = express.Router();
const logger = pino({ level: "info" });

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Fetch all opportunities
router.get("/opportunities", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    const opportunities = await ProcessedData.find(filter).sort({ processedAt: -1 });
    res.json(opportunities);
  } catch (err) {
    logger.error(`❌ Error fetching opportunities: ${err}`);
    res.status(500).json({ error: "Server error" });
  }
});

// Get categories
router.get("/categories", (req, res) => {
  const categories = ["tech", "fintech", "agriculture", "grants", "remote-jobs", "general"];
  res.json(categories);
});

// Manual trigger for scanning
router.post("/scan", async (req, res) => {
  try {
    await crawlQueue.add("manual-scan", { manual: true });
    res.json({ message: "Scan triggered manually." });
  } catch (err) {
    logger.error(`❌ Error triggering scan: ${err}`);
    res.status(500).json({ error: "Failed to trigger scan." });
  }
});

// Add a source (utility)
router.post("/sources", async (req, res) => {
  const { url, category } = req.body;
  try {
    const source = await Source.create({ url, category });
    res.status(201).json(source);
  } catch (err) {
    logger.error(`❌ Error adding source: ${err}`);
    res.status(400).json({ error: "Failed to add source (maybe duplicate url?)" });
  }
});

export default router;
