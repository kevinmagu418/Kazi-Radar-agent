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
  logger.error("GROQ_API_KEY is missing from environment variables.");
}

const model8b = new ChatGroq({
  apiKey: GROQ_API_KEY as string,
  model: "llama-3.1-8b-instant",
  temperature: 0,
});

const model70b = new ChatGroq({
  apiKey: GROQ_API_KEY as string,
  model: "llama-3.1-70b-versatile",
  temperature: 0.1,
});

const parser = new JsonOutputParser();

const getPromptTemplate = (isPaid: boolean) => {
  const baseInstructions = `You are an expert AI assistant specializing in identifying opportunities from raw data.
  Extract all opportunities found in the text provided below.

  Categories can be: tech, fintech, agriculture, grants, general.
  Types can be: job, internship, grant, gig, volunteer, entrepreneurial.
  Use 'entrepreneurial' for business opportunities, startup funding, tenders, and projects.

  For each opportunity, extract:
  - title (string)
  - category (string)
  - type (string)
  - location (string)
  - relevanceScore (number between 1-100)
  - proofLinks (array of strings, extract URLs that verify this opportunity)`;

  const paidInstructions = `
  - explanation (string, provide a personalized 1-sentence explanation of why this is a high-value opportunity, focusing on the specific benefits for an innovator or seeker)`;

  const outputFormat = `
  Output MUST be a JSON array of objects.

  Raw Data:
  {text}

  Output JSON:`;

  return PromptTemplate.fromTemplate(
    `${baseInstructions}${isPaid ? paidInstructions : ""}${outputFormat}`
  );
};

export const extractOpportunities = async (data: any, tier: string = "free") => {
  try {
    const isPaid = tier !== "free";
    const model = isPaid ? model70b : model8b;
    const prompt = getPromptTemplate(isPaid);

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
      prompt,
      model,
      parser
    ]);
    
    const result = await chain.invoke({ text: truncatedText });
    
    return result as any[];
  } catch (error) {
    logger.error(`AI Processing Error: ${error}`);
    return [];
  }
};
