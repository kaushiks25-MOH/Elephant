-- Enable pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to send Webpushr Notification
CREATE OR REPLACE FUNCTION public.send_webpushr_notification()
RETURNS TRIGGER AS $$
DECLARE
  notification_title TEXT;
  notification_body TEXT;
  webpushr_key TEXT := 'd214c406f2a643f5274c7654df70bbad';
  webpushr_token TEXT := '121277';
BEGIN
  -- Determine Message based on report type
  IF NEW.report_type = 'SIGHTING' THEN
    notification_title := '🚨 Elephant Sighting Alert!';
    notification_body := 'New sighting: ' || NEW.elephant_count || ' elephants reported. Location: ' || NEW.latitude || ', ' || NEW.longitude;
  ELSIF NEW.report_type = 'CLEARANCE' THEN
    notification_title := '✅ Area Cleared';
    notification_body := 'The area at ' || NEW.latitude || ', ' || NEW.longitude || ' has been reported as CLEAR.';
  ELSIF NEW.report_type = 'MANUAL' THEN
    -- For manual alerts, we expect the title to be in notes (formatted as Title|Body)
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

  -- Send request to Webpushr (Sidewide Broadcast)
  PERFORM net.http_post(
    url := 'https://api.webpushr.com/v1/notifications/sidewide',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'webpushrKey', webpushr_key,
      'webpushrAuthToken', webpushr_token
    ),
    body := jsonb_build_object(
      'title', notification_title,
      'message', notification_body,
      'target_url', 'https://elephant-conflict-monitor.vercel.app' -- Update if needed
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update Trigger to use Webpushr function
DROP TRIGGER IF EXISTS on_report_inserted_notification ON public.reports;
CREATE TRIGGER on_report_inserted_notification
AFTER INSERT ON public.reports
FOR EACH ROW
EXECUTE FUNCTION public.send_webpushr_notification();
