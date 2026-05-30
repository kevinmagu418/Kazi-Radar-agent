-- ====================================================
-- KAZIRADAR SUPABASE / POSTGRES SCHEMA MIGRATION
-- Migration Date: 2026-05-24
-- ====================================================

-- ----------------------------------------------------
-- 1. DATABASE CUSTOM ENUMS
-- ----------------------------------------------------
CREATE TYPE user_tier_type AS ENUM ('free', 'flex', 'monthly', 'quarterly');
CREATE TYPE onboarding_role_type AS ENUM ('job-seeker', 'entrepreneur', 'explorer');
CREATE TYPE interaction_type AS ENUM ('view', 'click', 'hide', 'bookmark');
CREATE TYPE payment_status_type AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE subscription_status_type AS ENUM ('active', 'expired', 'canceled', 'past_due');
CREATE TYPE payment_provider_type AS ENUM ('mpesa', 'card');

-- ----------------------------------------------------
-- 2. HELPER FUNCTIONS & TRIGGERS
-- ----------------------------------------------------

-- Trigger to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------
-- 3. SCHEMA TABLES
-- ----------------------------------------------------

-- Profiles Table (Extends Supabase Auth users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    onboarding_role onboarding_role_type DEFAULT 'job-seeker',
    interests TEXT[] DEFAULT '{}',
    preferences JSONB DEFAULT '{}'::jsonb,
    account_tier user_tier_type DEFAULT 'free',
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Opportunities Table (System of record for surfaced opportunities sync'd from MongoDB)
CREATE TABLE public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_hash TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    location TEXT,
    relevance_score INTEGER DEFAULT 0,
    description TEXT,
    proof_links TEXT[] DEFAULT '{}',
    url TEXT NOT NULL,
    provider_name TEXT,
    original_url TEXT,
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ DEFAULT NOW(),
    scoring JSONB DEFAULT '{}'::jsonb,
    enrichment JSONB DEFAULT '{}'::jsonb,
    explanation JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Bookmarks / Saved Opportunities Table
CREATE TABLE public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, opportunity_id)
);

-- Opportunity Interactions (Analytics & recommendation feedback loop)
CREATE TABLE public.opportunity_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    interaction_type interaction_type NOT NULL,
    interacted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User Scans (History of scans run by user)
CREATE TABLE public.user_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    categories TEXT[] DEFAULT '{}',
    goals TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    results_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Intelligence Feed (Personalized Opportunity Feed memory cache)
CREATE TABLE public.intelligence_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    relevance_score INTEGER DEFAULT 0,
    why_surfaced TEXT,
    status TEXT DEFAULT 'unseen' CHECK (status IN ('unseen', 'seen', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, opportunity_id)
);

-- Subscriptions Table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tier user_tier_type NOT NULL DEFAULT 'free',
    status subscription_status_type NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ, -- NULL for free tier (infinite duration)
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Payment Transactions Table
CREATE TABLE public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'KES' NOT NULL,
    payment_method payment_provider_type NOT NULL DEFAULT 'mpesa',
    provider_transaction_id TEXT UNIQUE NOT NULL, -- M-Pesa Receipt Code, etc.
    status payment_status_type NOT NULL DEFAULT 'pending',
    provider_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------
-- 4. DATABASE INDEXES FOR OPTIMAL PERFORMANCE
-- ----------------------------------------------------
CREATE INDEX idx_opportunities_category_type ON public.opportunities(category, type);
CREATE INDEX idx_opportunities_relevance ON public.opportunities(relevance_score DESC);
CREATE INDEX idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX idx_interactions_user_opp ON public.opportunity_interactions(user_id, opportunity_id);
CREATE INDEX idx_feed_user_status ON public.intelligence_feed(user_id, status);
CREATE INDEX idx_subscriptions_user_status ON public.subscriptions(user_id, status);
CREATE INDEX idx_transactions_provider_id ON public.payment_transactions(provider_transaction_id);

-- ----------------------------------------------------
-- 5. TRIGGER REGISTRATIONS
-- ----------------------------------------------------

-- Register update_updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_intelligence_feed_updated_at BEFORE UPDATE ON public.intelligence_feed FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON public.payment_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auth user creation sync trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    role_val text;
    plan_val text;
    role_enum onboarding_role_type;
    plan_enum user_tier_type;
BEGIN
    role_val := NEW.raw_user_meta_data->>'onboarding_role';
    plan_val := NEW.raw_user_meta_data->>'onboarding_plan';
    
    -- Map string representation to enum safely
    CASE role_val
        WHEN 'job-seeker' THEN role_enum := 'job-seeker'::onboarding_role_type;
        WHEN 'entrepreneur' THEN role_enum := 'entrepreneur'::onboarding_role_type;
        WHEN 'explorer' THEN role_enum := 'explorer'::onboarding_role_type;
        ELSE role_enum := 'job-seeker'::onboarding_role_type;
    END CASE;

    CASE plan_val
        WHEN 'free' THEN plan_enum := 'free'::user_tier_type;
        WHEN 'flex' THEN plan_enum := 'flex'::user_tier_type;
        WHEN 'monthly' THEN plan_enum := 'monthly'::user_tier_type;
        WHEN 'quarterly' THEN plan_enum := 'quarterly'::user_tier_type;
        ELSE plan_enum := 'free'::user_tier_type;
    END CASE;

    INSERT INTO public.profiles (
        id, 
        full_name, 
        onboarding_role, 
        account_tier,
        onboarding_completed,
        scan_credits
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        role_enum,
        plan_enum,
        (role_val IS NOT NULL AND plan_val IS NOT NULL),
        30
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Allow users to read their own profiles" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update their own profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Opportunities Policies (Open read to authenticated users, service role writes)
CREATE POLICY "Allow authenticated read access to opportunities" ON public.opportunities FOR SELECT TO authenticated USING (true);

-- Bookmarks Policies
CREATE POLICY "Allow users to read their own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Opportunity Interactions Policies
CREATE POLICY "Allow users to read their own interactions" ON public.opportunity_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own interactions" ON public.opportunity_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Scans Policies
CREATE POLICY "Allow users to read their own scans" ON public.user_scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own scans" ON public.user_scans FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Intelligence Feed Policies
CREATE POLICY "Allow users to read their own intelligence feed" ON public.intelligence_feed FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own intelligence feed" ON public.intelligence_feed FOR UPDATE USING (auth.uid() = user_id);

-- Subscriptions Policies
CREATE POLICY "Allow users to read their own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Payment Transactions Policies
CREATE POLICY "Allow users to read their own payment transactions" ON public.payment_transactions FOR SELECT USING (auth.uid() = user_id);
