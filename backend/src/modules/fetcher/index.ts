import { youtubeFetcher } from "./youtube.js";
import { jobApisFetcher } from "./jobApis.js";
import { worldbankFetcher } from "./worldbank.js";
import pino from "pino";

const logger = pino({ level: "info" });

export const fetchFromApi = async (provider: string, query: string, metadata: any) => {
  logger.info(`Fetching from API provider: ${provider} with query: ${query}`);

  switch (provider) {
    case "youtube":
      return await youtubeFetcher(query, metadata);
    case "adzuna":
    case "remotive":
      return await jobApisFetcher(provider, query, metadata);
    case "worldbank":
      return await worldbankFetcher(query, metadata);
    default:
      logger.error(`Unknown API provider: ${provider}`);
      return [];
  }
};
