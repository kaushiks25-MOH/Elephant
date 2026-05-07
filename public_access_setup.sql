-- RELAX RLS FOR PUBLIC ACCESS (NO SIGN-IN REQUIRED)
-- Run this in the Supabase SQL Editor

-- 1. Allow anyone (including anon) to read reports
DROP POLICY IF EXISTS "Allow auth read reports" ON public.reports;
CREATE POLICY "Allow public read reports" ON public.reports FOR SELECT USING (true);

-- 2. Allow anyone (including anon) to insert reports
DROP POLICY IF EXISTS "Allow auth insert reports" ON public.reports;
CREATE POLICY "Allow public insert reports" ON public.reports FOR INSERT WITH CHECK (true);

-- 3. Allow anyone (including anon) to read alerts
DROP POLICY IF EXISTS "Allow auth read alerts" ON public.alerts;
CREATE POLICY "Allow public read alerts" ON public.alerts FOR SELECT USING (true);

-- 4. Allow anyone (including anon) to insert alerts
DROP POLICY IF EXISTS "Allow auth insert alerts" ON public.alerts;
CREATE POLICY "Allow public insert alerts" ON public.alerts FOR INSERT WITH CHECK (true);

-- 5. Allow public read on users (if needed for profile names)
DROP POLICY IF EXISTS "Allow auth read users" ON public.users;
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
