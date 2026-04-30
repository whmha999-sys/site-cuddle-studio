# Remove duplicate inner scrollbars on mobile (Vikusha + Teclast sections)

## What's happening

On mobile, the Vikusha (watch) and Teclast P50 marketing sections each show their own vertical scrollbar inside the page — so there are **two scrollbars stacked on top of each other**: the main page scrollbar on the right, and a smaller inner one for the section content.

## Root cause

These sections (`src/storefront/vikusha-scroll.jsx`, `src/storefront/teclast-scroll.jsx`, `src/storefront/tablet-scroll.jsx`) use a desktop "scroll-scrubbed video" pattern: the outer `<section>` is `height: 300vh` and the inner `.scroll-scene-sticky` is `position: sticky; height: 100vh; overflow: hidden`.

On mobile, the existing CSS in `src/storefront/styles.css` (around line 809) tries to flatten the layout but does it half-way:
- It sets `.scroll-scene-section { height: auto }` ✅
- But it leaves `.scroll-scene-sticky` with its inline `height: 100vh` + `position: sticky`, and adds `overflow-y: auto !important` — which **forces an inner scroll container** when the stacked content is taller than 100vh. That's the second scrollbar.

## The fix

Rewrite the mobile (`@media (max-width: 768px)`) block for `.scroll-scene-sticky` so it fully surrenders to the main page scroll:

- `position: static` (drop sticky)
- `height: auto`, `max-height: none` (drop the 100vh cap)
- `overflow: visible` (no inner scroll container — kills the second scrollbar)
- Keep the existing `grid-template-columns: 1fr`, padding, and gap so the stacked layout still looks right
- Also reset `.tablet-scene-sticky` (currently `height: 60vh`) the same way so it doesn't introduce its own scroll
- Reset child `> div` to `height: auto` and the video `max-height: none` so nothing inside re-introduces a fixed viewport-height clip

## Files to edit

- `src/storefront/styles.css` — replace the `.scroll-scene-sticky` mobile block (~lines 809–825) with the new flow-with-page rules above.

## Out of scope

- Desktop scroll-scrub behavior stays exactly as-is (still uses 300vh section + sticky 100vh).
- No JS changes needed — `teclast-scroll.jsx` already detects `isMobile` and switches the video to autoplay loop.

After approval I'll apply the edit and the only scrollbar visible on mobile will be the main page one.
