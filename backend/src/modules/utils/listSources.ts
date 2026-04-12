import mongoose from "mongoose";
import dotenv from "dotenv";
import { Source } from "../models/Source.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

async function listSources() {
  try {
    await mongoose.connect(MONGO_URI);
    const sources = await Source.find();
    console.log("Current Sources:");
    sources.forEach(s => console.log(`- ${s.url} (${s.category})`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listSources();
