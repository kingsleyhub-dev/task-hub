
drop policy if exists "authenticated insert audit" on public.audit_logs;
create policy "users insert own audit" on public.audit_logs
  for insert to authenticated
  with check (user_id = auth.uid() or user_id is null);
