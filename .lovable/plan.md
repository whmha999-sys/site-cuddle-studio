## Spec updates

Update each product's `specs` object in `src/storefront/data.js` AND the matching row in the `products` table (via the insert tool for data updates). Both sources need to match so the PDP spec table, product cards, and the spatial showcase pill all show the new values.

### Tablets

- **Teclast P50** — `OS: Android 15`, `RAM: 8 + 12 GB`
- **Teclast P30T** — `Display: ... · 60 Hz` (ensure 60 Hz is present so it shows on PDP too, not just card), `RAM: 4 + 8 GB`, `OS: Android 15`
- **V-M1** — `OS: Android 15`, `Battery: 6,000 mAh`
- **Vikusha VZ-70** — `Display: ... · 60 Hz`
- **Vikusha VZ-30 Pro (vz-30-pro-4g)** — `OS: Android 14`, `Battery: 6,580 mAh`

### Power banks

- **P110** — `Capacity: 20,000 mAh` (verify card + PDP both render this)
- **P20** — `Capacity: 10,000 mAh`; add/replace `Output: USB-A + USB-C`
- **P200** — `Capacity: 30,000 mAh` (everywhere: PDP spec table, card, showcase status pill)

## Technical notes

- Spec source of truth in code: `src/storefront/data.js` (drives PDP `generalSpecs`/`detailSpecs` split and the `ProductShowcase` battery pill via `product.specs['Battery'] | 'Capacity']`).
- DB source: `public.products.specs` jsonb — update with the insert tool using `UPDATE ... SET specs = jsonb_set(...)` per product id.
- No UI/component code changes needed; this is data only.
- After edits, verify on PDP for each product that the spec table reflects the new values and the showcase pill (top-right of hero) reads the correct mAh.
