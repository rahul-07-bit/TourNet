-- ──────────────────────────────────────────────────────────
-- TourNet Database Schema Extension: OTP Verifications Table
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS otp_verifications (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT NOT NULL,
  otp         TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  attempts    INT DEFAULT 0 NOT NULL,
  verified    BOOLEAN DEFAULT false NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

-- Note: We intentionally do NOT create any public select/insert/update policies.
-- This ensures that only the Supabase Service Role Key (used by our server)
-- has the permissions required to access and modify this table.
