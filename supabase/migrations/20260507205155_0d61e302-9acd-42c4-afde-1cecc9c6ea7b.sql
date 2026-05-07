
ALTER TABLE public.scripts
  ADD COLUMN IF NOT EXISTS reviewed_by uuid,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS review_notes text,
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.notify_admins_new_script()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_id uuid;
  author_name text;
BEGIN
  SELECT name INTO author_name FROM public.profiles WHERE id = NEW.author_id;
  FOR admin_id IN
    SELECT user_id FROM public.user_roles WHERE role IN ('admin','super_admin')
  LOOP
    INSERT INTO public.notifications (user_id, title, body, type)
    VALUES (
      admin_id,
      'New script awaiting review',
      COALESCE(author_name, 'A user') || ' submitted "' || NEW.name || '" for approval.',
      'script_review'
    );
  END LOOP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_admins_new_script ON public.scripts;
CREATE TRIGGER trg_notify_admins_new_script
AFTER INSERT ON public.scripts
FOR EACH ROW
WHEN (NEW.approval_status = 'Pending Review')
EXECUTE FUNCTION public.notify_admins_new_script();

CREATE OR REPLACE FUNCTION public.notify_author_script_decision()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.approval_status <> OLD.approval_status AND NEW.author_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, body, type)
    VALUES (
      NEW.author_id,
      'Script ' || NEW.approval_status,
      'Your script "' || NEW.name || '" was ' || lower(NEW.approval_status::text) ||
        COALESCE('. Notes: ' || NEW.review_notes, '.'),
      'script_decision'
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_author_script_decision ON public.scripts;
CREATE TRIGGER trg_notify_author_script_decision
AFTER UPDATE OF approval_status ON public.scripts
FOR EACH ROW
EXECUTE FUNCTION public.notify_author_script_decision();
