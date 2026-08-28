# PHASES.md

## PHASE 1 — LOGIN & AUTHENTICATION
- Migrations (users, stores, ratings)
- Shared validators (Zod)
- Seed script (passing all rules; 3 roles: Admin, User, Owner)
- Login endpoint + JWT + cookie
- Password update endpoint
- Auth middleware + role guard

## PHASE 2 — DASHBOARD — STATS & OVERVIEW
- Admin dashboard counts (users, stores, ratings)
- Basic API structure with query params (filter/sort/paginate) defined, not fully implemented yet

## PHASE 3 — CORE OPERATION — STORE LISTING & SEARCH
- Store list endpoint with server-side filter (Name, Email, Address) + sort + paginate
- User list endpoint with filter (Name, Email, Address, Role) + sort + paginate
- Search by Name / Address (ILIKE / LIKE query params)

## PHASE 4 — RATINGS & REVIEWS
- Submit rating (upsert)
- Modify rating (upsert — same endpoint)
- Get user's submitted rating per store
- Average rating aggregate per store (computed, not stored)
- Rating list for Store Owner (who rated their store)

## PHASE 5 — USER MANAGEMENT — ADD / UPDATE / DELETE
- Admin add user (with role selector — critical ambiguity resolved)
- Admin add store (with optional owner_id FK — separate email, nullable)
- Admin view user details (with rating shown if owner)
- Update / delete users/stores (admin only; soft delete optional; brief says delete implied)

## PHASE 6 — SIGN-UP & ACCESS CONTROL
- Normal User self-registration (email unique check; name 20–60 chars)
- Role-based route guards (frontend) + middleware (backend)
- Logout (clear cookie/token)

## PHASE 7 — TESTING, DOCUMENTATION & DEPLOYMENT
- Test suite: auth, role guards, rating upsert, validation failures
- README with install, seed credentials, deploy steps
- VISION.md (business extension for interview)
- Final audit against brief line-by-line
- Deploy to Render + Vercel + Neon; verify live URL

Time budget: ~31h work + 4h buffer. This file is updated as phases complete (not a 2-day exercise).
