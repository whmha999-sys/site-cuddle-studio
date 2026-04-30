## Why your promo isn't showing

There are **two unrelated "promo" things** in the project, and the admin uploader is wired to the wrong one:

| Where | What it is | Source of content |
|---|---|---|
| `src/storefront/promo.jsx` (`PromoReel`) | The cinematic Watch / Tablet / Duo animated showcase rendered on the home page | **Hardcoded** in JSX |
| `/admin/promos` + `promos` table + `promos` storage bucket | The admin uploader you just used | Database |

The storefront's home page only renders `<PromoReel/>`, which never reads from the `promos` table. So your uploaded banner is saved correctly, marked Active — but **nothing on the storefront ever queries it**, which is why you don't see it.

## Fix

Add a real **PromoBanners** strip on the storefront that reads from the `promos` table and renders the active rows the admin uploads.

Concretely:

1. **New component** `src/storefront/PromoBanners.jsx`
   - Calls `usePromos()` (already exists, already filters `active=true`, ordered by `sort_order`).
   - Renders a horizontal/stacked banner section:
     - One banner: full-width responsive image card.
     - Multiple banners: simple auto-rotating carousel with prev/next dots (same dot style as `PromoReel`) — 6s per slide.
   - Each banner is a clickable `<a>` if `link_url` is set, otherwise a plain image. Title shown as overlay caption only if present.
   - Hides itself completely when there are no active promos (so the page looks unchanged for you until you actually add one).

2. **Wire it into the home page** (`src/storefront/home.jsx`)
   - Insert `<PromoBanners lang={lang}/>` near the top of the home layout, just under the hero slider and above the product grid (this is where merchandising banners belong, and matches the screenshot you shared).
   - Leave the existing `<PromoReel/>` cinematic section in place — it's a different design feature.

3. **Styling**
   - Match existing storefront tokens (`var(--radius-lg)`, `var(--border)`, `var(--bg-2)`).
   - Aspect ratio ~ 16/6 desktop, 16/9 mobile, `object-fit: cover`, rounded corners, subtle shadow.
   - RTL-friendly (the storefront has Arabic mode).

4. **No DB changes needed** — `promos` table, RLS, `usePromos` hook, and the `promos` storage bucket are already in place and working (we just confirmed your upload succeeded).

## After this

- Your existing uploaded banner will appear on the home page immediately.
- Toggling Active off in `/admin/promos` hides it on the storefront.
- Reordering with the up/down arrows changes the carousel order.
- Uploading more banners turns the section into a rotating carousel automatically.

Optional follow-ups (not in this change unless you ask):
- Make the cinematic `PromoReel` data-driven too.
- Add a separate "Position" field (top of home / between sections / footer strip).
