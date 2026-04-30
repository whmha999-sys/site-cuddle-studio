## Goal

In the screenshot you sent, the hero has **two buttons**:
- **SHOP P50 →** (orange, primary)
- **EXPLORE TECLAST** (outlined, secondary)

You want admin controls to **show or hide each button independently**, per hero slide (Vikusha Watch, VZ-30 PRO, Teclast P50). Each slide gets its own toggles — turning a button off on one slide doesn't affect others.

## Why a new section in the dashboard

The hero slides today are **built into the code** (not in the database like Promo banners). So the admin can't edit their text or links — but we can store **per-slide button visibility flags** in the database and the hero will respect them.

Result: a new card in `/admin/promos` (or its own page) called **"Hero buttons"** with three rows (one per slide), each showing two toggles:

```
Vikusha Smartwatch
  [✓] Show "Claim Yours" button
  [✓] Show "Explore Vikusha" button

Vikusha VZ-30 PRO
  [✓] Show "Shop VZ-30 PRO" button
  [ ] Show "Explore Tablets" button

Teclast P50
  [✓] Show "Shop P50" button
  [✓] Show "Explore Teclast" button
```

## Database

New table `hero_slide_settings`:

- `slide_id text primary key` — `'v-70'`, `'vz-30-pro-4g'`, `'teclast-p50'`
- `primary_button_enabled boolean not null default true`
- `secondary_button_enabled boolean not null default true`
- `updated_at timestamptz not null default now()`

RLS:
- Anyone can `SELECT` (storefront needs to read it)
- Admins can `INSERT/UPDATE/DELETE` via `app_private.has_role(auth.uid(), 'admin')`

Seed three rows (one per existing slide id) with both buttons enabled by default — so nothing changes visually until you toggle.

## Admin UI

Add a new section at the top of `src/pages/admin/Promos.tsx` (above the existing "Promo banners" list) titled **"Hero buttons"**:

- Fetch all rows from `hero_slide_settings`.
- For each of the 3 known slides (Vikusha Watch / VZ-30 PRO / Teclast P50), render a small card with the slide name and two `Switch` toggles ("Show primary button" / "Show secondary button").
- Each toggle calls `update(slide_id, { primary_button_enabled: v })` etc., saving immediately.

Slide display names are hardcoded in the admin component (English labels) so you instantly recognize which row is which.

## Storefront

In `src/storefront/home.jsx`:

1. Add a new hook `useHeroSettings()` (in `src/hooks/useHeroSettings.ts`) that fetches the table and returns a `{ [slide_id]: { primary, secondary } }` map.
2. In the hero slide renderer (lines ~671–705), wrap each button:
   - Render the **primary** button only if `settings[slide.id]?.primary_button_enabled !== false`
   - Render the **secondary** button only if `settings[slide.id]?.secondary_button_enabled !== false`
3. If both are off, the CTA row collapses cleanly (no empty space).
4. Default to **on** if the row is missing — no broken state on first load.

## Out of scope

- Editing button **text** or **links** (those stay in code for now). If you want that too, say the word and I'll extend the schema with `primary_label`, `primary_url`, etc.
- The promo banner buttons (already done in the previous step).
- Hero slide images, prices, badges — unchanged.

## Files touched

- New migration: create `hero_slide_settings` + RLS + seed
- New: `src/hooks/useHeroSettings.ts`
- Edit: `src/pages/admin/Promos.tsx` — add "Hero buttons" section at top
- Edit: `src/storefront/home.jsx` — conditionally render the two CTAs per slide
