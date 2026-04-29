# Product Detail Pages (PDP) — wire-up plan

Every product in `data.js` already has a name, price, colors and specs. The existing `pdp.jsx` already renders a layout that matches your screenshots (breadcrumb → gallery + info → specs → similar items). Two things are missing:

1. The router shim in `StorefrontApp` ignores `pdp` calls.
2. `pdp.jsx` was never modernized — it still relies on globals (`window.PRODUCT_IMAGES`, `Silhouette`, `Stars`, `Price`, `Icon`, `ProductCard`) and is never exported.

Navigation from Home cards, Promo tiles and hero CTAs already calls `window.navigate('pdp', { id })`, so no changes are needed there.

## What I will build

### 1. Modernize `src/storefront/pdp.jsx`
- Convert to ES modules: `import React from 'react'`, import `Icon`, `Price`, `Stars` from `./atoms.jsx`, `Silhouette`, `ColorDot` from `./silhouettes.jsx`, `ProductCard` from `./home.jsx`, and `PRODUCT_IMAGES` from `./data.js`.
- Replace `window.PRODUCT_IMAGES` lookup with the imported constant.
- Replace `window.navigate(...)` calls with a prop `onNavigate(page, params)` passed from the app.
- `export { PDP }` (and default).
- Layout already matches your screenshots — keep it 1:1 (breadcrumb, large gallery + thumb strip, brand pill, title, tagline, stars, price, stock, color swatches, qty, Buy now / Add to cart, perks, two-card spec grid, "Similar items" row).

### 2. Add a `pdp` route in `StorefrontApp.jsx`
- Add `const [route, setRoute] = useState({ name: 'home', params: {} })`.
- Replace the navigation shim so `'pdp'` and `'home'` both update state (still expose `window.navigate` for in-component links that already use it).
- Render `<PDP product={...} ... />` when `route.name === 'pdp'`, looked up from `CATALOG` by `params.id`. Fallback to Home if id not found.
- Pass `onAddToCart`, a `onBuyNow` (adds to cart + opens cart drawer), `t`, `lang`, and the full `products` list.

### 3. Make every product reachable
- The grid already passes `onOpen(prod) → navigate('pdp', { id: prod.id })`. Every entry in `CATALOG` (20 products: 6 Vikusha tablets, 2 Teclast tablets, 2 watches, 10 accessories) becomes a live PDP automatically — no per-product file needed.
- Real photos from `PRODUCT_IMAGES` are used for `v-70`, `vz-80-plus`, `vz-70`, `vz-60-4g`. Products without photos fall back to the existing `Silhouette` renderer (this is what produces the "tablet shape with brand pill" cards you see for VZ-30 PRO 4G / V-M1 in your last screenshot — that is the intended placeholder until real images are uploaded).
- Breadcrumb links (`Home / Tablets / Vikusha / VZ-80 PLUS`) work via the same router.

### 4. Small fixes while I'm in there
- Ensure `window.scrollTo(0,0)` runs on every route change (already in PDP effect; also do it on route push in the app).
- Keep existing `'home'` filter params (`{cat}`, `{brand}`) functional so breadcrumb links go back to a filtered Home.

## Files touched
- `src/storefront/pdp.jsx` — modernize, add imports/exports, swap globals for props.
- `src/storefront/StorefrontApp.jsx` — add `route` state, render PDP, wire `onBuyNow`.
- No changes to `home.jsx`, `promo.jsx`, `data.js`, or `styles.css`.

## Out of scope (matches earlier "localStorage only" decision)
- Checkout page stays deferred (Buy now opens the cart drawer).
- No new product entries or images are added — the catalog and `/uploads/` set are unchanged.

After approval I'll implement the two file edits and the PDP will be reachable from every card, hero CTA, and promo tile.
