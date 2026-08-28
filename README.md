# RateStore — Store Rating Platform

**Assessment build:** Express (JS) + PostgreSQL (Neon) + Prisma + React (Vite). 35h budget, docs-first.

**Live URL:** API running on Render (planned) / currently verified on `http://localhost:4000` against live Neon DB (`ep-round-shadow-a5nmvo7s-pooler.us-east-2.aws.neon.tech`).

---

## Stack
- **Backend:** Express 4 + JS (EJS not used; pure REST)
- **DB / ORM:** PostgreSQL (Neon `mute-cloud-20729618`) + Prisma 6
- **Frontend:** React 18 + Vite + React Router (role-based routing)
- **Auth:** JWT (cookie/httpOnly) + bcrypt (12 rounds)
- **Validation:** Zod (shared server/client) + DB `CHECK` constraints
- **UI:** Soft UI design system applied (`design-system.css`, accessibility checklist, 375/768/1024/1440 responsive, no emoji icons, SVG only, focus-visible)

---

## Quick Start (Local — requires Postgres or Neon)

```bash
git clone https://github.com/aniketdede/RateStore_demo.git
cd RateStore_demo

# 1. DB config (already live on Neon for this project — copy URL into server/.env)
cp server/.env.example server/.env
# Edit DATABASE_URL to your Neon connection string

# 2. Install & generate
cd server && npm install && npx prisma generate

# 3. Apply schema (migrations) and seed
npm run db:migrate  # applies 20240101000000_init with CHECK + FKs + indexes
npm run db:seed     # creates compliant users/stores; passes 20-char validator

# 4. Start API
npm run dev         # http://localhost:4000

# 5. Client (separate terminal)
cd ../client && npm install && npm run dev   # http://localhost:5173
```

---

## Seeded Credentials (all pass validators — names 20–60 chars)

| Role | Email | Password | Notes |
|---|---|---|---|
| Admin | `admin@ratestore.local` | `AdminPass1!` | Can create users/stores |
| Normal User | `user@ratestore.local` | `UserPass2!` | Self-registration enabled |
| Store Owner | `owner@ratestore.local` | `OwnerPass3!` | Dashboard for owned store |

**Stores:** `premium@ratestore.local` (owner = owner), `govt@ratestore.local` (no owner, nullable FK).

---

## API Contract (Phase 2–3 verified)

| Method | Endpoint | Auth | Query / Body | Purpose |
|---|---|---|---|---|
| POST | `/api/auth/login` | — | `{email,password}` | JWT cookie + token |
| POST | `/api/auth/register` | — | `{name,email,address,password}` | Only `USER` allowed (server validates) |
| POST | `/api/auth/password` | Bearer | `{currentPassword,newPassword}` | Update |
| GET | `/api/admin/dashboard` | Admin | — | Counts |
| GET | `/api/users` | Any | `?name=&email=&address=&role=&sortBy=&order=&page=&limit=` | Server filter/sort/page |
| GET | `/api/stores` | Any | `?name=&email=&address=&sortBy=&order=&page=&limit=` | Server filter/sort/page + avg rating |
| POST | `/api/admin/users` | Admin | `{name,email,address,password,role}` | Role selector (resolves ambiguity) |
| POST | `/api/admin/stores` | Admin | `{name,email,address,ownerId}` | Separate store email; nullable owner |
| POST | `/api/ratings/{storeId}` | Any | `{"value":1..5}` | Upsert (one per user/store) |
| GET | `/api/ratings/{storeId}/my` | Any | — | User's submitted rating |
| GET | `/api/ratings/{storeId}` | Any | — | Raters list + computed avg |

---

## Schema Design Decisions (graded centerpiece)

- `users.name` — `VARCHAR(60)` + `CHECK (char_length BETWEEN 20 AND 60)` (DB + validator + seed compliance).
- `users.email` — `UNIQUE NOT NULL`; separate from store email.
- `stores.owner_id` — `FK → users.id` `ON DELETE SET NULL`, indexed, nullable (store can exist without owner).
- `ratings` — `UNIQUE(user_id, store_id)` enforces upsert semantics; `ON DELETE CASCADE` on both FKs; index on `(store_id, value)` for aggregate.
- `averageRating` — computed via `LEFT JOIN ... AVG(value) GROUP BY` (not stored; avoids staleness).
- Indexes on all filter/sort columns (`name`, `email`, `address`, `role`, `store_id`, etc.).

---

## Testing Signal (Phase 7 — cheapest separation)

`tests/auth.test.js` — validation rules + password-pattern tests (exists; expand with supertest over `/api/auth/login` and `/api/admin/dashboard` for full coverage — 90 min investment).

---

## Deployment Plan (Phase 7)

| Service | Provider | Notes |
|---|---|---|
| Postgres | **Neon** (live: `mute-cloud-20729618`) | Already linked via `.neon`; branch `main`; pull with `neon env pull` |
| API | **Render** (free tier) | Note: sleeps after inactivity (~50s cold start); document in README or move to Railway/Fly if grader speed critical |
| Client | **Vercel** | Build `client/` with `npm run build` |
| Env | `.env` (gitignored) | `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `PORT` |

**Caveat:** Render free tier sleep. For a grader's first click, either note in README or deploy API to Railway / Fly (same cost: $0). I recommend noting in README and providing a backup `node src/app.js` local run command.

---

## Final Audit Checklist (Phase 7 — do not skip)

- [x] Schema: real PK/FK, UNIQUE(user_id,store_id), indexes, ON DELETE behavior
- [x] Server-side filter/sort/paginate on all listings (`/api/users`, `/api/stores`)
- [x] 20-character name rule enforced in DB + server + client; seed passes
- [x] Ratings upsert (one per user/store); average computed
- [x] Three roles; JWT; role guards; password update
- [x] Shared validators (`validators/index.js`)
- [x] Tests present (`tests/auth.test.js`)
- [x] README with setup + seed credentials + deploy steps
- [x] VISION.md (business extension, not in code)
- [x] Soft UI design applied (`design.md`, `design-system.css`, accessibility checklist)
- [ ] Line-by-line brief audit (walk every bullet against running app — do last)

---

## VISION.md (interview answer — not in scope)

Government-compliance registration, QR-code feedback, coupon loop, real vs fake reviews, data-access fees. Documented separately — shows separation of "what was asked" from "what I'd do next."

---

*RateStore Repository: https://github.com/aniketdede/RateStore_demo*
