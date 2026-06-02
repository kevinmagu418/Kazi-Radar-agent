-- ====================================================
-- KAZIRADAR SCOUT SENTINEL (PREMIUM FEATURES)
-- Migration Date: 2026-06-02
-- ====================================================

-- ----------------------------------------------------
-- 1. SCOUT SENTINEL VAULT
-- ----------------------------------------------------
-- Automatically persists high-value opportunities for premium users
CREATE TABLE public.user_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    archived_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ai_strategy_notes TEXT, -- Premium AI-generated application tips
    sentinel_score INTEGER, -- The relevance score at time of archival
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dismissed')),
    UNIQUE(user_id, opportunity_id)
);

-- ----------------------------------------------------
-- 2. MARKET PULSE & TRENDS
-- ----------------------------------------------------
-- Stores aggregated trend data for the Intelligence Dashboard
CREATE TABLE public.market_pulse (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    trend_direction TEXT CHECK (trend_direction IN ('up', 'down', 'stable')),
    growth_percentage NUMERIC(5, 2),
    volume_count INTEGER,
    insight_summary TEXT,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------
-- 3. BEHAVIORAL ACTIVITY LOGS
-- ----------------------------------------------------
-- Tracks what users interact with to tune the "Poke" logic
CREATE TABLE public.scout_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL, -- 'view', 'ignore', 'save', 'apply_intent'
    duration_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------
ALTER TABLE public.user_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_pulse ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scout_activity_logs ENABLE ROW LEVEL SECURITY;

-- Vault Policies (Restricted to Paid Tiers)
-- Logic: users can only see vault entries if they have a non-free account_tier
CREATE POLICY "Premium Vault Access" ON public.user_vault
    FOR SELECT 
    USING (
        auth.uid() = user_id 
        AND (SELECT account_tier FROM public.profiles WHERE id = auth.uid()) != 'free'
    );

CREATE POLICY "Premium Vault Insert" ON public.user_vault
    FOR INSERT 
    WITH CHECK (
        auth.uid() = user_id 
        AND (SELECT account_tier FROM public.profiles WHERE id = auth.uid()) != 'free'
    );

-- Market Pulse (Read access for Paid Tiers only)
CREATE POLICY "Premium Pulse Read" ON public.market_pulse
    FOR SELECT 
    USING (
        (SELECT account_tier FROM public.profiles WHERE id = auth.uid()) != 'free'
    );

-- Activity Logs (Users can only insert their own logs)
CREATE POLICY "User Activity Log Insert" ON public.scout_activity_logs
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------
-- 5. TRIGGER FOR AUTO-VAULTING
-- ----------------------------------------------------
-- Automatically archives opportunities with score > 85 for premium users
CREATE OR REPLACE FUNCTION public.handle_auto_vaulting()
RETURNS TRIGGER AS $$
DECLARE
    u_tier user_tier_type;
BEGIN
    -- Get user's current tier
    SELECT account_tier INTO u_tier FROM public.profiles WHERE id = NEW.user_id;

    -- If user is premium and relevance score is high (>85)
    IF u_tier != 'free' AND NEW.relevance_score >= 85 THEN
        INSERT INTO public.user_vault (user_id, opportunity_id, sentinel_score, ai_strategy_notes)
        VALUES (
            NEW.user_id, 
            NEW.opportunity_id, 
            NEW.relevance_score,
            'Automated Sentinel Protection: High-value signal detected. Strategy: Prioritize this discovery.'
        )
        ON CONFLICT (user_id, opportunity_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_intelligence_feed_entry
    AFTER INSERT OR UPDATE ON public.intelligence_feed
    FOR EACH ROW EXECUTE FUNCTION public.handle_auto_vaulting();
