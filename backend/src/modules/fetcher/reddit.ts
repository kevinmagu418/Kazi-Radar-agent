import axios from "axios";
import pino from "pino";

const logger = pino({ level: "info" });

export const redditFetcher = async (subreddit: string, metadata: any) => {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/new.json?limit=10`;
    const response = await axios.get(url, {
      headers: {
        "User-Agent": process.env.REDDIT_USER_AGENT || "OpportunityScannerAgent/1.0",
      },
    });

    const posts = response.data.data.children;
    return posts.map((post: any) => ({
      title: post.data.title,
      url: `https://www.reddit.com${post.data.permalink}`,
      content: post.data.selftext || post.data.title,
      proofLinks: [post.data.url],
      provider: "reddit",
    }));
  } catch (error) {
    logger.error(` Reddit API Error (${subreddit}): ${error}`);
    return [];
  }
};
