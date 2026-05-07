-- ====================================================================================
-- COMPLETE SUPABASE SQL SETUP FOR ELEPHANT CONFLICT MONITORING SYSTEM
-- Copy and paste this ENTIRE script into the Supabase SQL Editor and click "Run"
-- ====================================================================================

-- 1. Create the Storage Bucket for Evidence Photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('evidence_photos', 'evidence_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'evidence_photos');

DROP POLICY IF EXISTS "Allow Uploads" ON storage.objects;
CREATE POLICY "Allow Uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'evidence_photos');

DROP POLICY IF EXISTS "Allow Updates" ON storage.objects;
CREATE POLICY "Allow Updates" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'evidence_photos');

-- 2. Create the Users Table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'FIELD_STAFF',
  range_division TEXT DEFAULT 'Unassigned',
  name TEXT NOT NULL DEFAULT 'Officer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create the Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  elephant_count INTEGER NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
  notes TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create the Alerts Table
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'UNREAD',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- 6. MVP RLS Policies: Allow all authenticated users to read/write freely for now
DROP POLICY IF EXISTS "Allow auth read users" ON public.users;
CREATE POLICY "Allow auth read users" ON public.users FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow auth read reports" ON public.reports;
CREATE POLICY "Allow auth read reports" ON public.reports FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow auth insert reports" ON public.reports;
CREATE POLICY "Allow auth insert reports" ON public.reports FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow auth read alerts" ON public.alerts;
CREATE POLICY "Allow auth read alerts" ON public.alerts FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow auth insert alerts" ON public.alerts;
CREATE POLICY "Allow auth insert alerts" ON public.alerts FOR INSERT TO authenticated WITH CHECK (true);

-- 7. Trigger: Automatically create a user profile when they sign up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, username, role, range_division, name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'FIELD_STAFF'),
    COALESCE(new.raw_user_meta_data->>'range_division', 'North Division'),
    COALESCE(new.raw_user_meta_data->>'name', 'New Officer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Trigger: Automatically create an alert when a HIGH severity report is inserted
CREATE OR REPLACE FUNCTION public.create_high_severity_alert()
RETURNS trigger AS $$
BEGIN
  IF NEW.severity = 'HIGH' THEN
    INSERT INTO public.alerts (report_id) VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS high_severity_alert_trigger ON public.reports;
CREATE TRIGGER high_severity_alert_trigger
  AFTER INSERT ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.create_high_severity_alert();

-- Enable Realtime for the reports table so the HQ Dashboard updates instantly
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'reports'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;
  END IF;
END
$$;
