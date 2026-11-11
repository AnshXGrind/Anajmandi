# Security Fix Report

- Registration accepts only the supported non-admin roles, requires terms acceptance, confirms passwords, and reports email-confirmation state.
- Login trusts the server-side profile role and refuses accounts without a valid profile instead of silently assigning buyer access.
- Protected dashboard pages enforce roles on the server; proxy redirects authenticated users away from cross-role dashboard paths.
- Listing and offer handlers validate inputs, bound pagination, reject self-offers, enforce available quantity, and map duplicate/conflict errors to explicit HTTP responses.
- The hardening migration adds an auth-bound role helper, safe farmer-profile view, private profile function, role-preserving profile updates, participant offer policies, and transaction-safe accept/reject/withdraw RPCs.
- The database migration is additive and does not rewrite the earlier migration. Apply both migrations to an isolated Supabase project and review the resulting policies in the Supabase dashboard.
- Migration `202611120003_harden_profile_updates.sql` adds a security-definer trigger that prevents self-service changes to `role`, `verification_status`, and `is_active`.
- Login, registration, and password recovery routes have bounded per-address rate limiting; this is locally tested but requires a shared production limiter for multi-instance enforcement.
- Login redirect destinations are validated with `safeRedirectPath`, and unknown roles fall back to the public home page.

The service-role key is not used in browser code and must remain outside `NEXT_PUBLIC_*` variables.

## Status

- Implemented and tested: additive profile-field guard, typed table-valued private-profile contract, server-side role checks, safe redirect handling, and auth route limiter behavior.
- Implemented but externally unverified: Supabase migration application, RLS behavior with real farmer/buyer accounts, email verification/recovery, and production rate-limit consistency.
