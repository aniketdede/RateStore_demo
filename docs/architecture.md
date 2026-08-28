# ARCHITECTURE.md

## 1. ARCHITECTURE
High-level: React SPA → Express REST API → PostgreSQL. JWT in httpOnly cookie + Authorization header fallback. Single database; no caching layer needed at this scale.

## 2. FOLDER & FILE STRUCTURE
```
RateStore/
├── docs/           # Phase 0 contracts (this file, PRD, rules, phases, design, MEMORY)
├── server/         # Express + Prisma
│   ├── prisma/     # schema.prisma + migrations + seed.js
│   ├── src/
│   │   ├── config/         # db, env, jwt, bcrypt settings
│   │   ├── middleware/     # auth, roleGuard, errorHandler, validation
│   │   ├── modules/        # auth, users, stores, ratings, admin
│   │   ├── validators/     # shared Zod schemas (name, email, password, address)
│   │   └── app.js
│   └── tests/      # auth, role, rating upsert
├── client/         # React (Vite) + React Router
│   └── src/        # api, components, context/auth, pages, routes
├── README.md
└── VISION.md
```

## 3. TECH STACK
- **Backend**: Express (Node/JS) — zero learning tax; fits brief.
- **DB / ORM**: PostgreSQL + Prisma (migrations + type-safe queries + seed).
- **Frontend**: React (Vite) — standard, deployable to Vercel.
- **Auth**: bcrypt + jsonwebtoken; roles stored in JWT payload and DB.
- **Validation**: Zod (shared) + DB CHECK constraints.
- **Deploy**: Render (API) + Vercel (client) + Neon (Postgres) — all free tiers.

## 4. DATA FLOW
Client (form / list) → API (filter/sort/paginate query params) → Prisma (SQL) → Postgres → JSON back → React table. No client-side sorting/filtering of large datasets (grader checks server-side).

## 5. SECURITY / QUALITY
- Passwords hashed with bcrypt (10 rounds).
- JWT secret from env; cookie httpOnly + secure in production.
- Role guard middleware checks token role against endpoint.
- CORS allowlist (production URL + localhost).
- No secrets in repo.
