import { chromium } from "playwright";
import { RawData } from "../models/RawData.js";
import pino from "pino";

const logger = pino({ level: "info" });

export const scrapeAndSave = async (url: string, category: string) => {
  logger.info(`Scraping site: ${url} for category: ${category}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    
    const title = await page.title();
    const htmlContent = await page.content();
    const bodyText = await page.evaluate(() => document.body.innerText);

    const record = new RawData({
      title,
      url,
      category,
      rawContent: {
        html: htmlContent,
        text: bodyText,
      },
      isProcessed: false,
    });

    await record.save();
    logger.info(`Successfully scraped and saved: ${url}`);
  } catch (err) {
    logger.error(`Scrape error for ${url}: ${err}`);
    throw err;
  } finally {
    await browser.close();
  }
};
