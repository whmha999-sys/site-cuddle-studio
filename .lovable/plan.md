## Goal
On hover over any product card image, auto-cycle through that product's photos (slideshow). On mouse leave, snap back to the main image.

## Changes

**`src/storefront/home.jsx` — `ProductCard` component (lines 904-950)**

1. Add state `imgIndex` (default `0`) and a ref for the interval timer.
2. Read the current color's image array from `PRODUCT_IMAGES[p.id]?.[color]` (import added).
3. On `onMouseEnter` of `.card-img`: if the array has >1 image, start a `setInterval` (~700ms) that increments `imgIndex` modulo array length.
4. On `onMouseLeave`: clear the interval and reset `imgIndex` to `0`.
5. Reset `imgIndex` to `0` and clear interval whenever `color` changes (so swapping colors doesn't leave a stale index).
6. Cleanup interval on unmount.
7. Pass `imgIndex` to the existing `<Silhouette … imgIndex={imgIndex} />` (the prop is already supported — no Silhouette changes needed).

## Polish
- Add a short CSS transition on the `.card-img img` (opacity ~150ms) in `src/storefront/styles.css` so the swap feels like a soft cross-fade instead of a hard cut.
- Keep cycle interval at 700ms; loops indefinitely while hovered.

## Out of scope
- No PDP changes.
- No data/schema changes.
- Color swatches and Add-to-cart behavior unchanged.