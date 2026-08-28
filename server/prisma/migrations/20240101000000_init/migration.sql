-- Phase 1 Init Migration — RateStore (PostgreSQL)
-- Applies relational rigor: FKs, UNIQUE(user_id,store_id), CHECK constraints, indexes.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'OWNER');

CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(60) NOT NULL CHECK (char_length("name") BETWEEN 20 AND 60),
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "address" VARCHAR(400) NOT NULL CHECK (char_length("address") <= 400),
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "users_name_idx" ON "users"("name");

-- Stores
CREATE TABLE "stores" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(60) NOT NULL CHECK (char_length("name") BETWEEN 20 AND 60),
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "address" VARCHAR(400) NOT NULL CHECK (char_length("address") <= 400),
    "owner_id" UUID REFERENCES "users"("id") ON DELETE SET NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX "stores_name_idx" ON "stores"("name");
CREATE INDEX "stores_email_idx" ON "stores"("email");
CREATE INDEX "stores_address_idx" ON "stores"("address");
CREATE INDEX "stores_owner_id_idx" ON "stores"("owner_id");

-- Ratings (upsert semantics via unique constraint)
CREATE TABLE "ratings" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "store_id" UUID NOT NULL REFERENCES "stores"("id") ON DELETE CASCADE,
    "value" SMALLINT NOT NULL CHECK ("value" BETWEEN 1 AND 5),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE ("user_id", "store_id")
);

CREATE INDEX "ratings_store_id_idx" ON "ratings"("store_id");
CREATE INDEX "ratings_user_id_idx" ON "ratings"("user_id");
CREATE INDEX "ratings_store_value_idx" ON "ratings"("store_id", "value");
