# VISION.md — RateStore 


## GOVERNMENT COMPLIANCE & MANDATORY REGISTRATION
Partner with food-safety authorities for mandatory hotel/restaurant registration. Real-time data for government: which establishments follow policy, low ratings trigger inspection/raid. Government earns from registration fees and data access.

## QR-CODE FEEDBACK LOOP (Customer)
Every registered hotel prints a unique QR code. Customer scans → submits review on RateStore → on success receives a coupon code redeemable at any other registered hotel in the same network.

## REAL VS FAKE REVIEWS
Only registered customers (verified via QR / in-person visit / government ID linkage) can review. Fake feedback prevented by registration gate + unique (user, store) constraint + possible identity verification layer.

## COUPON / REWARD ECONOMICS
- Customer earns coupon on review (after 3+ reviews to prevent gaming).
- Hotel pays subscription / per-impression fee; government takes data-access fee.
- RateStore earns from government + hotels + data recommendations (pushed recommendations based on visit history).

## SCALABILITY / TECH EVOLUTION (Post-Assessment)
- Denormalize `avg_rating` if read volume exceeds compute capacity; add `pg_trgm` for ILIKE search acceleration.
- Add notifications, mobile app, analytics dashboard for government.
- Multi-region deployment (Neon branches per region, Vercel Edge, Render regions).

