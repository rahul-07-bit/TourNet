# TourNet — Supabase + Google OAuth Setup Guide

Complete step-by-step guide to get Email and Google Sign-In working in TourNet.

---

## Part 1 — Create Your Supabase Project

1. Go to [supabase.com](https://supabase.com) → sign in.
2. Click **New Project** → name it `tournet` → pick a region → set a DB password → **Create project**.
3. Wait ~2 minutes for provisioning.

---

## Part 2 — Add Credentials to `.env`

1. Open your Supabase Dashboard → **Settings** (gear icon) → **API**.
2. Copy **Project URL** and **anon public** key.
3. Open the `.env` file in your project root and paste them:

```dotenv
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...your-anon-key...
```

4. Restart the dev server: `npm run dev`

> ✅ The amber **"Supabase Setup Required"** banner disappears automatically once credentials are valid.

---

## Part 3 — Create the Database Schema

Go to **SQL Editor** in your Supabase Dashboard → **New Query** → paste and **Run**:

```sql
-- ──────────────────────────────────────────────────────────
-- TourNet Database Schema
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id          UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name   TEXT,
  name        TEXT,
  email       TEXT NOT NULL,
  avatar_url  TEXT,
  provider    TEXT DEFAULT 'email',
  tier        TEXT DEFAULT 'Explorer',
  preferences JSONB DEFAULT '{}'::jsonb,
  stats       JSONB DEFAULT '{"trips": 0, "safetyXP": 0, "reviews": 0}'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  updated_at  TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS favorites (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id   UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  dest_id   TEXT NOT NULL,
  name      TEXT NOT NULL,
  location  TEXT,
  image     TEXT,
  category  TEXT,
  saved_at  TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  UNIQUE(user_id, dest_id)
);

CREATE TABLE IF NOT EXISTS activity (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id   UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type      TEXT NOT NULL,
  dest_id   TEXT NOT NULL,
  dest_name TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

-- Row Level Security
ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity  ENABLE ROW LEVEL SECURITY;

-- Policies: users can only access their own data
CREATE POLICY "Users can view own profile"   ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own favorites"   ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own activity"   ON activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON activity FOR INSERT  WITH CHECK (auth.uid() = user_id);
```

---

## Part 4 — Enable Email Authentication

1. Supabase Dashboard → **Authentication** → **Providers** → **Email** → ensure it is **Enabled**.
2. Under the Email Provider settings, set **OTP Expiry** to `300` seconds (5 minutes).
3. *(Dev)* Dashboard → **Authentication** → **Rate Limits** → increase to avoid the 3 emails/hour default.

---

## Part 5 — Enable Google OAuth ⭐

This is the most important part. Follow every step exactly.

### Step 5A — Configure Redirect URLs in Supabase

1. Supabase Dashboard → **Authentication** → **URL Configuration**.
2. Set **Site URL** to `http://localhost:5173` (change this to your production domain when deploying).
3. Under **Redirect URLs**, add all of these:

```
http://localhost:5173/**
http://localhost:5173/auth/callback
https://yourdomain.com/**
https://yourdomain.com/auth/callback
```

   > ⚠️ The `**` wildcard allows any path. This is required for the OAuth redirect to work.

4. Click **Save**.

---

### Step 5B — Create Google OAuth Credentials

1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Click the project dropdown at the top → **New Project** → name it `TourNet` → **Create**.
3. Select your new project.
4. In the left menu → **APIs & Services** → **OAuth consent screen**:
   - Select **External** → **Create**
   - App name: `TourNet`
   - User support email: your email
   - Developer contact email: your email
   - Click **Save and Continue** through all steps
   - Click **Back to Dashboard**
5. In the left menu → **APIs & Services** → **Credentials**:
   - Click **+ Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: `TourNet Web Client`
   - Under **Authorized redirect URIs**, add **exactly**:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
     > ⚠️ Replace `your-project-id` with your actual Supabase project ID.
     > This is Supabase's callback URL — **NOT** your app's URL.
   - Click **Create**
6. Copy the **Client ID** and **Client Secret** that appear.

---

### Step 5C — Enable Google Provider in Supabase

1. Supabase Dashboard → **Authentication** → **Providers** → **Google**.
2. Toggle **Enable** to ON.
3. Paste your **Client ID** and **Client Secret** from Step 5B.
4. Click **Save**.

---

### Step 5D — Test Google Sign-In

1. Open your app at `http://localhost:5173`.
2. Click **Continue with Google**.
3. Select your Google account → **Allow**.
4. You should be redirected back to TourNet and logged in.
5. Check Supabase Dashboard → **Authentication** → **Users** — your account should appear.
6. Check **Table Editor** → `profiles` — a profile row should be created automatically.

---

## Part 6 — Production Deployment Checklist

When deploying to production (Vercel, Netlify, etc.):

- [ ] Update `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your hosting provider's environment variables.
- [ ] Update Supabase **Site URL** to your production domain: `https://yourdomain.com`
- [ ] Add production redirect URLs in Supabase: `https://yourdomain.com/**`
- [ ] Add your production callback URL in Google Cloud Console: `https://your-project-id.supabase.co/auth/v1/callback` (already added — no change needed)
- [ ] Configure your hosting provider to serve `index.html` for all routes (SPA fallback):
  - **Vercel**: Add `vercel.json`:
    ```json
    { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
    ```
  - **Netlify**: The `_redirects` file in `/public`:
    ```
    /* /index.html 200
    ```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Redirect URI mismatch" | The URI in Google Cloud Console must be exactly `https://your-project-id.supabase.co/auth/v1/callback` |
| "OAuth callback not working" | Check Supabase → Auth → URL Configuration → Redirect URLs has `http://localhost:5173/**` |
| "Profile not created" | Check the SQL Editor ran successfully and the `profiles` table exists |
| "Session lost after refresh" | Make sure `persistSession: true` in supabase.js (already set) |
| Amber setup banner still showing | Check `.env` has real values (not placeholders), restart `npm run dev` |
| "Invalid login credentials" | Enable Email provider in Supabase Auth → Providers → Email |

---

## Quick Reference — URLs

| Setting | Value |
|---------|-------|
| Google Cloud Console redirect URI | `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback` |
| Supabase Site URL (dev) | `http://localhost:5173` |
| Supabase Redirect URL (dev) | `http://localhost:5173/**` |
| App OAuth callback path | `/auth/callback` |
