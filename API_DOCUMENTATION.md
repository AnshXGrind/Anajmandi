# FarmLink API

All JSON mutation endpoints validate requests with Zod and return `{ data }` on success or `{ error, code }` on failure. Authenticated endpoints use the Supabase session cookie.

## Authentication

- `POST /api/auth/register` — create a farmer, buyer, or logistics account. Admin is never accepted from client input.
- `POST /api/auth/login` — sign in and return the trusted profile role.
- `POST /api/auth/logout` — end the current session.
- `POST /api/auth/forgot-password` — request a Supabase recovery email.

## Marketplace

- `GET /api/listings?q=&category_id=&state=&district=&quality_grade=&min_price=&max_price=&min_quantity=&max_quantity=&sort=&page=&pageSize=` — paginated active listings with validated quality and sorting filters.
- `POST /api/listings` — farmer-only listing creation.
- `POST /api/offers` — buyer-only offer creation; the server checks status and available quantity.
- `POST /api/offers/:id/accept` — farmer-only acceptance; the database RPC locks the listing, rejects competing offers, decrements availability, and creates the order atomically.
- `GET /api/locations/states` — active LGD State and Union Territory records.
- `GET /api/locations/districts?state_code=` — active districts for one LGD state code.

Apply `supabase/migrations/202611120001_farm_link_core.sql` to an isolated Supabase project before using authenticated workflows. Payment, transport, storage, messaging, notifications, reviews, disputes, and admin mutation endpoints are not yet represented as successful contracts.

Status: the endpoints above are implemented and locally type/lint/test/build validated. The target Supabase project currently lacks the base tables (`PGRST205` verified through its REST API), so live permissions, migration application, email delivery, storage uploads, payment webhooks, and deployed browser flows remain externally unverified.
