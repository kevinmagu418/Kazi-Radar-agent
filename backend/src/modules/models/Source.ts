import mongoose, { Schema, Document } from "mongoose";

export interface ISource extends Document {
  url: string;
  type: "scraping" | "api";
  provider: "youtube" | "reddit" | "adzuna" | "remotive" | "worldbank" | "scraper";
  sourceCategory: "tech" | "agriculture" | "fintech" | "general";
  sourceGoal: "jobs" | "entrepreneurial" | "both";
  lastCrawledAt: Date;
  active: boolean;
  metadata?: any;
}

const SourceSchema: Schema = new Schema({
  url: { type: String, required: true, unique: true },
  type: { type: String, enum: ["scraping", "api"], default: "scraping" },
  provider: { type: String, default: "scraper" },
  sourceCategory: { type: String, default: "general" },
  sourceGoal: { type: String, default: "both" },
  lastCrawledAt: { type: Date, default: null },
  active: { type: Boolean, default: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
});

export const Source = mongoose.model<ISource>("sources", SourceSchema);
