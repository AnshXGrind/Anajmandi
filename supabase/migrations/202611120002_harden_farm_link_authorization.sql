-- Security corrections for the core migration. This is additive so it can be
-- applied safely after 202611120001 on an existing Supabase project.
create or replace function public.current_user_role() returns public.user_role
language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated;

drop policy if exists profiles_read on public.profiles;
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_owner_or_admin_read on public.profiles for select
  using (id = auth.uid() or public.current_user_role() = 'admin');
create policy profiles_update_without_role_change on public.profiles for update
  using (id = auth.uid() or public.current_user_role() = 'admin')
  with check (
    public.current_user_role() = 'admin'
    or (id = auth.uid() and role = public.current_user_role())
  );

-- PostgREST can only select the non-sensitive columns from the base table.
-- Private owner reads should use get_my_private_profile below.
revoke select on public.profiles from anon, authenticated;
grant select (id, full_name, role, verification_status, state, district, is_active, created_at, updated_at) on public.profiles to anon, authenticated;

create or replace view public.public_farmer_profiles as
  select id, full_name, verification_status, state, district
  from public.profiles
  where role = 'farmer' and is_active = true;
grant select on public.public_farmer_profiles to anon, authenticated;

create or replace function public.get_my_private_profile() returns table (
  id uuid, email text, full_name text, phone text, avatar_url text,
  role public.user_role, verification_status public.verification_status,
  state text, district text, pincode text, address text, is_active boolean,
  created_at timestamptz, updated_at timestamptz
) language sql stable security definer set search_path = public
as $$ select p.id,p.email,p.full_name,p.phone,p.avatar_url,p.role,p.verification_status,p.state,p.district,p.pincode,p.address,p.is_active,p.created_at,p.updated_at from public.profiles p where p.id = auth.uid() $$;
revoke all on function public.get_my_private_profile() from public;
grant execute on function public.get_my_private_profile() to authenticated;

drop policy if exists offers_participant_update on public.buyer_offers;
drop policy if exists offers_buyer_insert on public.buyer_offers;
create policy offers_buyer_insert_verified on public.buyer_offers for insert with check (
  buyer_id = auth.uid()
  and public.current_user_role() = 'buyer'
  and buyer_id <> farmer_id
  and exists (select 1 from public.produce_listings l where l.id = listing_id and l.farmer_id = farmer_id and l.status = 'active' and quantity_kg <= l.available_quantity_kg)
);

drop function if exists public.accept_offer(uuid, uuid);
create or replace function public.accept_offer(offer_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare offer_row public.buyer_offers; listing_row public.produce_listings; order_row public.orders; caller uuid := auth.uid();
begin
  if caller is null or public.current_user_role() <> 'farmer' then raise exception 'Only an authenticated farmer can accept offers'; end if;
  select * into offer_row from public.buyer_offers where id = offer_id for update;
  if offer_row.id is null or offer_row.status <> 'pending' then raise exception 'Offer cannot be accepted'; end if;
  select * into listing_row from public.produce_listings where id = offer_row.listing_id for update;
  if listing_row.id is null or listing_row.farmer_id <> caller or offer_row.farmer_id <> listing_row.farmer_id then raise exception 'Offer ownership mismatch'; end if;
  if offer_row.buyer_id = caller or listing_row.available_quantity_kg < offer_row.quantity_kg or listing_row.status <> 'active' then raise exception 'Listing quantity is no longer available'; end if;
  if exists (select 1 from public.orders where offer_id = offer_row.id) then raise exception 'An order already exists for this offer'; end if;
  update public.buyer_offers set status='accepted', updated_at=now() where id=offer_row.id;
  update public.buyer_offers set status='rejected', updated_at=now() where listing_id=offer_row.listing_id and id<>offer_row.id and status='pending';
  update public.produce_listings set available_quantity_kg=available_quantity_kg-offer_row.quantity_kg, status=case when available_quantity_kg-offer_row.quantity_kg=0 then 'sold' else status end, updated_at=now() where id=listing_row.id;
  insert into public.orders (buyer_id,farmer_id,offer_id,subtotal,platform_fee,total_amount) values (offer_row.buyer_id,caller,offer_row.id,offer_row.quantity_kg*offer_row.offered_price_per_kg,(offer_row.quantity_kg*offer_row.offered_price_per_kg)*0.025,(offer_row.quantity_kg*offer_row.offered_price_per_kg)*1.025) returning * into order_row;
  insert into public.order_items (order_id,listing_id,quantity_kg,agreed_price_per_kg) values(order_row.id,offer_row.listing_id,offer_row.quantity_kg,offer_row.offered_price_per_kg);
  insert into public.order_status_history(order_id,status,changed_by) values(order_row.id,'pending',caller);
  return jsonb_build_object('order_id',order_row.id,'order_number',order_row.order_number);
end; $$;
revoke all on function public.accept_offer(uuid) from public;
grant execute on function public.accept_offer(uuid) to authenticated;

create or replace function public.reject_offer(offer_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if public.current_user_role() <> 'farmer' or not exists (select 1 from public.buyer_offers where id=offer_id and farmer_id=auth.uid() and status='pending') then raise exception 'Offer cannot be rejected'; end if;
  update public.buyer_offers set status='rejected', updated_at=now() where id=offer_id;
end; $$;
revoke all on function public.reject_offer(uuid) from public;
grant execute on function public.reject_offer(uuid) to authenticated;

create or replace function public.withdraw_offer(offer_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if public.current_user_role() <> 'buyer' or not exists (select 1 from public.buyer_offers where id=offer_id and buyer_id=auth.uid() and status='pending') then raise exception 'Offer cannot be withdrawn'; end if;
  update public.buyer_offers set status='withdrawn', updated_at=now() where id=offer_id;
end; $$;
revoke all on function public.withdraw_offer(uuid) from public;
grant execute on function public.withdraw_offer(uuid) to authenticated;
