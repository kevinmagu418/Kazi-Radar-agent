-- ====================================================
-- DISCOVERY PREFERENCES ENHANCEMENT
-- Migration Date: 2026-06-15
-- ====================================================

-- 1. Add sensitivity and email_alerts columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS sensitivity INTEGER DEFAULT 75,
ADD COLUMN IF NOT EXISTS email_alerts BOOLEAN DEFAULT true;

-- 2. Update existing data if necessary
UPDATE public.profiles SET sensitivity = 75 WHERE sensitivity IS NULL;
UPDATE public.profiles SET email_alerts = true WHERE email_alerts IS NULL;
