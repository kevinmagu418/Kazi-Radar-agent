-- Migration to add credits and support PayHero integration
-- Date: 2026-05-24

-- 1. Add scan_credits to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS scan_credits INTEGER DEFAULT 0;

-- 2. Ensure payment_transactions can store metadata like phone number
-- Note: This table (payment_transactions) is used as the system of record 
-- for the 'payments' logic requested in the implementation.
-- (Already has provider_metadata JSONB, which is good)

-- 3. Create RPC for incrementing credits safely
CREATE OR REPLACE FUNCTION public.increment_credits(p_user_id UUID, p_amount INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE public.profiles
    SET scan_credits = scan_credits + p_amount
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Add index for provider_transaction_id if not already there (it is, but for safety)
-- CREATE INDEX IF NOT EXISTS idx_transactions_provider_id ON public.payment_transactions(provider_transaction_id);
