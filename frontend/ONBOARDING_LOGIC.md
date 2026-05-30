# KaziRadar Onboarding & Dynamic Filtering Logic

## 1. Role-to-Goal Mapping
Users select a role during onboarding which must dictate their default "Goal" and "Category" filters in the Dashboard.

| Onboarding Role | Default Goal Filter (`type`) | Default Categories (`interests`) |
|-----------------|------------------------------|---------------------------------|
| **Job Seeker**  | `job`                        | `tech`, `general`               |
| **Entrepreneur**| `entrepreneurial`            | `fintech`, `grants`             |
| **Explorer**    | `both` (all)                 | `all`                           |

## 2. Dashboard Integration Requirements
- **Default State:** On page load, the Dashboard must fetch the user's `profile` from Supabase and initialize `sectorFilter` and `typeFilter` based on the mapping above.
- **Dynamic Updates:** 
    - When a user changes filters on the Dashboard, these preferences should optionally persist to their `profiles` table in Supabase.
    - If a user triggers a manual "Scan", the selected categories/goals should update their `interests` and `onboarding_role` in the profile to keep the experience tailored.
- **Visuals:** The filter pills should reflect the current active state and sync with the user's saved preferences.

## 3. Backend Integration Requirements
- **Crawler/Fetcher:** The `discoverAndQueueSources` function should prioritize sources matching the user's active goals and categories.
- **AI Processor:** The AI should weigh opportunities higher if they match the user's defined role in their profile.

## 4. Supabase Schema Reference
- **Table:** `profiles`
- **Columns:**
    - `onboarding_role`: Enum (`job-seeker`, `entrepreneur`, `explorer`)
    - `interests`: Array of strings (`tech`, `agriculture`, `fintech`, `grants`, `general`)
    - `onboarding_completed`: Boolean
