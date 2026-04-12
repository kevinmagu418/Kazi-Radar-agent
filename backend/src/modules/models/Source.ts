import mongoose, { Schema, Document } from "mongoose";

export interface ISource extends Document {
  url: string;
  category: string; // tech, fintech, agriculture, general
  lastCrawledAt: Date;
  active: boolean;
}

const SourceSchema: Schema = new Schema({
  url: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  lastCrawledAt: { type: Date, default: null },
  active: { type: Boolean, default: true },
});

export const Source = mongoose.model<ISource>("sources", SourceSchema);
