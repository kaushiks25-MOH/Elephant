-- Add this to your Supabase SQL Editor to automatically create a user profile when they sign up!

-- 1. Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, username, role, range_division, name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'FIELD_STAFF'), -- Default to FIELD_STAFF if no role provided
    COALESCE(new.raw_user_meta_data->>'range_division', 'Unassigned'),
    COALESCE(new.raw_user_meta_data->>'name', 'New Officer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger that fires whenever a new user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
