
CREATE TABLE public.app_secrets (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins read app_secrets" ON public.app_secrets
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "admins insert app_secrets" ON public.app_secrets
  FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "admins update app_secrets" ON public.app_secrets
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "admins delete app_secrets" ON public.app_secrets
  FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));
