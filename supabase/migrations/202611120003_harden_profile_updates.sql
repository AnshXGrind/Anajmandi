-- Prevent self-service updates to moderation and authorization fields.
create or replace function public.prevent_protected_profile_updates()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.id and public.current_user_role() <> 'admin' then
    if new.role is distinct from old.role
      or new.verification_status is distinct from old.verification_status
      or new.is_active is distinct from old.is_active then
      raise exception 'Protected profile fields can only be changed by an administrator';
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.prevent_protected_profile_updates() from public;

drop trigger if exists protect_profile_updates on public.profiles;
create trigger protect_profile_updates
before update on public.profiles
for each row execute function public.prevent_protected_profile_updates();

-- Keep the generated contract aligned with the table-valued SQL function.
comment on function public.get_my_private_profile() is
  'Returns the authenticated user profile as a single-row table.';
