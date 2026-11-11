# FarmLink Repair Plan

## Baseline

The repository is a clean Next.js 16.4.6 / React 19 / Tailwind 4 scaffold. The checked-in database types describe a broad FarmLink domain, but the application currently has only the home route and Supabase client helpers. No migrations, route handlers, authentication flows, protected routes, tests, or business UI exist.

## Critical bugs

- The home page is still the create-next-app starter screen.
- Supabase helpers use non-null assertions and fail without actionable configuration errors.
- There is no session refresh proxy, so authenticated sessions cannot be maintained.
- Existing domain types have no database schema behind them.

## Missing functionality

- Public FarmLink pages and responsive navigation.
- Registration, login, logout, password reset, profile creation, and role redirects.
- Marketplace listing search and pagination.
- Farmer listing management and buyer offers.
- Offer acceptance and order creation with server-side transitions.
- Logistics, storage, payments, notifications, messaging, reviews, disputes, and admin workflows.

## Backend problems

- No route handlers, service layer, authorization checks, or consistent API errors.
- No server-side validation for marketplace mutations.
- No idempotency or transaction RPCs for order and capacity workflows.

## Database problems

- No Supabase migrations, indexes, constraints, triggers, RLS policies, or development seed data.
- Overselling, duplicate orders, duplicate payments, and transport/storage overbooking are not prevented.

## Security problems

- No protected route boundary or role authorization.
- No trusted profile creation path that prevents self-assigned admin privileges.
- No upload, payment, webhook, or rate-limit controls exist yet.

## UI/UX problems

- No FarmLink information architecture, forms, loading states, empty states, error states, or mobile workflows.
- No low-bandwidth considerations or English/Telugu language affordance.

## Performance issues

- No pagination or indexed search query exists.
- No image upload/compression strategy exists.
- No caching or revalidation policy has been selected for marketplace data.

## Testing requirements

- Add unit tests for validation and workflow rules.
- Add integration coverage for authorization and order transitions against an isolated Supabase test project.
- Add browser tests for registration, listing, offer, order, and protected-route flows.
- Run lint, TypeScript, build, and the automated suite after each vertical slice.

## Delivery order

1. Establish configuration, session refresh, schema/RLS, and shared API error handling.
2. Ship the public shell and marketplace experience.
3. Ship auth and farmer/buyer listing-offer-order vertical slice.
4. Add logistics/storage and administration with the same authorization patterns.
5. Add Razorpay test-mode integration only when credentials are configured.
6. Add test infrastructure and final audit documentation without marking credential-dependent work as production-ready.
