import mongoose, { Schema, Document } from "mongoose";

export interface IRawData extends Document {
  title: string;
  url: string;
  category: string;
  scrapedAt: Date;
  rawContent: any;
  isProcessed: boolean;
}

const RawDataSchema: Schema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: String, required: true },
  scrapedAt: { type: Date, default: Date.now },
  rawContent: { type: Schema.Types.Mixed, required: true },
  isProcessed: { type: Boolean, default: false },
});

// Indexes for performance
RawDataSchema.index({ isProcessed: 1, scrapedAt: -1 });
RawDataSchema.index({ url: 1 }, { unique: true }); // Prevent duplicate raw data

export const RawData = mongoose.model<IRawData>("raw-data", RawDataSchema);
