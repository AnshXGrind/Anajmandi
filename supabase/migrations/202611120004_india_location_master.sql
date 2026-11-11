-- Additive India location master data model.
-- Load the official CSV exports with scripts/import-lgd.mjs after applying this migration.
create table if not exists public.india_states (
  lgd_state_code integer primary key,
  name_en text not null,
  name_local text,
  entity_type text not null check (entity_type in ('State', 'Union Territory')),
  is_active boolean not null default true,
  source_updated_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name_en)
);

create table if not exists public.india_districts (
  lgd_district_code integer primary key,
  lgd_state_code integer not null references public.india_states(lgd_state_code),
  name_en text not null,
  name_local text,
  is_active boolean not null default true,
  source_updated_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lgd_district_code, lgd_state_code),
  unique (lgd_state_code, name_en)
);

create index if not exists india_states_active_name_idx
  on public.india_states (is_active, name_en);
create index if not exists india_districts_active_state_name_idx
  on public.india_districts (is_active, lgd_state_code, name_en);

alter table public.profiles
  add column if not exists lgd_state_code integer,
  add column if not exists lgd_district_code integer;
alter table public.produce_listings
  add column if not exists lgd_state_code integer,
  add column if not exists lgd_district_code integer;

alter table public.profiles
  drop constraint if exists profiles_lgd_state_code_fkey,
  drop constraint if exists profiles_lgd_district_state_fkey;
alter table public.profiles
  add constraint profiles_lgd_state_code_fkey
    foreign key (lgd_state_code) references public.india_states(lgd_state_code),
  add constraint profiles_lgd_district_state_fkey
    foreign key (lgd_district_code, lgd_state_code)
    references public.india_districts(lgd_district_code, lgd_state_code);

alter table public.produce_listings
  drop constraint if exists produce_listings_lgd_state_code_fkey,
  drop constraint if exists produce_listings_lgd_district_state_fkey;
alter table public.produce_listings
  add constraint produce_listings_lgd_state_code_fkey
    foreign key (lgd_state_code) references public.india_states(lgd_state_code),
  add constraint produce_listings_lgd_district_state_fkey
    foreign key (lgd_district_code, lgd_state_code)
    references public.india_districts(lgd_district_code, lgd_state_code);

alter table public.india_states enable row level security;
alter table public.india_districts enable row level security;

drop policy if exists india_states_active_read on public.india_states;
create policy india_states_active_read on public.india_states
  for select using (is_active = true);
drop policy if exists india_districts_active_read on public.india_districts;
create policy india_districts_active_read on public.india_districts
  for select using (is_active = true);

revoke all on public.india_states from anon, authenticated;
revoke all on public.india_districts from anon, authenticated;
grant select on public.india_states to anon, authenticated;
grant select on public.india_districts to anon, authenticated;

create or replace function public.backfill_lgd_location_codes()
returns table (profiles_mapped bigint, listings_mapped bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  mapped_profiles bigint;
  mapped_listings bigint;
begin
  update public.profiles p
  set lgd_state_code = s.lgd_state_code,
      lgd_district_code = d.lgd_district_code,
      updated_at = now()
  from public.india_states s
  join public.india_districts d
    on d.lgd_state_code = s.lgd_state_code
   and lower(trim(d.name_en)) = lower(trim(p.district))
  where lower(trim(s.name_en)) = lower(trim(p.state))
    and p.state is not null
    and p.district is not null;
  get diagnostics mapped_profiles = row_count;

  update public.produce_listings l
  set lgd_state_code = s.lgd_state_code,
      lgd_district_code = d.lgd_district_code,
      updated_at = now()
  from public.india_states s
  join public.india_districts d
    on d.lgd_state_code = s.lgd_state_code
   and lower(trim(d.name_en)) = lower(trim(l.district))
  where lower(trim(s.name_en)) = lower(trim(l.state))
    and l.state is not null
    and l.district is not null;
  get diagnostics mapped_listings = row_count;

  return query select mapped_profiles, mapped_listings;
end;
$$;

revoke all on function public.backfill_lgd_location_codes() from public, anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, full_name, phone, role, state, district, lgd_state_code, lgd_district_code
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'FarmLink user'),
    new.raw_user_meta_data->>'phone',
    case when new.raw_user_meta_data->>'role' in ('farmer', 'buyer', 'logistics_provider')
      then (new.raw_user_meta_data->>'role')::public.user_role else 'buyer' end,
    nullif(new.raw_user_meta_data->>'state', ''),
    nullif(new.raw_user_meta_data->>'district', ''),
    nullif(new.raw_user_meta_data->>'lgd_state_code', '')::integer,
    nullif(new.raw_user_meta_data->>'lgd_district_code', '')::integer
  );
  return new;
end;
$$;
