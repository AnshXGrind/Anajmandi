# FarmLink

FarmLink is a mobile-first agricultural marketplace connecting Indian farmers with buyers through direct listings, structured offers, and traceable orders.

## Run locally

```bash
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`, then apply the SQL in `supabase/migrations/` to an isolated Supabase project. Never put a service-role key in a `NEXT_PUBLIC_` variable.

## Database and LGD locations

The configured deployment currently points at `cnqlqvuehpzsoqoynrps.supabase.co`; its public REST API returned `PGRST205` for `public.profiles` and `public.produce_listings`, confirming that the schema migrations have not been applied to that project. Use a Supabase database connection string with the migration workflow rather than the public anon key:

```bash
supabase db push
pnpm test:locations
set SUPABASE_DB_URL=<target-project-database-url>
node scripts/import-lgd.mjs
```

Apply migrations in filename order, including `202611120004_india_location_master.sql`, then run the import script. The script is additive/upsert-only, backfills compatible text locations, reports mapping counts through PostgreSQL, and reloads the PostgREST schema. LGD source metadata and checksums are recorded in [supabase/seeds/README.md](./supabase/seeds/README.md).

The current vertical slice includes public marketplace discovery, registration, login, password recovery, listing creation, buyer offers, and atomic offer acceptance. See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md), [BUILD_FIX_REPORT.md](./BUILD_FIX_REPORT.md), [SECURITY_FIX_REPORT.md](./SECURITY_FIX_REPORT.md), [TEST_REPORT.md](./TEST_REPORT.md), [REPAIR_PLAN.md](./REPAIR_PLAN.md), and [IMPLEMENTATION_REPORT.md](./IMPLEMENTATION_REPORT.md) for boundaries and remaining work.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:locations
pnpm test:e2e
pnpm build
```

Current status: public marketplace discovery, authenticated listing creation, buyer offers, atomic offer acceptance, live farmer/buyer dashboard overviews, safe login redirects, profile-field hardening, and auth endpoint rate limiting are implemented and validated locally. Payments, logistics, storage, messaging, admin mutations, real browser automation, and deployed-environment verification remain outside the locally verified slice.
