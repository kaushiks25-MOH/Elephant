-- ADD VOICE NOTE SUPPORT TO REPORTS
-- Run this in the Supabase SQL Editor

-- 1. Add voice_url column to reports table
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS voice_url TEXT;

-- 2. Ensure evidence_photos bucket exists (already created, but good to have)
-- We will store voice notes here as well for simplicity
