## Goal

Add two master switches at the top of `/admin/promos`:

- **Show Hero section** — hides/shows the entire homepage hero slider
- **Show Promo Banners section** — hides/shows the entire promo banners strip

When a toggle is OFF, that whole section is removed from the homepage. When ON, it appears normally. Default: both ON.

## Database

New table `section_visibility` (simple key/value flags so we can add more sections later):

- `section_key text primary key` — `'hero'` or `'promo_banners'`
- `visible boolean not null default true`
- `updated_at timestamptz not null default now()`

RLS:
- Anyone can `SELECT` (storefront reads it)
- Admins can `INSERT/UPDATE` (via `has_role(auth.uid(), 'admin')`)

Seed two rows: `('hero', true)` and `('promo_banners', true)`.

## Admin UI (`src/pages/admin/Promos.tsx`)

Add a new card at the very top of the page, above "Hero buttons":

```
Sections visibility
  [✓] Show Hero section          (the big rotating banner on home)
  [✓] Show Promo Banners section (the banner strip below the hero)
```

Each toggle saves immediately via `upsert` to `section_visibility`.

## Storefront

1. New hook `src/hooks/useSectionVisibility.ts` — fetches the table, returns `{ hero: boolean, promo_banners: boolean }` (defaults to `true` if missing).

2. In `src/storefront/home.jsx`:
   - If `hero === false` → don't render the `<Hero />` component.
   - If `promo_banners === false` → don't render the `<PromoBanners />` component.

Defaults to visible if the data hasn't loaded yet — no flash-of-empty.

## Out of scope

- The per-slide button toggles (already built, untouched).
- The per-banner settings (already built, untouched).
- These new switches are master overrides only.

## Files touched

- New migration: create `section_visibility` table + RLS + seed
- New: `src/hooks/useSectionVisibility.ts`
- Edit: `src/pages/admin/Promos.tsx` — add "Sections visibility" card at top
- Edit: `src/storefront/home.jsx` — conditionally render Hero and PromoBanners
