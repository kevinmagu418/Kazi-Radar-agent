import { redisConnection } from "../config/redis.js";

async function testRedis() {
  console.log("Attempting to connect to Redis...");
  try {
    await redisConnection.ping();
    console.log("Redis connected successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Redis connection failed:", err);
    process.exit(1);
  }
}

testRedis();
