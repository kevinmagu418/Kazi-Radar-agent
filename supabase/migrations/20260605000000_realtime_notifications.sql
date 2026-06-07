-- ====================================================
-- REAL-TIME SENTINEL NOTIFICATIONS
-- Migration Date: 2026-06-05
-- ====================================================

-- ----------------------------------------------------
-- 1. NOTIFICATIONS TABLE
-- ----------------------------------------------------
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'sentinel_match', 'system_alert', 'billing'
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    link TEXT, -- Optional link to opportunity or page
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON public.notifications
    FOR DELETE USING (auth.uid() = user_id);

-- ----------------------------------------------------
-- 3. UPDATED AUTO-VAULTING TRIGGER
-- ----------------------------------------------------
-- Enhance the existing trigger to also create a notification
CREATE OR REPLACE FUNCTION public.handle_auto_vaulting()
RETURNS TRIGGER AS $$
DECLARE
    u_tier user_tier_type;
    opp_title TEXT;
BEGIN
    -- Get user's current tier
    SELECT account_tier INTO u_tier FROM public.profiles WHERE id = NEW.user_id;
    
    -- Get opportunity title for the notification
    SELECT title INTO opp_title FROM public.opportunities WHERE id = NEW.opportunity_id;

    -- If user is premium and relevance score is high (>85)
    IF u_tier != 'free' AND NEW.relevance_score >= 85 THEN
        -- 1. Insert into Vault
        INSERT INTO public.user_vault (user_id, opportunity_id, sentinel_score, ai_strategy_notes)
        VALUES (
            NEW.user_id, 
            NEW.opportunity_id, 
            NEW.relevance_score,
            'Automated Sentinel Protection: High-value signal detected. Strategy: Prioritize this discovery.'
        )
        ON CONFLICT (user_id, opportunity_id) DO NOTHING;

        -- 2. Create Notification
        INSERT INTO public.notifications (user_id, type, title, content, link)
        VALUES (
            NEW.user_id,
            'sentinel_match',
            'Sentinel Discovery: ' || opp_title,
            'A high-value match has been secured in your vault with a ' || NEW.relevance_score || '% match score.',
            '/dashboard/sentinel'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
