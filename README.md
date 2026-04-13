# KaziRadar 🛰️

KaziRadar is an elite, multi-category opportunity scanner designed to uncover high-value signals across tech, agriculture, and fintech sectors. It combines real-time API ingestion with intelligent AI extraction to deliver verified opportunities directly to your database.

## 🏗️ Architecture

KaziRadar follows a modular, worker-based architecture orchestrated by **BullMQ** and **Redis**:

1.  **Crawler**: Orchestrates discovery by identifying target sources based on user preferences (Category & Goal).
2.  **Fetchers & Scrapers**:
    *   **Elite API Fetchers**: Reliable data ingestion from YouTube, Reddit, Adzuna, Remotive, and World Bank.
    *   **Custom Scrapers**: Playwright-powered browser automation for high-value web targets.
3.  **AI Processor**: A LangChain-powered pipeline that uses **Llama 3 (via Groq)** to transform messy raw text and JSON into structured objects with **verified proof links**.
4.  **Database**: MongoDB stores both raw signals and processed opportunities.

## 🛠️ Technology Stack

*   **Runtime**: Node.js (ES Modules)
*   **Language**: TypeScript
*   **Orchestration**: BullMQ + Redis
*   **AI/LLM**: LangChain + Groq (Llama 3)
*   **Scraping**: Playwright
*   **API Framework**: Express.js
*   **Database**: MongoDB (Mongoose)
*   **Logging**: Pino

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- Redis

### Environment Setup
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/kaziradar
REDIS_URL=redis://localhost:6379

# AI Keys
GROQ_API_KEY=your_groq_key

# API Provider Keys
YOUTUBE_API_KEY=your_youtube_key
ADZUNA_APP_ID=your_id
ADZUNA_APP_KEY=your_key
REDDIT_CLIENT_ID=your_id
REDDIT_CLIENT_SECRET=your_secret
REDDIT_USER_AGENT=KaziRadar/1.0
```

### Installation
```bash
npm install
npm run build
npm run dev
```

## 📡 API Documentation

### 1. Trigger customized Scan
`POST /api/scan`
Trigger the agent to search for specific categories.
**Request Body:**
```json
{
  "categories": ["tech", "agriculture"],
  "goals": ["jobs", "entrepreneurial"]
}
```

### 2. Fetch Opportunities
`GET /api/opportunities?category=tech`
Retrieve processed insights with verified links.

### 3. Pipeline Health
`GET /api/status`
Check if MongoDB and Redis connections are healthy.

### 4. System Stats
`GET /api/stats`
View counts for active sources, raw data, and processed opportunities.

## 📊 Monitoring

KaziRadar includes **Bull Board** for real-time queue monitoring.
- **Dashboard**: `http://localhost:5000/admin/queues`
- Use this to inspect jobs, watch worker progress, and retry fails.

## 🧪 Pipeline Verification
Run the end-to-end test utility to verify the full flow:
```bash
npx tsx src/modules/utils/testPipeline.ts
```

---
*Built with precision for elite opportunity discovery.*
