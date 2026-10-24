# CLAUDE.md — Delivery Management App

## Context
Timed technical challenge: 60 minutes total, including coding, testing, GitHub push and live Vercel deploy.
**Working functionality beats complexity.** Ship small, correct, tested pieces. No features that were not requested.

## Stack (do not change)
- Next.js (App Router) + TypeScript (strict) + Tailwind CSS
- Supabase: Auth (email/password) + Postgres, via `@supabase/ssr`
- Leaflet + react-leaflet + OpenStreetMap tiles (no API key)
- Deploy: Vercel

## Features (scope)
1. Auth: sign up, log in, log out with email/password AND "Continue with Google" (Supabase OAuth).
   OAuth uses `redirectTo: ${window.location.origin}/auth/callback` and a `/auth/callback` route that exchanges the code for a session.
   Signup requires an "I agree to the Terms and Privacy Policy" checkbox linking to `/terms` and `/privacy`.
   Middleware protects app routes; `/login`, `/signup`, `/terms`, `/privacy`, `/auth/callback` are public.
2. Zones: click map to set center, enter name + radius (km). Show all zones as circles.
3. Products: name, price, quantity; assign to one or more zones (many-to-many). List them.
4. Orders: product + quantity + address picked on map. Validate server-side with haversine:
   point must be inside at least one zone where the product is available.
   Valid → save with assigned zone (nearest center if several). Invalid → clear red error, nothing saved.
   List orders with their zone.
5. Dashboard: each zone with its products and orders.

## Branding
App name: "QuickDrop" (food delivery theme), icon 🛵. Clean, modern, one accent color (e.g. orange-500), neutral grays, rounded-2xl cards, soft shadows.
Login/signup page: app name + one-line tagline + form. No marketing landing page. After login, home = Dashboard.

## Legal pages
`/terms` and `/privacy`: readable static pages (max-w-prose, headings, last-updated date), clearly marked as a demo for an evaluation project.
Cover: service description, accounts, acceptable use, data collected (email, zones, products, orders, map coordinates), Supabase as processor, Google sign-in data (name, email), no selling of data, deletion on request, contact email.
Linked from the signup checkbox and the login page footer.

## Dashboard (home after login)
Stats cards (zones, products, orders count), big "New Order" button, overview map with all zone circles and order markers,
then one card per zone listing its products and orders. Empty state guides new users: create zone → product → order.

## Database
- Single file `supabase/schema.sql`: tables `zones`, `products`, `product_zones`, `orders`, each with `user_id` (default `auth.uid()`).
- RLS enabled on every table; users read/write only their own rows.
- Validate quantity > 0, price >= 0, radius > 0 (in DB and in forms).

## Responsive design rules (mobile-first, always)
Write base styles for phone first, then scale up with `sm:` / `md:` / `lg:`. Never design desktop-first.

### Breakpoints to support and check
- Phone: 360–430px wide (base styles)
- Tablet: 768–1024px (`md:`), portrait and landscape
- Desktop: 1280px+ (`lg:`)

### Layout
- Phone: single column. Bottom navigation bar fixed at the bottom, 4 items max (Dashboard, Zones, Products, Orders) + logout in header.
- Tablet: two columns where it helps (map + form side by side in landscape, stacked in portrait).
- Desktop: top/side navigation, content in `max-w-6xl mx-auto`, map and list side by side.
- Add bottom padding to page content on phone so the fixed nav never covers content (`pb-20 md:pb-0`).
- Respect safe areas on iPhone: `padding-bottom: env(safe-area-inset-bottom)` on the bottom nav; `viewport-fit=cover` in viewport meta.
- No horizontal scroll at any width. Use `min-w-0` on flex children and `break-words` for long text.

### Touch & forms
- Tap targets at least 44×44px (`min-h-11`, `px-4`).
- Inputs `text-base` (16px) minimum so iOS Safari does not zoom on focus.
- Correct input types: `type="email"`, `inputMode="decimal"` for price/radius, `inputMode="numeric"` for quantity.
- Buttons full-width on phone (`w-full md:w-auto`).
- Show loading state on every submit button and disable it while pending (prevent double submit).
- Clear success and error messages, close to the form, readable on small screens.

### Map (Leaflet)
- Always load map components with `next/dynamic` and `ssr: false`.
- Import `leaflet/dist/leaflet.css`. Fix default marker icons (set icon URLs explicitly).
- Height: `h-[50vh] md:h-[60vh] lg:h-[70vh]`, never a fixed pixel width; always `w-full`.
- Container needs `relative z-0` so it never overlaps the bottom nav or modals.
- Phone: disable scrollWheelZoom, keep touch zoom/drag. Buttons ("Use this location", "Save") outside the map, below it, not floating on top.
- Show the selected point with a marker and display its lat/lng in text.
- Default center: Morocco (Casablanca, ~33.57, -7.59) zoom 11; fit bounds to existing zones when there are any.
- Call `map.invalidateSize()` after layout changes (tabs, resize) to avoid grey tiles.

### Lists & data
- Phone: cards, not wide tables. Tablet/desktop: grid of cards (`md:grid-cols-2 lg:grid-cols-3`) or a table.
- Empty states for every list ("No zones yet — create one on the map").
- Format prices consistently (2 decimals, currency label MAD).

### Accessibility basics
- Every input has a `<label>`. Visible focus styles. Sufficient contrast. Error messages linked with `aria-describedby`.

## Code rules
- Server-side validation for orders (Route Handler or Server Action). Never trust client-only checks.
- Haversine helper in `lib/geo.ts`, used by the server.
- Keep components small; no unnecessary libraries.
- No `any`. `npm run build` must pass with zero errors before every push.
- Secrets only in env vars. Commit `.env.example`, never `.env*.local`.

## Env vars
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Workflow
1. Work feature by feature in this order: auth + schema → deploy → zones → products → orders → dashboard → polish.
2. After each feature: run `npm run build`, then commit with a clear message (e.g. `feat: zones map with radius circles`).
3. After auth works, stop and tell me so I can deploy to Vercel early.
4. If something blocks for more than a few minutes, propose the simplest working alternative.
5. Before finishing, review every page at 375px, 768px and 1280px widths and fix layout issues.

## Deployment checklist
- Env vars set in Vercel (Production + Preview).
- Supabase Auth → URL Configuration: Site URL = Vercel URL; add it to redirect URLs.
- Email confirmation disabled in Supabase for testing.
- Google provider enabled in Supabase; Vercel URL + `/auth/callback` in Supabase redirect URLs; Google OAuth consent screen published ("In production").
- Refresh works on every route while logged in; logged-out users redirect to `/login`.
- Test on a real phone over HTTPS.

## README must include
Setup, env vars, running `schema.sql`, local dev, Vercel deploy steps, AI tools used, test credentials, and the validation rule (address must be inside a zone where the product is available).