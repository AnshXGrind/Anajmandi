# Build Fix Report

## Failure reproduced

Vercel failed while prerendering `/login` because `useSearchParams()` was called in the client auth form without a Suspense boundary. The failing deployment was building commit `d2c93e5`.

## Changes

- Moved the login/register redirect query handling to the server pages and passed a validated path into the client form.
- Added `instant = false` to request-time auth/search-parameter routes, as required by the installed Next.js 16 Cache Components guidance.
- Added route loading boundaries for protected dashboards.
- Added a missing-Supabase-configuration guard so local/CI builds fail gracefully while production requests still use Supabase when configured.

## Verification

`pnpm.cmd install --frozen-lockfile`, `pnpm.cmd lint`, `pnpm.cmd typecheck`, `pnpm.cmd test`, `pnpm.cmd test:e2e`, and `pnpm.cmd build` pass on Next.js 16.4.6. The build generates 26 routes. The root layout now uses React's `ReactNode`, avoiding reliance on generated `LayoutProps` during standalone typechecking.

## Deployment note

The repair branch must be pushed and deployed with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL` configured in Vercel. A live Vercel deployment was not changed from this workspace.

## Status

- Implemented and tested: root-layout type repair, CI E2E contract step, frozen install, and production build.
- Implemented but externally unverified: both Vercel project settings and deployment logs.
