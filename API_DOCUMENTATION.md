# FarmLink API

All JSON mutation endpoints validate requests with Zod and return `{ data }` on success or `{ error, code }` on failure. Authenticated endpoints use the Supabase session cookie.

## Authentication

- `POST /api/auth/register` — create a farmer, buyer, or logistics account. Admin is never accepted from client input.
- `POST /api/auth/login` — sign in and return the trusted profile role.
- `POST /api/auth/logout` — end the current session.
- `POST /api/auth/forgot-password` — request a Supabase recovery email.

## Marketplace

- `GET /api/listings?q=&state=&page=&pageSize=` — paginated active listings.
- `POST /api/listings` — farmer-only listing creation.
- `POST /api/offers` — buyer-only offer creation; the server checks status and available quantity.
- `POST /api/offers/:id/accept` — farmer-only acceptance; the database RPC locks the listing, rejects competing offers, decrements availability, and creates the order atomically.

Apply `supabase/migrations/202611120001_farm_link_core.sql` to an isolated Supabase project before using authenticated workflows. Payment, transport, storage, messaging, notifications, reviews, disputes, and admin mutation endpoints are not yet represented as successful contracts.
