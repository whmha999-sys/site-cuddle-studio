## Problem

In `src/storefront/LatestCreations.jsx`:
- `.lc-stage` and `.lc-thumb` use `background: #111` (near‑black).
- At `aspect-ratio: 4 / 3` on a full‑width 1400px container, the stage becomes ~1050px tall.
- With `object-fit: contain`, any image that doesn't perfectly fill leaves the dark background visible — and while images load, the entire box is solid black.

That's the "black" you're seeing.

## Fix

Update `src/storefront/LatestCreations.jsx`:

1. Change `.lc-stage` background from `#111` to `transparent` (or `var(--background)`) so empty space matches the page.
2. Change `.lc-thumb` background the same way.
3. Cap the stage size so it's not a giant block:
   - Add `max-height: 560px` to `.lc-stage` (and `max-height: 360px` on mobile).
   - Keep `aspect-ratio: 4 / 3` for shape, but height won't exceed the cap.
4. Keep the Cover/Contain toggle and 4:3 thumbnails as they are.

## Result

The slideshow blends into the page background instead of showing a black wall, and the section stays a reasonable height on large screens.
