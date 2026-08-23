-- ESPACE MEKNES - Supabase Schema
-- Run this in: Dashboard > SQL Editor > New Query > Run

-- BUSINESSES
create table if not exists businesses (
  id text primary key,
  name_fr text not null default '',
  name_ar text not null default '',
  description_fr text default '',
  description_ar text default '',
  category text not null default 'autre',
  area_id text not null default 'medina',
  address text default '',
  phone text default '',
  email text default '',
  website text default '',
  logo text default '',
  cover_image text default '',
  images jsonb default '[]'::jsonb,
  video text default '',
  whatsapp text default '',
  lat double precision default 34.0331,
  lng double precision default -5.5473,
  rating double precision default 0,
  review_count integer default 0,
  is_sponsored boolean default false,
  package_type text default 'free',
  payment_method text default '',
  created_at text default '',
  user_id text default ''
);

-- ARTISANS
create table if not exists artisans (
  id text primary key,
  name_fr text not null default '',
  name_ar text not null default '',
  specialty text not null default 'autre',
  description_fr text default '',
  description_ar text default '',
  phone text default '',
  email text default '',
  address_fr text default '',
  address_ar text default '',
  area_id text not null default 'medina',
  lat double precision default 34.0331,
  lng double precision default -5.5473,
  rating double precision default 0,
  jobs_completed integer default 0,
  is_visible boolean default true,
  created_at text default '',
  user_id text default '',
  avatar text default ''
);

-- JOBS
create table if not exists jobs (
  id text primary key,
  title_fr text not null default '',
  title_ar text not null default '',
  description_fr text default '',
  description_ar text default '',
  company text default '',
  sector text default 'autre',
  job_type text default 'autre',
  area_id text not null default 'medina',
  salary text default '',
  requirements text default '',
  lat double precision default 34.0331,
  lng double precision default -5.5473,
  created_at text default '',
  employer_id text default '',
  is_active boolean default true,
  applications integer default 0,
  source_url text default '',
  source_name text default ''
);

-- ADS
create table if not exists ads (
  id text primary key,
  title_fr text not null default '',
  title_ar text not null default '',
  image_url text default '',
  link_url text default '',
  advertiser_name text default '',
  advertiser_email text default '',
  status text default 'pending',
  position text default 'banner',
  starts_at text default '',
  expires_at text default '',
  impressions integer default 0,
  clicks integer default 0,
  payment_method text default ''
);

-- RATINGS
create table if not exists ratings (
  id text primary key,
  business_id text default '',
  artisan_id text default '',
  user_name text default '',
  stars integer default 5,
  comment text default '',
  created_at text default ''
);

-- ARTISAN REQUESTS
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

-- BUSINESS CLAIMS
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

-- APP SETTINGS
create table if not exists app_settings (
  id text primary key default 'main',
  whatsapp_number text default '+212600000000',
  support_email text default 'admin@espace-meknes.ma',
  ads_enabled boolean default true,
  bank_name text default '',
  bank_account_holder text default '',
  bank_iban text default '',
  bank_rib text default ''
);

insert into app_settings (id) values ('main') on conflict (id) do nothing;

-- USER PROFILES
create table if not exists user_profiles (
  id text primary key,
  name text not null default '',
  email text not null default '',
  role text not null default 'resident',
  favorites jsonb default '[]'::jsonb,
  created_at text default ''
);

-- Enable RLS but allow all for now (add policies later for production)
alter table businesses enable row level security;
alter table artisans enable row level security;
alter table jobs enable row level security;
alter table ads enable row level security;
alter table ratings enable row level security;
alter table artisan_requests enable row level security;
alter table business_claims enable row level security;
alter table app_settings enable row level security;
alter table user_profiles enable row level security;

create policy "Allow all on businesses" on businesses for all using (true) with check (true);
create policy "Allow all on artisans" on artisans for all using (true) with check (true);
create policy "Allow all on jobs" on jobs for all using (true) with check (true);
create policy "Allow all on ads" on ads for all using (true) with check (true);
create policy "Allow all on ratings" on ratings for all using (true) with check (true);
create policy "Allow all on artisan_requests" on artisan_requests for all using (true) with check (true);
create policy "Allow all on business_claims" on business_claims for all using (true) with check (true);
create policy "Allow all on app_settings" on app_settings for all using (true) with check (true);
create policy "Allow all on user_profiles" on user_profiles for all using (true) with check (true);
