# 🛵 QuickDrop — Delivery Management

A mobile-first web app to manage food delivery **zones**, **products** and **orders** on a map.
An order is only accepted if its address falls inside a zone where the product is available.

**Live demo:** https://YOUR-APP.vercel.app <!-- replace with your Vercel URL -->

### Test credentials

| Email | Password |
| --- | --- |
| `test@quickdrop.app` | `Test1234!` |

The test account comes pre-filled with demo data (3 Casablanca zones, 5 products, 5 orders) from `supabase/seed.sql`.

---

## Features

- **Auth** — sign up / log in / log out with email + password or **Continue with Google**. Signup requires accepting the Terms and Privacy Policy. All app routes are protected.
- **Zones** — tap the map to set a center, enter a name and radius (km). Zones are drawn as circles; a dashed circle previews the radius before saving. List with "show on map" and delete.
- **Products** — name, price (MAD), quantity, and the zones where the product is available (many-to-many). Listed as cards with zone badges.
- **Orders** — pick a product, quantity, and tap the delivery address on the map. The product's zones are highlighted. The server validates the address and assigns the zone.
- **Dashboard** — stats, a big "New Order" button, an overview map with zone circles and order markers, and one card per zone listing its products and orders. New users get a 3-step guide.
- **Legal** — `/terms` and `/privacy` pages (marked as a demo for an evaluation project).

## The validation rule

> **An order's address must be inside at least one zone where the selected product is available.**

- "Inside" means the [haversine](https://en.wikipedia.org/wiki/Haversine_formula) distance from the zone center is ≤ the zone radius ([`lib/geo.ts`](lib/geo.ts)).
- If several of the product's zones contain the address, the order is assigned to the **nearest zone center**.
- Quantity must be > 0 and ≤ the product's stock.
- Invalid orders are **not saved** and show a clear red error:
  - *"This address is outside all delivery zones."*
  - *"This address is outside the zones where this product is available."*

The check runs **on the server** in a Server Action ([`app/(app)/orders/actions.ts`](app/(app)/orders/actions.ts)). The form shows a live preview, but the server is the source of truth. A Postgres trigger (`validate_order` in `schema.sql`) enforces the same rules again, so the API can't be used to bypass them.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Server Actions, Proxy) + TypeScript (strict)
- Tailwind CSS v4
- [Supabase](https://supabase.com) — Auth (email/password + Google OAuth) and Postgres with Row Level Security, via `@supabase/ssr`
- [Leaflet](https://leafletjs.com) + [react-leaflet](https://react-leaflet.js.org) with OpenStreetMap tiles (no API key)
- Deployed on [Vercel](https://vercel.com)

---

## Setup

### 1. Install

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in the values from **Supabase → Project Settings → API**:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Only the public anon key is used. Data access is protected by Row Level Security. Never commit `.env.local`.

### 3. Database

In **Supabase → SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql). It creates:

- tables `zones`, `products`, `product_zones`, `orders` (each with `user_id` defaulting to `auth.uid()`)
- checks: `price >= 0`, `quantity > 0`, `radius_km > 0`, valid lat/lng
- RLS on every table: users can only read and write their own rows
- the `validate_order` trigger (zone + availability + stock)

The script can be re-run safely.

### 4. Demo data (optional)

1. Create the user `test@quickdrop.app` (sign up in the app, or **Authentication → Add user**).
2. Run [`supabase/seed.sql`](supabase/seed.sql) in the SQL Editor.

The seed clears and recreates that user's demo data, so it can be re-run.

### 5. Auth settings

In **Supabase → Authentication**:

- **Sign In / Providers → Email**: for quick testing, turn off "Confirm email".
- **URL Configuration**: Site URL = your app URL. Add `http://localhost:3000/auth/callback` and `https://YOUR-APP.vercel.app/auth/callback` to **Redirect URLs**.

### 6. Run locally

```bash
npm run dev
```

Open http://localhost:3000. Logged-out users are redirected to `/login`.

## Google OAuth setup

1. In [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services**:
   - Configure the **OAuth consent screen** (app name, support email, authorized domain `supabase.co` and your Vercel domain), then **publish** it ("In production") so any Google account can sign in.
   - **Credentials → Create credentials → OAuth client ID** → *Web application*.
   - **Authorized redirect URI**: `https://<your-project-ref>.supabase.co/auth/v1/callback` (shown in Supabase on the Google provider page).
2. In **Supabase → Authentication → Sign In / Providers → Google**: enable it and paste the Client ID and Client Secret.
3. Make sure your app's `/auth/callback` URLs are in Supabase's Redirect URLs (step 5 above).

The app calls `signInWithOAuth({ provider: "google", options: { redirectTo: `${origin}/auth/callback` } })`. The `/auth/callback` route exchanges the code for a session.

## Deploy to Vercel

1. Push the repo to GitHub and **Import** it in Vercel (framework: Next.js, default settings).
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in **Settings → Environment Variables** (Production + Preview).
3. Deploy, then in Supabase set the **Site URL** to the Vercel URL and add `https://YOUR-APP.vercel.app/auth/callback` to the Redirect URLs.
4. Check: refreshing any page while logged in works; logged-out users land on `/login`; Google sign-in returns to the dashboard.

## Project structure

```
app/
  (auth)/login, (auth)/signup    Auth pages
  (app)/layout.tsx               App shell: header, top nav (md+), bottom nav (phone)
  (app)/page.tsx                 Dashboard
  (app)/zones/                   Page + server actions (create/delete zone)
  (app)/products/                Page + server actions (create/delete product)
  (app)/orders/                  Page + server action (validated order creation)
  auth/callback/route.ts         OAuth code exchange
  terms/, privacy/               Legal pages
components/
  auth/                          Login/signup forms, Google button
  dashboard/ zones/ products/ orders/   Feature UI (forms, lists, maps)
  map/                           Leaflet setup (icons, defaults) and map helpers
  shell/                         Navigation, logout, user email
  ui/                            Shared fields, buttons, delete confirmation, cards
lib/
  geo.ts                         Haversine + matching zones (used by the server)
  validation.ts                  Input validation shared by forms and server actions
  types.ts                       Row types and query column lists
  supabase/                      Browser client, server client, proxy session refresh
proxy.ts                         Route protection (Next.js 16 "proxy", formerly middleware)
supabase/
  schema.sql                     Tables, constraints, RLS, order trigger
  seed.sql                       Demo data for test@quickdrop.app
```

## AI tools used

- **Claude Code** — scaffolding, implementation and debugging.
- **Me** — I defined the architecture and requirements, reviewed the code, and tested manually on mobile and desktop.
