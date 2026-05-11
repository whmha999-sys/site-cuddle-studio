## Why the site is slow

Your `public/uploads/` folder is **277 MB across 457 files**, with:

- **72 images larger than 1 MB** (many PNGs are 2–5 MB each — e.g. `vz70-graphite-main.png` is 4.6 MB, `teclast-p50-*.png` are 2–3 MB each)
- **23 MB of MP4 videos** (P110 + P20 marketing videos at 5–6 MB each set to autoplay)
- Product cards, marketing strips, and PDP galleries all load these full-size PNGs directly with no compression, no responsive sizing, and no modern formats (WebP/AVIF)

Every visitor downloads tens of MB just to view one product page. On the home grid (21 products), the browser pulls dozens of multi-MB PNGs at once. That is the main cause — not code logic, not the database.

A secondary factor: the P110 and P20 marketing videos use `autoPlay` and start downloading immediately even before the user scrolls to them.

## Fix plan

### 1. Convert and compress all upload images
- Convert every PNG/JPG in `public/uploads/` to **WebP** at quality ~80
- Resize anything wider than **1600 px** down to 1600 px (product mains) or **900 px** (marketing strip images, since they already render at `maxWidth: 900`)
- Expected result: **~277 MB → ~25–40 MB** (roughly 85–90% smaller), with no visible quality loss
- Update the references in `src/storefront/data.js` and the marketing-strip blocks in `src/storefront/pdp.jsx` to point at the new `.webp` filenames

### 2. Add native lazy-loading + decoding hints to product images
- Add `loading="lazy"` and `decoding="async"` to the gallery `<img>` tags in `src/storefront/pdp.jsx` and the product card images in `src/storefront/home.jsx` (marketing-strip images already have `loading="lazy"`; the main gallery and card images do not)

### 3. Defer the marketing videos
- Add `preload="none"` and a `poster` image to the P110 and P20 `<video>` tags so they don't download 5–6 MB upfront
- Keep `autoPlay muted loop playsInline` so they still play when scrolled into view (combined with `preload="none"` the browser will only fetch when needed)

### 4. Optional cleanup
- Many uploads have duplicates (e.g. `VIKUSHA Tablet V-Z70 main.png` and `vz70-graphite-main.png` are both 4.6 MB and look like the same asset). Removing unreferenced duplicates can drop another 30–50 MB

### Technical notes
- Conversion can be done with a single `sharp` or `cwebp` script run over `public/uploads/`
- I'll keep the original filenames mapped to new `.webp` versions and rewrite the references in `data.js` + `pdp.jsx` in one pass
- No backend, schema, or business-logic changes needed — this is purely an asset/frontend optimization

### Out of scope
- Switching to a CDN or to Supabase Storage (the current public-folder approach stays)
- Restructuring the product data model
- Refactoring the React components beyond the image/video tag changes above
