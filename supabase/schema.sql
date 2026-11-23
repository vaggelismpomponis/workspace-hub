-- Workspace Hub: Cross-Device Sync Schema for Supabase
-- Run this in your Supabase project's SQL Editor (SQL Editor -> New Query)

-- 1. Create the workspaces table
create table if not exists public.workspaces (
  id text primary key, -- User's chosen Sync Key (e.g., "my-vault-2026")
  projects jsonb not null default '[]'::jsonb,
  saas_apps jsonb not null default '[]'::jsonb,
  pinned_ids jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2. Enable Row Level Security
alter table public.workspaces enable row level security;

-- 3. RLS Policies
-- Allow reading, inserting, and updating workspaces by Sync Key
create policy "Allow select workspace by sync key"
  on public.workspaces
  for select
  using (true);

create policy "Allow insert workspace by sync key"
  on public.workspaces
  for insert
  with check (true);

create policy "Allow update workspace by sync key"
  on public.workspaces
  for update
  using (true)
  with check (true);

-- 4. Enable Supabase Realtime so changes made on mobile, laptop or PC sync instantly
alter publication supabase_realtime add table public.workspaces;
