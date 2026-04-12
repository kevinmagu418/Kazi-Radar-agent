import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import dotenv from "dotenv";
import pino from "pino";

dotenv.config();

const logger = pino({ level: "info" });

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  logger.error("❌ GROQ_API_KEY is missing from environment variables.");
}

const model = new ChatGroq({
  apiKey: GROQ_API_KEY as string,
  model: "llama3-70b-8192",
  temperature: 0,
});

const parser = new JsonOutputParser();

const promptTemplate = PromptTemplate.fromTemplate(
  `You are an expert AI assistant specializing in identifying opportunities from raw data.
  Extract all opportunities found in the text provided below.

  Categories can be: tech, fintech, agriculture, grants, general.
  Types can be: job, internship, grant, gig, volunteer, entrepreneurial-signal.

  For each opportunity, extract:
  - title (string)
  - category (string)
  - type (string)
  - location (string)
  - relevanceScore (number between 1-100)
  - proofLinks (array of strings, extract URLs that verify this opportunity)

  Output MUST be a JSON array of objects.

  Raw Data:
  {text}

  Output JSON:`
);

export const extractOpportunities = async (data: any) => {
  try {
    let textToProcess = "";

    if (typeof data === "string") {
      textToProcess = data;
    } else if (typeof data === "object") {
      // Summarize structured data for AI
      textToProcess = `
        Source: ${data.provider || "Unknown"}
        Title: ${data.title || "Unknown"}
        Content: ${data.text || JSON.stringify(data)}
        Links Found: ${data.proofLinks?.join(", ") || ""}
      `;
    }

    const truncatedText = textToProcess.slice(0, 15000); 
    
    const chain = RunnableSequence.from([
      promptTemplate,
      model,
      parser
    ]);
    
    const result = await chain.invoke({ text: truncatedText });
    
    return result as any[];
  } catch (error) {
    logger.error(`❌ AI Processing Error: ${error}`);
    return [];
  }
};
