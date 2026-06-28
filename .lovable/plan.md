
## Goal
Make the homepage first section (the `LatestCreations` slideshow) look like the teclast.com hero in the reference: full browser width, ultrawide ~21:9 ratio (about 2.4:1), image shown in full with no cropping.

## What teclast.com actually does
- Hero spans **100% of the viewport width** (edge-to-edge, no side padding).
- Height is **~720–780 px on a 1920-wide window** → aspect ratio **≈ 2.4:1 (close to 21:9)**, not 16:9.
- The banner is a single wide image scaled to fill width; height follows naturally. No letterboxing because the image itself is authored at that wide ratio.

## Changes to `src/storefront/LatestCreations.jsx`
1. Replace the current `aspect-ratio: 16 / 9` + `max-height` rules on `.lc-slider` with:
   - `width: 100vw` (already full-bleed)
   - `aspect-ratio: 21 / 9` on desktop (≈2.33:1, matches teclast feel)
   - `aspect-ratio: 16 / 9` on tablet (≤900 px)
   - `aspect-ratio: 4 / 3` on mobile (≤600 px) so banners stay readable on phones
   - Remove the `max-height` caps so it scales with the viewport like teclast.
2. Switch slide images from `object-fit: contain` back to **`object-fit: cover`** with `object-position: center`. The teclast banners (and your uploaded Vikusha/Teclast banners) are authored as full-bleed wide art, so `cover` at a matching ratio shows them fully without visible cropping.
3. Keep existing arrows, dots, autoplay, and click-to-PDP behavior unchanged.

## Out of scope
- No changes to images, ordering, or the rest of the homepage.
- No changes to `promo.jsx`, footer, checkout, or data.
