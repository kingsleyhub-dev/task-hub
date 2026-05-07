
-- Set search_path on remaining functions
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create or replace function public.generate_work_id()
returns text language sql set search_path = public as $$
  select 'KH-' || lpad(nextval('public.work_id_seq')::text, 4, '0');
$$;

-- Restrict EXECUTE on SECURITY DEFINER helpers (only used internally / via RLS)
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
revoke execute on function public.is_admin(uuid) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.generate_work_id() from public, anon, authenticated;
