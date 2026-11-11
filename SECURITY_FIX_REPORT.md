# Security Fix Report

- Registration accepts only the supported non-admin roles, requires terms acceptance, confirms passwords, and reports email-confirmation state.
- Login trusts the server-side profile role and refuses accounts without a valid profile instead of silently assigning buyer access.
- Protected dashboard pages enforce roles on the server; proxy redirects authenticated users away from cross-role dashboard paths.
- Listing and offer handlers validate inputs, bound pagination, reject self-offers, enforce available quantity, and map duplicate/conflict errors to explicit HTTP responses.
- The hardening migration adds an auth-bound role helper, safe farmer-profile view, private profile function, role-preserving profile updates, participant offer policies, and transaction-safe accept/reject/withdraw RPCs.
- The database migration is additive and does not rewrite the earlier migration. Apply both migrations to an isolated Supabase project and review the resulting policies in the Supabase dashboard.

The service-role key is not used in browser code and must remain outside `NEXT_PUBLIC_*` variables.
