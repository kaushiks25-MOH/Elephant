-- Supabase SQL Setup for Elephant Conflict Monitoring System

-- 1. Create Storage Bucket for Evidence Photos
INSERT INTO storage.buckets (id, name, public) VALUES ('evidence_photos', 'evidence_photos', true);

-- Enable public access to the bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'evidence_photos');
CREATE POLICY "Allow Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'evidence_photos');

-- 2. Create Users Table (extends Supabase Auth)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('FIELD_STAFF', 'HQ_OFFICER', 'ADMIN')),
  range_division TEXT,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Reports Table
CREATE TABLE public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  elephant_count INTEGER NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
  notes TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Alerts Table
CREATE TABLE public.alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES public.reports(id) NOT NULL,
  status TEXT DEFAULT 'UNREAD',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS) but allow authenticated access for now
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Temporary MVP Policies: Allow all authenticated users to read/write
CREATE POLICY "Allow auth read users" ON public.users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth read reports" ON public.reports FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth insert reports" ON public.reports FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth read alerts" ON public.alerts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth insert alerts" ON public.alerts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 6. Trigger to automatically create an alert when a HIGH severity report is inserted
CREATE OR REPLACE FUNCTION create_high_severity_alert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.severity = 'HIGH' THEN
    INSERT INTO public.alerts (report_id) VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER high_severity_alert_trigger
AFTER INSERT ON public.reports
FOR EACH ROW
EXECUTE FUNCTION create_high_severity_alert();

-- 7. Seed Demo Users (Note: In Supabase, you must also create them in Auth, so run this AFTER creating them via the UI or API)
-- OR you can manually sign up via the app first, then update their roles in the users table.
