import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const getRedisOptions = (urlStr: string) => {
  try {
    const url = new URL(urlStr);
    const isFamily6 = url.hostname.includes(':'); // Simple check for IPv6
    
    const options: any = {
      maxRetriesPerRequest: null,
      family: isFamily6 ? 6 : 0, // 0 handles both, but some environments prefer explicit
    };

    if (url.protocol === "rediss:") {
      options.tls = {
        rejectUnauthorized: false,
      };
    }

    console.log(`[Redis] Target: ${url.hostname}:${url.port || '6379'} | Protocol: ${url.protocol} | TLS: ${!!options.tls}`);
    return options;
  } catch (err) {
    console.error(`[Redis] Invalid URL provided: ${urlStr.substring(0, 20)}...`);
    return { maxRetriesPerRequest: null };
  }
};

export const redisConnection = new Redis(REDIS_URL, getRedisOptions(REDIS_URL));

redisConnection.on("error", (err: any) => {
  if (err.code === 'ERR_SSL_WRONG_VERSION_NUMBER') {
    console.error(" [CRITICAL] Redis SSL Mismatch: You are using 'rediss://' but the server is likely NOT using SSL. Change your REDIS_URL to start with 'redis://' (single 's') in Render.");
  } else {
    console.error("Redis connection error:", err);
  }
});

redisConnection.on("connect", () => {
  console.log("Redis connected successfully");
});
