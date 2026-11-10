
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text,
  mobile text,
  gender text,
  date_of_birth date,
  location text,
  education text,
  profession text,
  marital_status text,
  religion text default 'Islam',
  about text,
  profile_photo text,
  registration_type text default 'ONLINE' check (registration_type in ('ONLINE','CASH_ADMIN')),
  profile_status text default 'PENDING' check (profile_status in ('PENDING','APPROVED','REJECTED','INACTIVE')),
  is_verified boolean default false,
  is_premium boolean default false,
  premium_plan text,
  premium_start date,
  premium_end date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  amount numeric(12,2) default 0,
  payment_method text default 'CASH',
  payment_status text default 'PAID',
  payment_date timestamptz default now(),
  transaction_reference text,
  created_by uuid references auth.users(id) on delete set null,
  notes text
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  email text not null,
  full_name text default 'Nikah Circle Admin',
  role text default 'admin',
  is_active boolean default true
);

insert into public.admin_users(user_id,email,full_name,role,is_active)
select id,email,'Nikah Circle Admin','super_admin',true
from auth.users where email='nikahcircle01@gmail.com'
on conflict(user_id) do update set is_active=true,role='super_admin';

alter table public.profiles enable row level security;
alter table public.payments enable row level security;
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public as $$
select exists(select 1 from public.admin_users where user_id=auth.uid() and is_active=true);
$$;

drop policy if exists "admin profiles" on public.profiles;
drop policy if exists "admin payments" on public.payments;
drop policy if exists "admin self" on public.admin_users;

create policy "admin profiles" on public.profiles for all to authenticated
using(public.is_admin()) with check(public.is_admin());

create policy "admin payments" on public.payments for all to authenticated
using(public.is_admin()) with check(public.is_admin());

create policy "admin self" on public.admin_users for select to authenticated
using(user_id=auth.uid());

create index if not exists profiles_created_idx on public.profiles(created_at desc);
create index if not exists profiles_status_idx on public.profiles(profile_status);
create index if not exists profiles_premium_idx on public.profiles(is_premium);
