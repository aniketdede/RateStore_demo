# RULES.md

## 1. RULES (non-negotiable for this build)
- One shared validation module (`server/src/validators/`) used by both server and client. No duplicate rules.
- DB CHECK constraints mirror validation rules so DB is the final guard.
- Every seed record passes all validators (Name 20–60 chars, Email valid, Password 8–16 with uppercase + special, Address ≤400).
- All listings support server-side sort (`sortBy`, `order`) and paginate (`page`, `limit`) via query params.
- Ratings: only upsert via unique constraint; never insert duplicate. Average rating computed at query time (LEFT JOIN + AVG GROUP BY).
- Admin creates owners; only Normal Users can self-register.
- No hardcoded localhost URLs; env-driven.

## 2. WHAT TO AVOID
- Do NOT store `avg_rating` column (staleness risk; compute it).
- Do NOT filter/sort in React arrays for graded endpoints (server query params required).
- Do NOT use MongoDB (brief expects relational rigor; Prisma + Postgres is the correct choice here).
- Do NOT skip tests — a 90-minute suite over auth + role guards + rating upsert separates submissions.
- Do NOT build VISION.md features into code (scoped out; document only).

## 3. LIBRARIES / DEPENDENCIES APPROVED
- Express, Prisma, PostgreSQL client, bcrypt, jsonwebtoken, zod, cors, dotenv.
- React, Vite, react-router-dom, axios (or fetch wrapper).
- Vitest / Jest + Supertest for server tests.
- No new heavy frameworks; stay within brief.
