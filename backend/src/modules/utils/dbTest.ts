import mongoose from "mongoose";
import dotenv from "dotenv";
import { Source } from "../models/Source.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

async function testConnection() {
  console.log("Attempting to connect to MongoDB...");
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Successfully connected to MongoDB Atlas!");

    const collections = await mongoose.connection.db?.listCollections().toArray();
    const collectionNames = collections?.map(c => c.name) || [];
    console.log("Existing Collections:", collectionNames);

    const requiredCollections = ["sources", "raw-data", "processed-data"];
    for (const col of requiredCollections) {
      if (collectionNames.includes(col)) {
        console.log(`Collection '${col}' exists.`);
      } else {
        console.log(`Collection '${col}' is missing (will be created on first use).`);
      }
    }

    const sourceCount = await Source.countDocuments();
    console.log(`Current Source count: ${sourceCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  }
}

testConnection();
