# Kaziradar 🛰️

Kaziradar is an elite, human-centered opportunity scanner designed to uncover high-value signals across tech, agriculture, and fintech sectors. It features a modern AI "Scout" that scours the web to deliver verified opportunities directly to your personalized dashboard.

## ✨ New Features (v2.0 Refactor)

- **AI Scout Persona**: A friendly, human-centric interface that transforms technical data into simple, actionable discoveries.
- **Modern Dashboard**: A complete UI/UX overhaul using Next.js (App Router), Tailwind CSS, and Framer Motion for a "premium SaaS" feel.
- **Real-time Discovery**: Pulse-animated AI ingestion engine that shows the scout "thinking" while it finds opportunities.
- **Mobile Optimized**: A fully responsive, pill-based navigation system designed for operators on the go.
- **Cloud Ready**: Pre-configured Docker setup for the backend and Vercel-optimized frontend.

## 🏗️ Architecture

Kaziradar follows a modular, worker-based architecture orchestrated by **BullMQ** and **Redis**:

1.  **AI Scout (Frontend)**: The user-facing intelligence terminal that manages searches and displays discoveries.
2.  **Crawler**: Orchestrates discovery by identifying target sources based on user preferences.
3.  **Fetchers & Scrapers**:
    *   **Elite API Fetchers**: Data ingestion from YouTube, Reddit, Adzuna, Remotive, and World Bank.
    *   **Custom Scrapers**: Playwright-powered browser automation for high-value web targets.
4.  **AI Processor**: A LangChain-powered pipeline that uses **Llama 3.3 (via Groq)** to transform raw text into structured objects with **verified proof links**.
5.  **Database**: MongoDB stores both raw signals and processed opportunities.

## 🛠️ Technology Stack

### Frontend
*   **Framework**: Next.js 15+ (App Router)
*   **Styling**: Tailwind CSS 4.0
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **State**: React Hooks + Lucide

### Backend
*   **Runtime**: Node.js (ES Modules)
*   **Orchestration**: BullMQ + Redis
*   **AI/LLM**: LangChain + Groq (Llama 3.3-70b-versatile)
*   **Scraping**: Playwright
*   **Database**: MongoDB (Mongoose)

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- MongoDB (Atlas recommended for cloud)
- Redis (Upstash recommended for cloud)

### Environment Setup
Create a `.env` file in both `frontend` and `backend` directories.

**Backend (.env):**
```env
PORT=5000
MONGO_URI=your_mongodb_uri
REDIS_URL=your_redis_url
GROQ_API_KEY=your_groq_key
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Installation
```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Run servers
# Terminal 1
cd backend && npm run dev
# Terminal 2
cd frontend && npm run dev
```

## ☁️ Deployment

### Frontend (Vercel)
Connect your repository to Vercel. Ensure `NEXT_PUBLIC_API_URL` is set to your deployed backend URL.

### Backend (Koyeb / Render)
The backend is Dockerized. Use the provided `Dockerfile` to deploy to Koyeb or Render.
- **Memory Recommendation**: Minimum 512MB (Playwright requires sufficient RAM).
- **Redis**: Use Upstash Redis for a reliable free-tier connection.

---
*Kaziradar: Your street-smart AI scout for elite opportunity discovery.*
