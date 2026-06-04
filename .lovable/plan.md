## Goal
Show the available product colors on each `ProductShowcaseCard` (used on home page and PDP "similar items"), like the old `ProductCard` did.

## Changes

1. **`src/components/ui/product-showcase-card.tsx`**
   - Extend `ShowcaseCardProduct` with an optional `colors?: string[]` (array of color names like `"black"`, `"mint"`, etc.).
   - Add an optional `onColorSelect?: (color: string) => void` prop and an optional `selectedColor?: string`.
   - Render a small row of color dots between the product name/rating area and the price (only when `colors.length > 0`). Each dot:
     - 18px circle, 1px border, ring/scale when selected.
     - Background mapped from a small name → hex map (black, white, gray, silver, blue, navy, mint, teal, green, red, pink, purple, gold, beige, brown). Unknown names fall back to a neutral gray.
     - Click stops propagation and calls `onColorSelect`.

2. **`src/storefront/home.jsx`** (around line 1141, the `ProductShowcaseCard` usage)
   - Pass `colors: p.colors` into the `product` prop.
   - Track selected color per card via a small local state (or use `firstColor` and let the user override). Simplest: lift to a `colorByProduct` state map at the grid level.
   - When color changes, update the displayed `image` to `PRODUCT_IMAGES[p.id][selectedColor][0]` and use that color for `onAddToCart`.

3. **`src/storefront/pdp.jsx`** (similar items block)
   - Same treatment as home: track selected color per similar product, update image + add-to-cart color accordingly.

## Out of scope
- No changes to the PDP main color picker or showcase.
- No new color data; uses the existing `product.colors` already in catalog.
- No design overhaul of the card — only an added swatch row.
