#!/bin/bash
# RateStore DB bootstrap script (Phase 1)
# Usage: 1. Set DATABASE_URL in server/.env (Neon or local)
#        2. npm run db:migrate && npm run db:seed
#        3. npm run dev

echo "=== RateStore DB Setup ==="
if [ -z "$DATABASE_URL" ] && [ ! -f ../.env ]; then
  echo "ERROR: Create server/.env with DATABASE_URL first."
  echo "Neon quickstart: https://neon.tech/docs/quickstart/"
  exit 1
fi

echo "Applying migrations..."
npx prisma migrate deploy

echo "Seeding compliant data (names 20-60 chars, passwords pass validator)..."
npx prisma db seed

echo "DB ready. Start server with: npm run dev"
