-- ==========================================================
-- NIKAH CIRCLE: COMPLETE SUPABASE DATABASE SETUP
-- ==========================================================

-- Enable pgcrypto extension for UUID generation
create extension if not exists "pgcrypto";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text,
  mobile text,
  gender text,
  date_of_birth date,
  age integer,
  location text,
  district text,
  education text,
  profession text,
  marital_status text,
  religion text default 'Islam',
  sect text,
  height text,
  about text,
  partner_preferences text,
  family_details text,
  profile_photo text,
  registration_type text default 'ONLINE' check (registration_type in ('ONLINE', 'CASH_ADMIN')),
  profile_status text default 'PENDING' check (profile_status in ('PENDING', 'APPROVED', 'REJECTED', 'INACTIVE')),
  is_verified boolean default false,
  is_premium boolean default false,
  premium_plan text,
  premium_start date,
  premium_end date,
  guardian_name text,
  guardian_relation text default 'Father (Wali)',
  guardian_mobile text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- If table already existed, ensure new columns are added safely
alter table public.profiles add column if not exists district text;
alter table public.profiles add column if not exists age integer;
alter table public.profiles add column if not exists sect text;
alter table public.profiles add column if not exists height text;
alter table public.profiles add column if not exists partner_preferences text;
alter table public.profiles add column if not exists family_details text;
alter table public.profiles add column if not exists guardian_name text;
alter table public.profiles add column if not exists guardian_relation text default 'Father (Wali)';
alter table public.profiles add column if not exists guardian_mobile text;

-- 2. PREMIUM REQUESTS TABLE (UPI QR, Cash Office, Free Requests)
create table if not exists public.premium_requests (
  id uuid primary key default gen_random_uuid(),
  user_name text not null,
  phone_number text not null,
  plan_name text not null,
  plan_type text default 'UPI_QR',
  amount numeric(12,2) default 0,
  utr_number text,
  payment_screenshot text,
  screenshot_url text,
  referral_code text,
  status text default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  notes text,
  created_at timestamptz default now()
);

-- 3. PAYMENTS TABLE
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  profile_name text,
  amount numeric(12,2) default 0,
  payment_method text default 'UPI',
  payment_status text default 'PAID',
  payment_date timestamptz default now(),
  transaction_reference text,
  notes text,
  created_at timestamptz default now()
);

-- 4. ADMIN USERS TABLE
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text default 'Nikah Circle Admin',
  role text default 'super_admin',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Insert default admin email
insert into public.admin_users (email, full_name, role, is_active)
values ('nikahcircle01@gmail.com', 'Nikah Circle Admin', 'super_admin', true)
on conflict (email) do update set is_active = true, role = 'super_admin';

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.premium_requests enable row level security;
alter table public.payments enable row level security;
alter table public.admin_users enable row level security;

-- Drop existing policies to allow re-running cleanly
drop policy if exists "public_read_approved_profiles" on public.profiles;
drop policy if exists "public_insert_profiles" on public.profiles;
drop policy if exists "admin_all_profiles" on public.profiles;
drop policy if exists "public_all_profiles_anon" on public.profiles;

drop policy if exists "public_insert_premium_requests" on public.premium_requests;
drop policy if exists "public_read_premium_requests" on public.premium_requests;
drop policy if exists "public_all_premium_requests" on public.premium_requests;

drop policy if exists "public_all_payments" on public.payments;
drop policy if exists "public_all_admin_users" on public.admin_users;

-- Allow public / anon users to read approved profiles and insert new registrations
create policy "public_all_profiles_anon" on public.profiles
for all to anon, authenticated
using (true)
with check (true);

create policy "public_all_premium_requests" on public.premium_requests
for all to anon, authenticated
using (true)
with check (true);

create policy "public_all_payments" on public.payments
for all to anon, authenticated
using (true)
with check (true);

create policy "public_all_admin_users" on public.admin_users
for select to anon, authenticated
using (true);

-- 6. INDEXES FOR PERFORMANCE
create index if not exists idx_profiles_created on public.profiles(created_at desc);
create index if not exists idx_profiles_status on public.profiles(profile_status);
create index if not exists idx_profiles_gender on public.profiles(gender);
create index if not exists idx_profiles_premium on public.profiles(is_premium);
create index if not exists idx_premium_requests_status on public.premium_requests(status);
create index if not exists idx_payments_date on public.payments(payment_date desc);
