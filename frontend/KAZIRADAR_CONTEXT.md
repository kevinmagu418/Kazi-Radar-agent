# KaziRadar Product Context

## 🛰️ Product Summary
KaziRadar is an elite, human-centered opportunity scanner designed to uncover high-value signals across tech, agriculture, and fintech sectors. It uses a modern AI "Scout" to deliver verified, deduplicated opportunities directly to a personalized dashboard.

## 👥 Target User Types
- **Job Seekers:** Individuals looking for their next career move, internships, or gigs.
- **Entrepreneurs:** Founders and innovators searching for funding, grants, and strategic projects.
- **Explorers:** Curious minds and researchers looking for emerging trends and niche opportunities.

## 🚀 Onboarding Categories
During onboarding, users identify as one of the following:
- **Job Seeker**
- **Entrepreneur**
- **Explorer**

## 💰 Pricing Tiers & Business Model
KaziRadar is designed to be affordable for students and early-career professionals while remaining premium enough for sustainable revenue.

| Tier | Name | Price | Features |
| :--- | :--- | :--- | :--- |
| **Free** | Scout Basic | KES 0 | 30 streamings per month |
| **Flex** | 5-Day Pack | KES 200 | Full access for 5 days |
| **Monthly** | Standard | KES 1,200 | Full monthly access |
| **Quarterly** | Premium | KES 3,000 | Full quarterly access (Best Value) |

## ✅ Decisions Already Made
- **UX Direction:** Modern, intuitive, premium, and business-grade.
- **Visual Style:** "Tilt-style" dark theme with primary pink (#FF4D8D) highlights and glassmorphism.
- **Onboarding Flow:** Role Selection -> Plan Selection -> Dashboard.
- **Upgrade Strategy:** Encourage upgrades through value (not by making free users miserable).

## 🔒 What Must Remain Unchanged
- The core AI "Scout" persona and its human-centric interface.
- The modular, worker-based backend architecture (BullMQ + Redis).
- The focus on high-trust, verified signals over raw data.

## ⏳ Deferred for Later Phases
- **Payment Gateway:** Manual/Mock payments for now.
- **Complex Billing Logic:** To be handled after payment gateway integration.

## 🔐 Authentication & User Identity
Implemented using **Supabase Auth** with a focus on modern SaaS security and user experience.

### Supported Methods
- **Email & Password:** Standard secure signup and login.
- **OAuth (Social):** One-tap login via **Google** and **GitHub**.
- **Self-Service:** Full flows for Password Reset and Email Verification.

### Integration with Onboarding
The onboarding journey is fully integrated with user identity:
1. **Persona Selection:** Captured during onboarding.
2. **Plan Selection:** Captured during onboarding.
3. **Atomic Account Creation:** Onboarding data is passed to the Signup phase and stored as `user_metadata` in Supabase, ensuring the user's intelligence terminal is pre-configured upon their first login.

### UX Features
- **Social-First:** Social login options are prioritized to reduce friction.
- **Visual Feedback:** Loading states, animated transitions, and success/error indicators throughout the auth lifecycle.
- **Safety Loops:** Easy "Back to safety" navigation and clear calls to action.

## 🛠️ Supabase Database Schema
To support the intelligence pipeline, the following table is required in your Supabase project:

```sql
-- Opportunities Table (The system of record for surfaced intelligence)
create table public.opportunities (
  id uuid default gen_random_uuid() primary key,
  content_hash text unique not null,
  title text not null,
  category text not null,
  type text not null,
  location text,
  relevance_score integer default 0,
  description text,
  proof_links text[],
  url text not null,
  provider_name text,
  original_url text,
  scraped_at timestamp with time zone default now(),
  processed_at timestamp with time zone default now(),
  scoring jsonb,
  enrichment jsonb,
  explanation jsonb
);

-- Enable RLS and setup public read access (or scoped based on plan)
alter table public.opportunities enable row level security;
create policy "Allow public read access for all" on public.opportunities for select using (true);
```
