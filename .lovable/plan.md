# Compact mobile header — single-line layout

## What's wrong now

On mobile the header stacks into 3 rows: a giant 96px logo, a full-width search bar, then the Cart + العربية buttons on a third row. It eats the entire first screen before any content shows.

## My recommendation: do BOTH — one tight row + a hamburger for nav

A pure hamburger that hides search hurts a storefront (search is the #1 mobile action). But search shouldn't dominate the viewport either. Best pattern for a shop on mobile:

```text
[logo] [────── search ──────] [🛒] [☰]
```

- Logo: shrunk to ~40px, just the seal
- Search: flex-1, slim 36px pill, placeholder shortened
- Cart: icon-only with the count badge (no "Cart" word)
- Hamburger (☰): opens a slide-in drawer containing Tablets / Watches / Accessories + the language toggle (العربية)/ contact us 

This keeps the most-used controls (search + cart) one tap away and tucks secondary nav + language into a single, expected mobile pattern. Total header height drops from ~260px to ~56px.

If you'd rather skip the drawer for now, I can do **just the one-line compaction** (logo + search + cart + globe icon, all icon-sized) — say the word.

## Plan (assuming the recommended both-in-one)

### 1. `src/storefront/chrome.jsx` — Header

- Add `mobileNavOpen` state.
- Add a hamburger `<button className="icon-btn mobile-only">` to `.header-right`, after cart.
- Reduce cart button to icon-only on mobile (wrap the "Cart" word in a `<span className="hide-on-mobile">`).
- Hide the standalone language `icon-btn` on mobile (move it into the drawer).
- Add a `<MobileNav>` slide-in drawer (right side, full-height, ~280px wide) rendered when `mobileNavOpen`. Contents:
  - Tablets, Watches, Accessories, Brands links → call existing `window.navigate(...)`
  - Language: العربية toggle row
  - Close button + scrim that closes on click

### 2. `src/storefront/atoms.jsx` — Logo

- Wrap the `<img>` so its height is responsive: `height: clamp(36px, 8vw, 96px)`. Same SVG, just smaller on phones, unchanged on desktop.

### 3. `src/storefront/styles.css` — mobile (`@media (max-width: 768px)`) block (~line 770)

Replace the current 3-row stack with a single flex row:

```css
.header-inner {
  grid-template-columns: auto 1fr auto !important;
  gap: 8px !important;
  padding: 8px 12px !important;
}
.nav-search { width: 100% !important; max-width: none; min-width: 0; margin-inline-start: 0 !important; }
.nav-search input { height: 36px; padding: 0 12px 0 36px; font-size: 13px; }
.nav-search .search-icon { left: 12px; }

.header-right { gap: 2px; }
.icon-btn { padding: 8px; gap: 0; }       /* icon-only buttons */
.icon-btn .hide-on-mobile { display: none; }
.icon-btn-lang-desktop { display: none; }   /* hide globe button on mobile, lives in drawer */
```

Plus styles for the new `.mobile-nav-drawer`, `.mobile-nav-scrim`, `.mobile-nav-link`, and a `.mobile-only`/`.desktop-only` utility pair.

Shorten the search placeholder for mobile by passing a shorter string when `window.matchMedia('(max-width:768px)').matches`, or simpler: rely on the input's natural truncation (placeholder gets cut by the input's width — acceptable).

## Out of scope

- Promo bar (already wraps fine).
- Desktop layout — completely unchanged.

After approval I'll apply the three file edits.