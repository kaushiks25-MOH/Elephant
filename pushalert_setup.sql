-- 0. Ensure pg_net is enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 1. Create the PushAlert Notification Function
CREATE OR REPLACE FUNCTION public.send_pushalert_notification()
RETURNS TRIGGER AS $$
DECLARE
  notification_title TEXT;
  notification_message TEXT;
  pushalert_key TEXT := '23490baba1e2552a84d4377dba36b50b';
  target_url TEXT := 'https://rangerportel.vercel.app';
BEGIN
  -- Determine Message based on report type
  IF NEW.report_type = 'SIGHTING' THEN
    notification_title := '🚨 Elephant Sighting Alert!';
    notification_message := 'New sighting: ' || NEW.elephant_count || ' elephants reported. Range: ' || COALESCE(NEW.range, 'Unknown');
  ELSIF NEW.report_type = 'CLEARANCE' THEN
    notification_title := '✅ Area Cleared';
    notification_message := 'The area at ' || COALESCE(NEW.range, 'Current Location') || ' has been reported as CLEAR.';
  ELSIF NEW.report_type = 'MANUAL' THEN
    IF NEW.notes LIKE '%|%' THEN
        notification_title := split_part(NEW.notes, '|', 1);
        notification_message := split_part(NEW.notes, '|', 2);
    ELSE
        notification_title := '🚨 EMERGENCY BROADCAST';
        notification_message := NEW.notes;
    END IF;
  ELSE
    notification_title := '🚨 AECRCMC Alert';
    notification_message := 'New report logged in the monitoring system.';
  END IF;

  -- Send request via pg_net to PushAlert API
  -- Diagnostic signature: text (url), jsonb (body), jsonb (params), jsonb (headers), integer (timeout)
  BEGIN
    PERFORM
      net.http_post(
        'https://pushalert.co/api/v1/send'::text,
        jsonb_build_object(
          'title', notification_title,
          'message', notification_message,
          'url', target_url
        ),
        '{}'::jsonb,
        jsonb_build_object(
          'UR-API-Key', pushalert_key,
          'Content-Type', 'application/json'
        ),
        1000 -- timeout
      );
  EXCEPTION WHEN OTHERS THEN
    -- Log error but allow the report to be saved
    RAISE WARNING 'PushAlert Notification Failed: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Utility function for URL encoding (needed for form-urlencoded)
CREATE OR REPLACE FUNCTION public.urlencode(str text) RETURNS text AS $$
DECLARE
  _i int;
  _char text;
  _out text := '';
BEGIN
  FOR _i IN 1..length(str) LOOP
    _char := substring(str, _i, 1);
    IF _char ~ '[0-9a-zA-Z.~_-]' THEN
      _out := _out || _char;
    ELSE
      _out := _out || '%' || lpad(to_hex(ascii(_char)), 2, '0');
    END IF;
  END LOOP;
  RETURN _out;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Re-attach the trigger to the reports table
DROP TRIGGER IF EXISTS on_report_created_push ON public.reports;
CREATE TRIGGER on_report_created_push
  AFTER INSERT ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.send_pushalert_notification();
