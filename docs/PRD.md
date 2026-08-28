# PRD — RateStore (Store Rating Platform)

## 1. WHAT TO BUILD
A single-login web application with three roles (Admin, Normal User, Store Owner) that lets users submit 1–5 ratings for registered stores. Admin manages users/stores; Normal Users sign up, rate, and modify ratings; Store Owners view ratings for their store.

## 2. TARGETED USER
- **Admin**: Needs a dashboard + CRUD for users/stores, filters on Name/Email/Address/Role.
- **Normal User**: Needs signup, store list with search/filter, submit/modify rating (1–5), password update.
- **Store Owner**: Needs login, average rating of their store, list of raters for their store, password update.

## 3. FEATURES (scoped to brief; vision expanded in VISION.md)
- Single login for all roles; JWT session.
- Register / Login / Logout for all.
- Password update (post-login) for User and Owner.
- Admin add-user form with role selector (Admin/User/Owner) + store creation.
- Store list with server-side filter/sort/pagination (Name, Email, Address, Rating).
- User list with server-side filter/sort/pagination (Name, Email, Address, Role).
- Ratings: submit (upsert) with unique (user_id, store_id) constraint; 1–5 integer.
- Admin dashboard: total users, total stores, total ratings.
- Form validations enforced in shared validator module and DB CHECK constraints.

## 4. OUT OF SCOPE (for assessment; captured in VISION.md)
- Government registration integration, QR-code feedback, coupon loop, multi-store analytics, payment, notifications.

## 5. SUCCESS CRITERIA (grader checklist)
- [ ] Schema: real PK/FK, UNIQUE(user_id, store_id), indexes, ON DELETE behavior.
- [ ] Server-side filtering/sorting/pagination on all listings.
- [ ] 20-char min / 60-char max Name enforced in DB + server + client.
- [ ] Ratings are upsert (one per user/store); average computed, not stored.
- [ ] Seed data passes all validators.
- [ ] Three role surfaces accessible after JWT login with role guards.
- [ ] Tests over auth, role guards, rating upsert.
- [ ] README with setup + seeded credentials + deploy URL.
