import { processQueue } from "../queue/index.js";
import { redisConnection } from "../config/redis.js";

async function trigger() {
  console.log("Adding manual job to processQueue...");
  await processQueue.add("manual-process", {});
  console.log("Job added. Waiting 5 seconds...");
  await new Promise(r => setTimeout(r, 5000));
  await redisConnection.quit();
  process.exit(0);
}

trigger();
