-- ====================================================
-- KAZIRADAR BEHAVIORAL INTELLIGENCE (AFFINITY ENGINE)
-- Migration Date: 2026-06-02
-- ====================================================

-- 1. ADD AFFINITY PROFILE TO USER
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS affinity_score JSONB DEFAULT '{}'::jsonb;

-- 2. AFFINITY SCORING FUNCTION
-- This function calculates the interest level per category based on actions
CREATE OR REPLACE FUNCTION public.sync_user_affinity()
RETURNS TRIGGER AS $$
DECLARE
    opp_category TEXT;
    weight INTEGER;
    current_score INTEGER;
BEGIN
    -- Determine weight based on action
    -- Actions from scout_activity_logs or bookmarks
    IF (TG_TABLE_NAME = 'bookmarks') THEN
        weight := 15; -- High intent
    ELSE
        CASE NEW.action_type
            WHEN 'click' THEN weight := 10;
            WHEN 'view' THEN weight := 1;
            WHEN 'ignore' THEN weight := -5;
            WHEN 'apply_intent' THEN weight := 20;
            ELSE weight := 0;
        END CASE;
    END IF;

    -- Get the category of the opportunity
    -- Use COALESCE to handle deleted opportunities
    SELECT category INTO opp_category FROM public.opportunities WHERE id = NEW.opportunity_id;
    
    IF opp_category IS NOT NULL THEN
        -- Update the JSONB map
        -- Get current category score or 0
        current_score := COALESCE((SELECT (affinity_score->>opp_category)::int FROM public.profiles WHERE id = NEW.user_id), 0);
        
        -- Update profile with new score (capped at 0 for negative, 1000 for max)
        UPDATE public.profiles 
        SET affinity_score = affinity_score || jsonb_build_object(opp_category, GREATEST(0, LEAST(1000, current_score + weight)))
        WHERE id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. TRIGGERS
-- Trigger on activity logs
CREATE OR REPLACE TRIGGER on_scout_activity
    AFTER INSERT ON public.scout_activity_logs
    FOR EACH ROW EXECUTE FUNCTION public.sync_user_affinity();

-- Trigger on bookmarks
CREATE OR REPLACE TRIGGER on_bookmark_affinity
    AFTER INSERT ON public.bookmarks
    FOR EACH ROW EXECUTE FUNCTION public.sync_user_affinity();
