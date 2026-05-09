-- 1. Add range column to reports table if it doesn't exist
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS range TEXT;

-- 2. Update OneSignal Notification Function to support MANUAL alerts
CREATE OR REPLACE FUNCTION public.send_onesignal_notification()
RETURNS TRIGGER AS $$
DECLARE
  notification_title TEXT;
  notification_body TEXT;
  app_id TEXT := 'c0f05ba1-1926-4a22-acb6-95cee85013c3';
  rest_api_key TEXT := 'os_v2_app_ydyfxiizezfcflfwsxhoquatymr6mzx373tuv6epi65nlzoltxbeu2sedeeydnxpmumxnrwi3lginjovk5ydnv63dwlmxmftyet3vwa';
BEGIN
  -- Determine Message based on report type
  IF NEW.report_type = 'SIGHTING' THEN
    notification_title := '🚨 Elephant Sighting Alert!';
    notification_body := 'New sighting: ' || NEW.elephant_count || ' elephants reported. Location: ' || NEW.latitude || ', ' || NEW.longitude;
  ELSIF NEW.report_type = 'CLEARANCE' THEN
    notification_title := '✅ Area Cleared';
    notification_body := 'The area at ' || NEW.latitude || ', ' || NEW.longitude || ' has been reported as CLEAR.';
  ELSIF NEW.report_type = 'MANUAL' THEN
    -- For manual alerts, we expect the title to be in notes (formatted as Title|Body) or just use notes as body
    IF NEW.notes LIKE '%|%' THEN
        notification_title := split_part(NEW.notes, '|', 1);
        notification_body := split_part(NEW.notes, '|', 2);
    ELSE
        notification_title := '🐘 Emergency Broadcast';
        notification_body := NEW.notes;
    END IF;
  ELSE
    notification_title := '🐘 Elephant Update';
    notification_body := 'A new report has been submitted.';
  END IF;

  -- Send request to OneSignal
  PERFORM net.http_post(
    url := 'https://onesignal.com/api/v1/notifications',
    headers := jsonb_build_object(
      'Content-Type', 'application/json; charset=utf-8',
      'Authorization', 'Basic ' || rest_api_key
    ),
    body := jsonb_build_object(
      'app_id', app_id,
      'included_segments', ARRAY['Total Subscriptions'],
      'headings', jsonb_build_object('en', notification_title),
      'contents', jsonb_build_object('en', notification_body),
      'data', jsonb_build_object(
        'report_id', NEW.id,
        'latitude', NEW.latitude,
        'longitude', NEW.longitude,
        'report_type', NEW.report_type
      )
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
