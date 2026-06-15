# Kaziradar 🛰️

Kaziradar is an elite, human-centered opportunity scanner designed to uncover high-value signals across tech, agriculture, and fintech sectors. It features a modern AI "Scout" that scours the web to deliver verified, deduplicated opportunities directly to a high-performance dashboard.

## 💰 SaaS Business Model & Plan Tiers

Kaziradar uses a credit-based system for basic users and unlimited access for professional tiers.

| Tier | Name | Price | Features | AI Model |
| :--- | :--- | :--- | :--- | :--- |
| **Free** | Scout Basic | KES 0 | 30 scan credits, basic matching | Llama 3.1 8B |
| **Flex** | 5-Day Pack | KES 200 | Unlimited scans (5 days), priority discovery | Llama 3.1 70B |
| **Standard** | Monthly | KES 1,200 | Unlimited scans, continuous scout, AI insights | Llama 3.1 70B |
| **Premium** | Quarterly | KES 3,000 | Best value, multi-sector scout, early features | Llama 3.1 70B |

### 🧠 Intelligence & Model Tiering
The system dynamically scales AI intelligence based on the user's plan:
*   **Standard Matching (Free)**: Uses lightweight models (8B) for fast, cost-effective classification and basic relevance scoring.
*   **Deep Matching (Paid)**: Employs large-scale models (70B) for nuanced extraction of "entrepreneurial signals," complex tender analysis, and generating **Personalized AI Insights**.
*   **Scout Sentinel (Premium)**: A private Intelligence Vault that automatically archives high-value opportunities (>85% relevance) and provides a **Market Pulse** dashboard for tracking sector trends and competition.
*   **Behavioral Intelligence Layer**: An Amazon-like "Affinity Engine" that studies user interactions (clicks, saves, views) to dynamically adjust relevance and personalize the discovery feed in real-time.

### 🛰️ Personalized Intelligence Feed
Unlike traditional boards, every paid user receives a **Personalized Intelligence Feed**. The AI analyzes their specific interests and "explains" exactly why a particular opportunity is a high-value match for their specific goals.

## 🏗️ Architecture & Distributed Scaling

Kaziradar is engineered as a resilient, distributed system designed for high throughput and cost efficiency.

### 🧩 Independent Worker Pools
The system supports horizontal scaling via segmented worker pools. Each layer can be scaled independently based on load:
*   **Crawler Workers**: Manage source discovery and job scheduling.
*   **Scraper Workers**: Execute Playwright-based browser automation (High RAM/CPU).
*   **API Fetchers**: Lightweight workers for high-speed API data ingestion.
*   **AI Processors**: Handle LLM inference and deep intelligence extraction (High Latency).

### ⚡ Smart Queue Prioritization
Powered by **BullMQ**, the system uses a 1-100 priority scale:
*   **Quality-Based Priority**: Opportunities from high-trust sources (e.g., World Bank, Adzuna) are automatically prioritized (Priority 1-20).
*   **Fairness Logic**: Ensures low-priority "experimental" sources are processed without starving the high-value queues.

## 🛡️ Reliability & Anti-Bot Protection

We treat web scraping as a **reliability engineering** problem.

### 🧩 Stealth & Resilience
*   **Fingerprint Hardening**: Overrides `navigator.webdriver` and disables automation-controlled flags.
*   **Identity Rotation**: Dynamic User-Agent shuffling from a pool of high-reputation signatures.
*   **Self-Healing (Circuit Breaker)**: Blocked sources (403/429) enter an **exponential backoff** cooldown (1-24 hours) to prevent IP blacklisting.

## 💎 Intelligence & Data Quality

Kaziradar prioritizes **Insight over Data**.

### 📊 Multi-dimensional Scoring
Opportunities are ranked by a deterministic formula:
`Score = (Source Credibility * 0.25) + (Freshness * 0.20) + (AI Relevance * 0.30) + (Competition * 0.10) + (Trend * 0.15)`

### 🧠 Semantic Deduplication
*   **Hard Dedup**: Exact URL matching.
*   **Soft Dedup**: Title normalization and fuzzy matching across different providers.
*   **Content Hashing**: SHA-256 fingerprinting for exactly-once processing logic.

### 📝 Explainability & Enrichment
Every discovery includes:
*   **Human-Readable "Why"**: Context on why the system surfaced the signal.
*   **Deep Enrichment**: Automatic extraction of skills, competition levels, and market trends.

## 💰 Cost Optimization Strategy

To keep AI inference costs sustainable at scale:
*   **AI Output Caching**: Redis-based caching of LLM results (7-day TTL) using content hashes. Skips redundant AI processing for identical content.
*   **Atomic Claiming**: Prevents double-processing of records in a distributed environment.
*   **Context Truncation**: Optimized prompt density to minimize token usage while maintaining high extraction quality.

## 🛠️ Technology Stack

### Backend (Intelligence)
*   **Runtime**: Node.js (ES Modules)
*   **Orchestration**: BullMQ + Redis
*   **AI Engine**: LangChain + Groq (Llama 3.3-70b)
*   **Validation**: Zod (Strict Schema Enforcement)
*   **Database**: MongoDB (Mongoose)
*   **Scraping**: Playwright + Stealth Config

### Frontend (Dashboard)
*   **Framework**: Next.js 15+ (App Router)
*   **Styling**: Tailwind CSS 4.0
*   **Animations**: Framer Motion (Real-time Pulse)
*   **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- MongoDB & Redis (Cloud or Local)
- Groq API Key

### Installation
```bash
# Install all dependencies
cd backend && npm install
cd ../frontend && npm install

# Start the Intelligence Engine (Backend)
cd backend && npm run dev

# Start the Dashboard (Frontend)
cd frontend && npm run dev
```

---
*Kaziradar: Street-smart AI intelligence for elite opportunity discovery.*

## 📓 Release Notes - June 15, 2026

### 🌍 Global Geographical Expansion
*   **Expanded Database**: Upgraded the country database from 20 to 150+ countries in `frontend/src/lib/countries.ts`.
*   **Advanced Search**: Implemented a real-time, filtered country picker in the profile form to replace the static dropdown, enabling faster navigation across global markets.

### 🧠 Mission-Driven AI Personalization
*   **Personalization Context Injection**: The AI "Scout" now incorporates the user's **Mission Statement** (Venture Mission) and **Interests** directly into the extraction prompt.
*   **Dynamic Relevance Scoring**: Opportunity `relevanceScore` is now calculated based on alignment with the user's specific mission.
*   **Intelligent Fallback**: Refined AI logic to handle empty profiles, ensuring high-quality general discovery while incentivizing personalization for better accuracy.
*   **Personalized Explanations**: Improved AI-generated insights for paid tiers to explain exactly why an opportunity aligns with the user's specific venture goals.

### 🎨 UI & UX Improvements
*   **Scout Efficiency Visuals**: Enhanced the profile efficiency section with a dynamic avatar/placeholder system and polished backdrop effects.
*   **Gamified Progress**: Balanced the profile completion logic to reflect the importance of the Mission Statement in driving engine accuracy.
*   **Aesthetic Refinement**: Applied modern glassmorphism and subtle animations to the profile management interface.
