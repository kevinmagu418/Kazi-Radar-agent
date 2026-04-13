import axios from "axios";
import pino from "pino";

const logger = pino({ level: "info" });

export const youtubeFetcher = async (query: string, metadata: any) => {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  if (!API_KEY) {
    logger.error("YOUTUBE_API_KEY is missing.");
    return [];
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${API_KEY}`;
    const response = await axios.get(url);

    const items = response.data.items;
    return items.map((item: any) => ({
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      content: `${item.snippet.title}. ${item.snippet.description}`,
      proofLinks: [`https://www.youtube.com/watch?v=${item.id.videoId}`],
      provider: "youtube",
    }));
  } catch (error) {
    logger.error(` YouTube API Error (${query}): ${error}`);
    return [];
  }
};
