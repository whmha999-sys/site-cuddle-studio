## Goal

Add an optional **call-to-action button** to each promo banner. Each banner in the admin gets:
- a **"Show button" toggle**
- a **button label** field (e.g. "Shop now")
- a **button link** field (URL the button opens)

On the storefront, a slide renders its button **only when its own toggle is on**. Each banner is fully independent — turning the button on/off for banner #1 has no effect on banner #2.

## Database

Add three columns to the `promos` table (migration):

- `button_enabled boolean not null default false`
- `button_label text` (nullable)
- `button_url text` (nullable)

No RLS changes needed — existing policies cover the new columns.

## Admin UI — `src/pages/admin/Promos.tsx`

Inside each promo card, below the existing "Link URL" input, add:

- A `Switch` labeled **"Show button"** bound to `button_enabled`.
- When the switch is **on**, reveal two inputs:
  - **Button label** (placeholder: "Shop now")
  - **Button URL** (placeholder: "https://… or /products")
- Wire all three through the existing `update(id, patch)` helper so changes save immediately.

Layout stays in the same card; no other admin changes.

## Storefront — `src/storefront/PromoBanners.jsx`

Per-slide rendering changes:

1. When `promo.button_enabled && promo.button_label`, render a **CTA button overlay** on that slide (bottom-left area, near the existing caption).
2. The button is an `<a href={promo.button_url || promo.link_url || '#'}>` styled with the storefront's accent tokens (orange pill, matching the "CLAIM YOURS" style from the hero) so it feels native.
3. The whole slide is no longer wrapped in `<a>` when a button is present — instead the slide is a `<div>` and only the button is clickable. This avoids nested-anchor issues and matches the user's intent ("the button" is the action, not the whole banner).
4. If `button_enabled` is **off** for a slide, render exactly as today (image + optional caption, whole slide clickable if `link_url` exists).
5. External URLs (starting with `http`) open in a new tab; internal paths open in same tab.

New CSS additions (appended to the existing injected `pb-styles` block):

- `.pb-cta` — orange pill button, white text, uppercase tracking, hover lift, RTL-safe positioning (use `inset-inline-start` / logical properties so it sits on the correct side in Arabic).
- Mobile: smaller padding, slightly smaller font.

## Types

Update the `Promo` type in `src/hooks/usePromos.ts` to include:

```ts
button_enabled: boolean;
button_label: string | null;
button_url: string | null;
```

No query changes needed (`select("*")` already returns the new columns).

## Out of scope

- No changes to the cinematic `PromoReel` or hero slider.
- No changes to ordering, active toggle, upload flow, or storage buckets — all already working.

## Result

In `/admin/promos` you'll see, per banner:

```text
[ image preview ]
[ title ]
[ link url ]
[ ⚪ Active ]              [ ↑ ↓ 🗑 ]
[ ⚪ Show button ]
   ↳ when on:
   [ Button label ]
   [ Button URL ]
```

On the home page, banner #1 with "Show button" on shows its CTA; banner #2 with it off shows just the image. Toggling is fully independent per banner.
