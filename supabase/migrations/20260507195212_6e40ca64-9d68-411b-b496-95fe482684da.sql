
-- ============== ENUMS ==============
create type public.app_role as enum ('super_admin','admin','operator','viewer');
create type public.task_status as enum ('Pending','In Progress','Under Review','Completed','Blocked');
create type public.task_priority as enum ('Low','Medium','High','Critical');
create type public.user_status as enum ('Active','Suspended','Pending');
create type public.script_approval as enum ('Approved','Pending Review','Rejected');
create type public.severity_level as enum ('Info','Low','Medium','High','Critical');

-- ============== PROFILES ==============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null,
  work_id text unique,
  department text default 'Security Operations',
  status public.user_status not null default 'Active',
  risk_score int not null default 0,
  last_login timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- ============== USER ROLES ==============
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

create or replace function public.is_admin(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id = _user_id and role in ('admin','super_admin'));
$$;

-- ============== WORK ID GENERATOR ==============
create sequence if not exists public.work_id_seq start 1000;

create or replace function public.generate_work_id()
returns text language sql as $$
  select 'KH-' || lpad(nextval('public.work_id_seq')::text, 4, '0');
$$;

-- ============== AUTO-CREATE PROFILE + ROLE ==============
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, work_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.email,
    public.generate_work_id()
  );
  insert into public.user_roles (user_id, role) values (new.id, 'operator');
  return new;
end; $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ============== TASKS ==============
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  title text not null,
  description text,
  category text,
  priority public.task_priority not null default 'Medium',
  status public.task_status not null default 'Pending',
  progress int not null default 0,
  deadline date,
  assignee_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.tasks enable row level security;

-- ============== TOOLS ==============
create table public.tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  version text,
  vendor text,
  description text,
  status text default 'Installed',
  created_at timestamptz not null default now()
);
alter table public.tools enable row level security;

-- ============== SCRIPTS ==============
create table public.scripts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  language text,
  category text,
  description text,
  content text,
  approval_status public.script_approval not null default 'Pending Review',
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.scripts enable row level security;

-- ============== CEH PROGRESS ==============
create table public.ceh_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  module text not null,
  topic text not null,
  progress int not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique(user_id, module, topic)
);
alter table public.ceh_progress enable row level security;

-- ============== AUDIT LOGS ==============
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  event text not null,
  detail text,
  target text,
  severity public.severity_level not null default 'Info',
  created_at timestamptz not null default now()
);
alter table public.audit_logs enable row level security;

-- ============== NOTIFICATIONS ==============
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  type text default 'info',
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;

-- ============== UPDATED_AT TRIGGERS ==============
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger trg_profiles_updated before update on public.profiles for each row execute function public.touch_updated_at();
create trigger trg_tasks_updated before update on public.tasks for each row execute function public.touch_updated_at();
create trigger trg_ceh_updated before update on public.ceh_progress for each row execute function public.touch_updated_at();

-- ============== RLS POLICIES ==============

-- profiles
create policy "profiles readable to authenticated" on public.profiles for select to authenticated using (true);
create policy "users update own profile" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "admins update any profile" on public.profiles for update to authenticated using (public.is_admin(auth.uid()));
create policy "admins delete profile" on public.profiles for delete to authenticated using (public.is_admin(auth.uid()));

-- user_roles
create policy "roles readable to authenticated" on public.user_roles for select to authenticated using (true);
create policy "admins manage roles" on public.user_roles for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- tasks
create policy "tasks readable to authenticated" on public.tasks for select to authenticated using (true);
create policy "admins create tasks" on public.tasks for insert to authenticated with check (public.is_admin(auth.uid()));
create policy "admins update tasks" on public.tasks for update to authenticated using (public.is_admin(auth.uid()));
create policy "assignee updates own tasks" on public.tasks for update to authenticated using (assignee_id = auth.uid());
create policy "admins delete tasks" on public.tasks for delete to authenticated using (public.is_admin(auth.uid()));

-- tools
create policy "tools readable to authenticated" on public.tools for select to authenticated using (true);
create policy "admins manage tools" on public.tools for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- scripts
create policy "scripts readable to authenticated" on public.scripts for select to authenticated using (true);
create policy "users submit scripts" on public.scripts for insert to authenticated with check (auth.uid() = author_id);
create policy "admins manage scripts" on public.scripts for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ceh_progress
create policy "users see own ceh progress" on public.ceh_progress for select to authenticated using (auth.uid() = user_id);
create policy "admins see all ceh" on public.ceh_progress for select to authenticated using (public.is_admin(auth.uid()));
create policy "users upsert own ceh" on public.ceh_progress for insert to authenticated with check (auth.uid() = user_id);
create policy "users update own ceh" on public.ceh_progress for update to authenticated using (auth.uid() = user_id);

-- audit_logs (insert-only, admin-read)
create policy "admins read audit" on public.audit_logs for select to authenticated using (public.is_admin(auth.uid()));
create policy "authenticated insert audit" on public.audit_logs for insert to authenticated with check (true);

-- notifications
create policy "users read own notifications" on public.notifications for select to authenticated using (auth.uid() = user_id);
create policy "users update own notifications" on public.notifications for update to authenticated using (auth.uid() = user_id);
create policy "admins create notifications" on public.notifications for insert to authenticated with check (public.is_admin(auth.uid()) or auth.uid() = user_id);
