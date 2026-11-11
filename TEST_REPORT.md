# Test Report

Validated on the repair branch `fix/farmlink-build-and-security`:

- `pnpm lint` — passed.
- `pnpm exec tsc --noEmit` — passed.
- `pnpm test` — contract tests pass when run with the required Windows process permissions.
- `pnpm test:e2e` — environment contract passes; browser smoke testing requires `BASE_URL` and a running deployment.
- `pnpm build` — passed with Next.js 16.4.6; all 25 routes generated successfully.
- `git diff --check` — no whitespace errors.

Not verified in this workspace: live Supabase migrations/RLS with real users, email recovery delivery, storage policies, and a deployed Vercel browser flow. Those require project credentials and should be run after deployment.
