-- Fix artisan_requests and business_claims RLS + insert policies
-- Run this in: Supabase Dashboard > SQL Editor > New Query > Run

-- Make sure tables exist with correct structure
create table if not exists artisan_requests (
  id text primary key,
  artisan_id text not null default '',
  artisan_name text not null default '',
  user_name text default '',
  user_phone text default '',
  user_email text default '',
  description_fr text default '',
  description_ar text default '',
  specialty text default 'autre',
  area_id text default 'medina',
  status text default 'pending',
  contacted_artisans jsonb default '[]'::jsonb,
  notes text default '',
  created_at text default ''
);

create table if not exists business_claims (
  id text primary key,
  business_id text not null default '',
  business_name text not null default '',
  user_id text not null default '',
  user_name text default '',
  user_email text default '',
  whatsapp text default '',
  requested_package text default 'free',
  status text default 'pending',
  notes text default '',
  created_at text default ''
);

-- Enable RLS
alter table artisan_requests enable row level security;
alter table business_claims enable row level security;

-- Drop old policies if they exist
drop policy if exists "Allow all on artisan_requests" on artisan_requests;
drop policy if exists "Allow all on business_claims" on business_claims;

-- Create permissive policies for all operations (anonymous + authenticated)
create policy "Allow all on artisan_requests" on artisan_requests
  for all
  using (true)
  with check (true);

create policy "Allow all on business_claims" on business_claims
  for all
  using (true)
  with check (true);
