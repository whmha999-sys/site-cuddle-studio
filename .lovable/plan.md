# Port Smart Leaders Storefront into Lovable

Move the uploaded Babel-in-browser React site into this Vite + React project as real ES modules. Visual parity with the upload, no behavioral changes. Only the **Home** route goes live now; cart/auth/lang/theme stay in localStorage.

## What you'll get

- A working `/` route that renders the Smart Leaders home: hero, Vikusha + Teclast brand sections, promos, scroll-driven product scenes, footer.
- Top chrome (nav, cart drawer, language EN/AR with RTL, light/dark theme toggle) wired the same way as the upload, persisted to localStorage.
- All 105 product images from `Smart_Leaders.zip` available to the app.
- Other pages (Vikusha Tablets landing, PDP, Checkout) deferred — nav links to them will be hidden or disabled for now so nothing looks broken.

## Pages & routes

- `/` → Home (full storefront home from `home.jsx` inside chrome from `chrome.jsx`)
- `*` → existing NotFound

Vikusha Tablets standalone, PDP, Checkout: not wired now. Their source files will still be copied into the repo so we can light them up in a follow-up by just adding routes.

## How the port works

1. **Assets** — unzip `Smart_Leaders.zip/uploads/*` into `public/uploads/` so existing paths like `/uploads/foo.png` resolve unchanged. Filenames preserved (including the unicode-escaped ones).
2. **Source files** — copy `atoms.jsx`, `chrome.jsx`, `home.jsx`, `promo.jsx`, `silhouettes.jsx`, `tablet-scroll.jsx`, `teclast-scroll.jsx`, `vikusha-scroll.jsx`, `swipe-scene.jsx`, `data.js` into `src/storefront/`. Also copy `pdp.jsx` and `checkout.jsx` (parked, not imported yet).
3. **Modernize** — for each file:
   - Replace global `React`, `useState`, `useEffect`, `useMemo` reliance with explicit `import` from `react`.
   - Add named `export` to each component / data object.
   - Replace cross-file globals (e.g. `window.SL_DATA`, `Atoms.Button`) with real ES imports.
   - Keep JSX (no TS conversion) — files stay `.jsx`. Vite handles them.
4. **Styles** — append `styles.css` contents into a new `src/storefront/storefront.css`, imported once from the Home page. Fonts (`Inter`, `Instrument Serif`, `JetBrains Mono`, `Noto Kufi Arabic`) added to `index.html` via the same Google Fonts link the upload uses. No changes to Lovable's existing design tokens.
5. **App shell** — replace `src/pages/Index.tsx` body with `<Chrome>{<Home />}</Chrome>`. Chrome owns: route state (collapsed to just 'home'), cart, user, lang, dir, theme — same localStorage keys (`sl_route`, `sl_cart`, `sl_user`, `sl_lang`, `sl_dir`, `sl_theme`) so nothing changes if you reload.
6. **Nav links** — keep visible but route to `/` for now (Vikusha/PDP/Checkout deferred). Cart drawer fully functional client-side.

## Out of scope (deferred, easy follow-ups)

- Vikusha Tablets animated landing as `/vikusha/tablets`
- Product detail pages `/p/:id` driven by `data.js`
- Checkout `/checkout`
- Real backend (auth, orders) — would need Lovable Cloud
- TypeScript conversion of ported components
- Image optimization / responsive `srcset`

## Technical notes

- The upload uses Babel-in-browser + UMD React. Vite already bundles React, so we drop the `<script src="unpkg...">` and `type="text/babel"` tags entirely.
- `data.js` becomes `data.js` with `export const PRODUCTS = ...` (currently attaches to `window`).
- Scroll scenes use `IntersectionObserver` and `requestAnimationFrame` — those work as-is in the bundled environment.
- RTL: when `lang === 'ar'`, Chrome sets `<html dir="rtl">` via a `useEffect`, identical to upload.
- Theme: Chrome toggles a `dark` class on `<html>`. Storefront CSS already targets `html.dark` — left untouched.
- `animations.jsx` (Stage/Timeline/Sprite) is **not** used by the home page in the upload, so it's not copied. We'll bring it in if/when we wire Vikusha Tablets.

## Risk / things I'll verify after the port

- A handful of image filenames in `data.js` use Chinese characters in the source name — confirm they survive the unzip into `public/uploads/` and load. If any 404, I'll rename and update references.
- The upload's `styles.css` may set `body { background: ... }` that conflicts with Tailwind's `bg-background`. Storefront CSS will be scoped under a wrapper class on the Home page so it can't bleed into other routes later.
