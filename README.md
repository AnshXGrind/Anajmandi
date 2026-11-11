# FarmLink

FarmLink is a mobile-first agricultural marketplace connecting Indian farmers with buyers through direct listings, structured offers, and traceable orders.

## Run locally

```bash
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`, then apply the SQL in `supabase/migrations/` to an isolated Supabase project. Never put a service-role key in a `NEXT_PUBLIC_` variable.

The current vertical slice includes public marketplace discovery, registration, login, listing creation, buyer offers, and atomic offer acceptance. See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md), [REPAIR_PLAN.md](./REPAIR_PLAN.md), and [IMPLEMENTATION_REPORT.md](./IMPLEMENTATION_REPORT.md) for boundaries and remaining work.

## Checks

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```
