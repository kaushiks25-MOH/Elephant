-- UPDATE REPORTS TABLE FOR CLEARANCE & DAMAGE REPORTING
-- Run this in the Supabase SQL Editor

-- 1. Add new columns to the reports table
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS report_type TEXT DEFAULT 'SIGHTING' CHECK (report_type IN ('SIGHTING', 'CLEARANCE')),
ADD COLUMN IF NOT EXISTS is_clear BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS damage_desc TEXT,
ADD COLUMN IF NOT EXISTS casualties INTEGER DEFAULT 0;

-- 2. Update storage policy for public uploads (if not already done)
-- Allowing anon (public) to upload to evidence_photos for the sighting portal
DROP POLICY IF EXISTS "Allow Public Uploads" ON storage.objects;
CREATE POLICY "Allow Public Uploads" ON storage.objects 
FOR INSERT TO anon, authenticated 
WITH CHECK (bucket_id = 'evidence_photos');
