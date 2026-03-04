-- Ejecuta este script en Supabase SQL Editor

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    role text not null default 'client' check (role in ('admin', 'client')),
    created_at timestamptz not null default now()
);

create table if not exists public.leads (
    id uuid primary key default gen_random_uuid(),
    name text,
    company text,
    contact text,
    sector text,
    objective text,
    urgency text,
    budget_range text,
    lead_volume text,
    decision_role text,
    message text,
    lead_score int,
    lead_grade text,
    source text default 'landing',
    status text default 'new',
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and role = 'admin'
    );
$$;

alter table public.profiles enable row level security;
alter table public.leads enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "leads_insert_anon_or_auth" on public.leads;
create policy "leads_insert_anon_or_auth"
on public.leads
for insert
to anon, authenticated
with check (true);

drop policy if exists "leads_select_own" on public.leads;
create policy "leads_select_own"
on public.leads
for select
to authenticated
using (created_by = auth.uid());

drop policy if exists "leads_select_admin" on public.leads;
create policy "leads_select_admin"
on public.leads
for select
to authenticated
using (public.is_admin());

-- Para admins: crea un usuario en Auth, luego asigna rol admin
-- update public.profiles set role = 'admin' where id = '<USER_UUID>';
