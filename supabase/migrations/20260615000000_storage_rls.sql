-- ====================================================
-- STORAGE BUCKETS AND RLS POLICIES
-- Migration Date: 2026-06-15
-- ====================================================

-- ----------------------------------------------------
-- 1. CREATE AVATARS BUCKET
-- ----------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------
-- 2. ENABLE RLS ON STORAGE.OBJECTS
-- ----------------------------------------------------
-- Note: Usually enabled by default in Supabase, but good to ensure
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- 3. STORAGE POLICIES FOR 'AVATARS' BUCKET
-- ----------------------------------------------------

-- Policy: Allow anyone to view avatars (Public Read)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

-- Policy: Allow authenticated users to upload to their own folder
-- Path structure: avatars/{user_id}/{filename}
CREATE POLICY "Authenticated users can upload an avatar." 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar." 
ON storage.objects FOR UPDATE 
TO authenticated
USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar." 
ON storage.objects FOR DELETE 
TO authenticated
USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);
