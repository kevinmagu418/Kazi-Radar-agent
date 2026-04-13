import axios from "axios";
import pino from "pino";

const logger = pino({ level: "info" });

export const jobApisFetcher = async (provider: string, query: string, metadata: any) => {
  if (provider === "adzuna") {
    return await fetchAdzuna(query, metadata);
  } else if (provider === "remotive") {
    return await fetchRemotive(query, metadata);
  }
  return [];
};

const fetchAdzuna = async (query: string, metadata: any) => {
  const APP_ID = process.env.ADZUNA_APP_ID;
  const APP_KEY = process.env.ADZUNA_APP_KEY;
  if (!APP_ID || !APP_KEY) {
    logger.error(" Adzuna credentials missing.");
    return [];
  }

  try {
    const country = metadata.country || "gb";
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=5&what=${encodeURIComponent(query)}`;
    const response = await axios.get(url);

    return response.data.results.map((job: any) => ({
      title: job.title,
      url: job.redirect_url,
      content: `${job.title} at ${job.company.display_name}. ${job.description}`,
      proofLinks: [job.redirect_url],
      provider: "adzuna",
    }));
  } catch (error) {
    logger.error(` Adzuna API Error: ${error}`);
    return [];
  }
};

const fetchRemotive = async (query: string, metadata: any) => {
  try {
    const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=5`;
    const response = await axios.get(url);

    return response.data.jobs.map((job: any) => ({
      title: job.title,
      url: job.url,
      content: `${job.title} at ${job.company_name}. ${job.description}`,
      proofLinks: [job.url],
      provider: "remotive",
    }));
  } catch (error) {
    logger.error(` Remotive API Error: ${error}`);
    return [];
  }
};
