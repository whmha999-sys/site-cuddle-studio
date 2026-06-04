## Goal
Make the "Similar items / منتجات مشابهة" section on the product detail page use the same new `ProductShowcaseCard` style already used on the home page, instead of the old `ProductCard`.

## Changes

**`src/storefront/pdp.jsx`** — replace the `ProductCard` block inside the `similar` section (lines ~149–156) with `ProductShowcaseCard`, mirroring the exact usage from `home.jsx`:

- For each `p` in `similar`, compute:
  - `firstColor = p.colors?.[0]`
  - `image = (PRODUCT_IMAGES?.[p.id]?.[firstColor] || [])[0] || ''`
  - `seed`-based `rating` (4.2–4.8) and `reviews` (40–300) using the same formula as home.jsx so cards look identical
- Render `<ProductShowcaseCard>` with:
  - `product`: `{ id, name, category: t['cat_'+p.category], price, image, rating, reviews, inStock: true, currency: 'JOD ' }`
  - Localized labels: `addToCartLabel={t.add_to_cart}`, `outOfStockLabel`, `reviewsLabel`, `inStockLabel` (ar/en)
  - `onAddToCart={() => onAddToCart(p, firstColor, 1)}`
  - `onCardClick={() => nav('pdp', { id: p.id })}`
- Remove the now-unused `ProductCard` import from `./home.jsx` (keep `ProductShowcaseCard` import which already exists).

## Out of scope
- No changes to home page, no styling tweaks, no new images, no data changes.
- The PDP's main gallery / showcase stays as-is.
