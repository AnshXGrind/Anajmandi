create extension if not exists "pgcrypto";

create type public.user_role as enum ('farmer','buyer','logistics_provider','admin');
create type public.verification_status as enum ('pending','verified','rejected');
create type public.listing_status as enum ('draft','active','sold','expired','cancelled');
create type public.quality_grade as enum ('A','B','C');
create type public.offer_status as enum ('pending','accepted','rejected','expired','withdrawn');
create type public.order_status as enum ('pending','confirmed','processing','in_transit','delivered','completed','cancelled','disputed');
create type public.payment_status as enum ('pending','processing','completed','failed','refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null check (char_length(full_name) between 2 and 100),
  phone text,
  avatar_url text,
  role public.user_role not null default 'buyer',
  verification_status public.verification_status not null default 'pending',
  state text, district text, pincode text, address text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.farmer_profiles (id uuid primary key default gen_random_uuid(), profile_id uuid not null unique references public.profiles(id) on delete cascade, farm_name text, farm_size_acres numeric(10,2), primary_crops text[] not null default '{}', total_listings integer not null default 0, total_sales numeric(14,2) not null default 0, average_rating numeric(3,2) not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.buyer_profiles (id uuid primary key default gen_random_uuid(), profile_id uuid not null unique references public.profiles(id) on delete cascade, business_name text, business_type text, gst_number text, preferred_categories text[] not null default '{}', total_orders integer not null default 0, average_rating numeric(3,2) not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.logistics_profiles (id uuid primary key default gen_random_uuid(), profile_id uuid not null unique references public.profiles(id) on delete cascade, company_name text, vehicle_count integer not null default 0, service_states text[] not null default '{}', average_rating numeric(3,2) not null default 0, total_trips integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.produce_categories (id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique, created_at timestamptz not null default now());
create table public.produce_listings (
  id uuid primary key default gen_random_uuid(), farmer_id uuid not null references public.profiles(id) on delete restrict, category_id uuid references public.produce_categories(id) on delete set null,
  title text not null, description text, variety text, quality_grade public.quality_grade not null default 'B', price_per_kg numeric(12,2) not null check (price_per_kg > 0), quantity_kg numeric(14,2) not null check (quantity_kg > 0), available_quantity_kg numeric(14,2) not null check (available_quantity_kg >= 0), unit text not null default 'kg', harvest_date date, available_from date, available_until date, pickup_address text not null, state text not null, district text not null, status public.listing_status not null default 'active', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check (available_quantity_kg <= quantity_kg)
);
create table public.produce_images (id uuid primary key default gen_random_uuid(), listing_id uuid not null references public.produce_listings(id) on delete cascade, storage_path text not null, alt_text text, sort_order integer not null default 0, created_at timestamptz not null default now());
create table public.buyer_offers (id uuid primary key default gen_random_uuid(), listing_id uuid not null references public.produce_listings(id) on delete restrict, buyer_id uuid not null references public.profiles(id) on delete restrict, farmer_id uuid not null references public.profiles(id) on delete restrict, quantity_kg numeric(14,2) not null check (quantity_kg > 0), offered_price_per_kg numeric(12,2) not null check (offered_price_per_kg > 0), message text, status public.offer_status not null default 'pending', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.orders (id uuid primary key default gen_random_uuid(), order_number text not null unique default ('FL-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,10))), buyer_id uuid not null references public.profiles(id), farmer_id uuid not null references public.profiles(id), offer_id uuid unique references public.buyer_offers(id), status public.order_status not null default 'pending', subtotal numeric(14,2) not null check (subtotal > 0), platform_fee numeric(14,2) not null default 0, total_amount numeric(14,2) not null check (total_amount > 0), payment_status public.payment_status not null default 'pending', delivery_address text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.order_items (id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade, listing_id uuid not null references public.produce_listings(id), quantity_kg numeric(14,2) not null check (quantity_kg > 0), agreed_price_per_kg numeric(12,2) not null check (agreed_price_per_kg > 0), total_amount numeric(14,2) generated always as (quantity_kg * agreed_price_per_kg) stored);
create table public.order_status_history (id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade, status public.order_status not null, notes text, changed_by uuid references public.profiles(id), created_at timestamptz not null default now());
create table public.payment_transactions (id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id), buyer_id uuid not null references public.profiles(id), razorpay_order_id text, razorpay_payment_id text, razorpay_signature text, amount numeric(14,2) not null, currency text not null default 'INR', status public.payment_status not null default 'pending', failure_reason text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(order_id, razorpay_payment_id));

create index listings_search_idx on public.produce_listings using gin (to_tsvector('simple', title || ' ' || coalesce(description,'')));
create index listings_location_idx on public.produce_listings(state, district, status);
create index listings_farmer_idx on public.produce_listings(farmer_id, status);
create index offers_parties_idx on public.buyer_offers(buyer_id, farmer_id, status);
create index orders_parties_idx on public.orders(buyer_id, farmer_id, status);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, phone, role, state)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name','FarmLink user'), new.raw_user_meta_data->>'phone', case when new.raw_user_meta_data->>'role' in ('farmer','buyer','logistics_provider') then (new.raw_user_meta_data->>'role')::public.user_role else 'buyer' end, new.raw_user_meta_data->>'state');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.farmer_profiles enable row level security;
alter table public.buyer_profiles enable row level security;
alter table public.logistics_profiles enable row level security;
alter table public.produce_categories enable row level security;
alter table public.produce_listings enable row level security;
alter table public.produce_images enable row level security;
alter table public.buyer_offers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.payment_transactions enable row level security;

create policy profiles_read on public.profiles for select using (is_active = true or id = auth.uid());
create policy profiles_update_self on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and role <> 'admin');
create policy categories_public_read on public.produce_categories for select using (true);
create policy listings_public_read on public.produce_listings for select using (status = 'active' or farmer_id = auth.uid());
create policy listings_farmer_insert on public.produce_listings for insert with check (farmer_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'farmer'));
create policy listings_farmer_update on public.produce_listings for update using (farmer_id = auth.uid()) with check (farmer_id = auth.uid());
create policy listings_farmer_delete on public.produce_listings for delete using (farmer_id = auth.uid());
create policy images_public_read on public.produce_images for select using (true);
create policy offers_participant_read on public.buyer_offers for select using (buyer_id = auth.uid() or farmer_id = auth.uid());
create policy offers_buyer_insert on public.buyer_offers for insert with check (buyer_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'buyer'));
create policy offers_participant_update on public.buyer_offers for update using (buyer_id = auth.uid() or farmer_id = auth.uid()) with check (buyer_id = auth.uid() or farmer_id = auth.uid());
create policy orders_participant_read on public.orders for select using (buyer_id = auth.uid() or farmer_id = auth.uid());
create policy order_items_participant_read on public.order_items for select using (exists (select 1 from public.orders o where o.id = order_id and (o.buyer_id = auth.uid() or o.farmer_id = auth.uid())));
create policy history_participant_read on public.order_status_history for select using (exists (select 1 from public.orders o where o.id = order_id and (o.buyer_id = auth.uid() or o.farmer_id = auth.uid())));
create policy payments_buyer_read on public.payment_transactions for select using (buyer_id = auth.uid());

insert into public.produce_categories (name, slug) values ('Grains & Cereals','grains'),('Vegetables','vegetables'),('Fruits','fruits'),('Pulses & Legumes','pulses'),('Spices & Herbs','spices') on conflict (slug) do nothing;
