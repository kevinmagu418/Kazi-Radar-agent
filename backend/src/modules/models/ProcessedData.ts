import mongoose, { Schema, Document } from "mongoose";

export interface IProcessedData extends Document {
  title: string;
  category: string;
  type: string;
  location: string;
  relevanceScore: number;
  url: string;
  proofLinks: string[];
  providerName: string;
  originalUrl: string;
  scrapedAt: Date;
  processedAt: Date;
}

const ProcessedDataSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String },
  location: { type: String },
  relevanceScore: { type: Number, default: 0 },
  url: { type: String, required: true },
  proofLinks: [{ type: String }],
  providerName: { type: String },
  originalUrl: { type: String },
  scrapedAt: { type: Date, required: true },
  processedAt: { type: Date, default: Date.now },
});

// Indexes for fast API response
ProcessedDataSchema.index({ category: 1, processedAt: -1 });
ProcessedDataSchema.index({ relevanceScore: -1 });
ProcessedDataSchema.index({ url: 1 });

export const ProcessedData = mongoose.model<IProcessedData>("processed-data", ProcessedDataSchema);
