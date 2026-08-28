# MEMORY.md

## PROJECT CONTEXT
RateStore — full-stack intern assessment (Express + React + PostgreSQL + Prisma). 35h budget. Empty GitHub repo (aniketdede/RateStore) — initialize locally and push.

## KEY DECISIONS DOCUMENTED
- **Schema**: 3 tables (users, stores, ratings). Ratings have UNIQUE(user_id, store_id) for upsert semantics. Average computed, not stored.
- **Validation**: Shared Zod module + DB CHECK constraints (name length 20–60, address ≤400, password 8–16 with uppercase + special, rating 1–5).
- **Role creation**: Only Normal Users self-register. Admin creates Admin/User/Owner via form with role selector (resolves ambiguity in brief).
- **Store email**: Separate from owner email; store.email UNIQUE, nullable owner_id FK (ON DELETE SET NULL).
- **Filters/sort**: Query params → SQL WHERE / ORDER BY / LIMIT / OFFSET. Not JS array operations.
- **Tests**: Auth, role guard, rating upsert (90 min investment — high ROI separation signal).
- **Deploy**: Neon (DB), Render (API), Vercel (client). Note Render free tier sleep (~50s cold start) — document in README, not hidden.
- **Business vision**: `business.txt` / `VISION.md` captures government-registration, coupon loop, QR feedback — NOT in code scope.
- **Docs-first**: These 6 files (PRD, architecture, rules, phases, design, MEMORY) updated as build progresses, not a 2-day exercise.

## AMBIGUITIES RESOLVED IN WRITING (not silently guessed)
- Stores have separate email from owner; owner_id nullable.
- Admin add-user form includes role selector (Admin/User/Owner).
- Ratings: one per user/store → upsert endpoint.
- Average rating: LEFT JOIN + AVG GROUP BY (computed).
- Seed data passes validators; README lists all 3 role credentials.

## RISK / WATCH ITEMS
- Do not overbuild VISION.md features (would sink 35h budget).
- Keep validation shared; do not duplicate in React and Express independently.
- Final audit: walk brief bullet-by-bullet against running app (Phase 7).
