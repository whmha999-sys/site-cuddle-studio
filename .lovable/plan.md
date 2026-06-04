## Goal
Make every product page use the floating spatial showcase (dark hero with rotating rings + clickable thumbnails) instead of the old static gallery — same treatment the P50 currently gets.

## Changes

1. **Rename `p50-showcase.jsx` → `product-showcase.jsx`** and generalize it:
   - Accept `product` as a prop instead of being hardcoded to the P50.
   - Pull images from `PRODUCT_IMAGES[product.id][selectedColor]`, falling back to the first available color if none match.
   - Derive `title` from `product.name`, `eyebrow` from the category label (`t['cat_'+product.category]`), and `description` from `product.tagline` (Arabic/English aware).
   - Build metrics dynamically from `product.specs` — pick up to 4 relevant numeric specs (refresh rate, brightness, battery, RAM, storage, signal) and map each to a Lucide icon. If fewer than 2 numeric specs exist, fall back to showing brand + category chips so the bars area still looks intentional.
   - Keep the rotating accent palette (emerald/indigo/amber/rose) cycling per thumbnail.
   - If the product has no real images in `PRODUCT_IMAGES`, return `null` so the page falls back to the existing silhouette gallery (graceful degradation for products without photos).

2. **`pdp.jsx`**:
   - Replace the `product.id === 'teclast-p50'` guard with a generic `<ProductShowcase product={product} color={color} lang={lang} onViewSpecs={...} />` rendered for every product that has real images.
   - Hide the old `.pdp-gallery` block whenever the showcase renders (same pattern as today, just generalized).
   - Pass the currently selected `color` down so changing color in the buy-box updates the showcase image set.

3. **Color sync** (small UX detail):
   - When the user clicks a thumbnail inside the showcase, it stays within the current color set (no change to color selection).
   - When the user changes color in the buy-box, the showcase swaps to that color's image set and resets to the first image.

## Out of scope
- No new images, no new specs data, no design changes to the showcase itself.
- Products without photos keep their current silhouette gallery — the showcase only replaces the gallery when real images exist.

## Files touched
- `src/storefront/p50-showcase.jsx` → renamed/rewritten as `src/storefront/product-showcase.jsx`
- `src/storefront/pdp.jsx` → swap the P50-specific block for the generic one
