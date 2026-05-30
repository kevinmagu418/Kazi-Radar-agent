import { extractOpportunities } from "./processor.js";
import dotenv from "dotenv";
dotenv.config();

const testData = {
  provider: "youtube",
  title: "Top 10 Startup Grants for 2026",
  text: "In this video, we discuss various startup grants available for tech founders in 2026. Including the Y Combinator application, Google for Startups cloud credits, and various government grants for innovation.",
  proofLinks: ["https://youtube.com/watch?v=123"]
};

async function test() {
  console.log("Testing AI Processor with entrepreneurial data...");
  const result = await extractOpportunities(testData);
  console.log(JSON.stringify(result, null, 2));
}

test();
