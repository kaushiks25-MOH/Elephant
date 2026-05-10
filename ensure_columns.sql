-- Add voice_url and range to reports table if missing
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS voice_url TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS range TEXT;

-- Add Detailed Field Reporting Columns
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS officer_name TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS designation TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS team_members TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS bull_count INTEGER DEFAULT 0;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS makhna_count INTEGER DEFAULT 0;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS male_group_count INTEGER DEFAULT 0;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS female_group_count INTEGER DEFAULT 0;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS female_calf_count INTEGER DEFAULT 0;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS single_female_count INTEGER DEFAULT 0;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS is_damage_caused BOOLEAN DEFAULT FALSE;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS damage_type TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS chase_start_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS chase_result TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS remarks TEXT;
