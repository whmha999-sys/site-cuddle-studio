## Plan: Update VZ-80 PLUS product photos

The 9 uploaded photos clearly split into 3 groups:
- **3 keyboard shots** (tablet docked in keyboard case — front, angled, side)
- **3 blue back views** (straight back, left 45°, right 45°)
- **3 gray back views** (straight back, left 45°, right 45°)

VZ-80 PLUS currently has two colors in the DB: `silver` (used for the blue variant) and `graphite` (gray). I'll replace the existing gallery with these new photos.

### New gallery per color (6 photos each)

**Silver / Blue** (`silver`):
1. `vz80-blue-back.webp` — straight back
2. `vz80-blue-L45.webp` — left 45°
3. `vz80-blue-R45.webp` — right 45°
4. `vz80-keyboard-front.webp`
5. `vz80-keyboard-angle.webp`
6. `vz80-keyboard-side.webp`

**Graphite / Gray** (`graphite`):
1. `vz80-gray-back.webp` — straight back
2. `vz80-gray-L45.webp` — left 45°
3. `vz80-gray-R45.webp` — right 45°
4. `vz80-keyboard-front.webp` (shared)
5. `vz80-keyboard-angle.webp` (shared)
6. `vz80-keyboard-side.webp` (shared)

The keyboard shots are reused for both colors since the tablet inside the case isn't color-specific in the frames.

### Files to change

- Copy the 9 uploads to `public/uploads/` with the names above (PNG, kept as-is — no WebP conversion needed for this small batch unless you want it).
- Update `src/storefront/data.js` → `PRODUCT_IMAGES['vz-80-plus']` arrays for both colors.
- Run a DB migration: delete current `product_images` rows for `vz-80-plus` and insert the new 12 rows (6 per color).

No changes to `pdp.jsx` (gallery auto-renders from the data), no changes to the marketing strip below.

### Question before I build

Want me to keep the keyboard shots shared across both colors as above, or only attach them to one color? Default = shared.