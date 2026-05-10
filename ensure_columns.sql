-- Add voice_url to reports table if missing
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS voice_url TEXT;

-- Ensure range column exists
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS range TEXT;
