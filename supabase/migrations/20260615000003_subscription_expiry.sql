-- ====================================================
-- SUBSCRIPTION EXPIRY CLEANUP FUNCTION
-- Migration Date: 2026-06-15
-- ====================================================

-- 1. Create the robust cleanup function
-- This function can be called by the backend, cron, or frontend RPC
CREATE OR REPLACE FUNCTION public.handle_subscription_expiry()
RETURNS VOID AS $$
BEGIN
    -- Step A: Revert account_tier to 'free' and reset credits for expired users
    UPDATE public.profiles p
    SET 
        account_tier = 'free',
        scan_credits = 0,
        updated_at = NOW()
    FROM public.subscriptions s
    WHERE s.user_id = p.id
    AND s.status = 'active'
    AND s.current_period_end < NOW();

    -- Step B: Update the subscription status to 'expired'
    UPDATE public.subscriptions
    SET 
        status = 'expired',
        updated_at = NOW()
    WHERE status = 'active'
    AND current_period_end < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Call this function from the backend or a cron job.
-- Triggering on SELECT is not supported in PostgreSQL.
