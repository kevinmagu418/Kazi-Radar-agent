-- ====================================================
-- USER STATUS AND DEACTIVATION
-- Migration Date: 2026-06-15
-- ====================================================

-- ----------------------------------------------------
-- 1. ADD STATUS TO PROFILES
-- ----------------------------------------------------
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='status') THEN
        ALTER TABLE public.profiles ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'deactivated'));
    END IF;
END $$;

-- ----------------------------------------------------
-- 2. UPDATE RLS FOR DEACTIVATED USERS
-- ----------------------------------------------------
-- Ensure deactivated users can't be seen by others if you ever add public profile search
-- For now, ensure the user can still access their own profile to reactivate if needed, 
-- or block access entirely depending on preference.

-- Update Select Policy to only allow active profiles or the user themselves
-- (Assuming they might need to login to reactivate)
DROP POLICY IF EXISTS "Allow users to read their own profiles" ON public.profiles;
CREATE POLICY "Allow users to read their own profiles" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Logic: If status is deactivated, we can handle it in middleware or on the frontend.
