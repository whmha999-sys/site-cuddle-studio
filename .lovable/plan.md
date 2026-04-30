# Fix the promo reel on mobile — each product appears only once

## What's actually wrong (from your screenshot)

You're seeing the watch twice and a tablet rendered into the same scroll, mashed together. Here's why:

The reel has **3 scenes** that auto-cycle: `Watch → Tablet → Duo`. The "Duo" scene by design contains BOTH the watch image AND the tablet image stacked together (it's the "Smart Leader's Kit" pairing).

On desktop that works because the Duo lays them side-by-side as one composed shot. On mobile, my last pass forced everything to stack vertically — so Duo became: watch image + tablet image + CTA, one under the other. Combined with the cycle, you end up seeing:

- Watch scene → one watch
- Tablet scene → one tablet  
- **Duo scene → another watch + another tablet stacked** ← this is the duplicate you're seeing

So the watch effectively shows twice and the tablet twice across the cycle, in a confusing order.

## The fix — kill the Duo scene on mobile only

Mobile gets a clean **2-scene cycle**: Watch, then Tablet. Each product appears exactly once, ever. The "Smart Leader's Kit" Duo stays on desktop where it actually composes nicely.

```text
Mobile cycle:
  ┌───────────────┐      ┌───────────────┐
  │  Watch scene  │  →   │  Tablet scene │  →  loop
  │  (one watch)  │      │  (one tablet) │
  └───────────────┘      └───────────────┘

Desktop cycle (unchanged):
  Watch → Tablet → Duo (kit) → loop
```

## Changes — one file only: `src/storefront/promo.jsx`

1. **Detect mobile** in `PromoReel` with a small `useEffect` listening to `window.matchMedia('(max-width: 768px)')`. Store `isMobile` in state.

2. **Skip the Duo scene on mobile**:
   - Build the scene list dynamically:  
     `const SCENES = isMobile ? ['watch','tablet'] : ['watch','tablet','duo']`
   - Use matching durations array.
   - Conditionally render `<SceneDuo />` only when `!isMobile`.
   - Adjust the dots/label to reflect 2 scenes on mobile (so it shows `1/2`, `2/2`, no "The Kit" label).

3. **Clamp the section height on mobile** so the empty stage doesn't leave a tall black box:
   - Change inline `height: 480` to `height: isMobile ? 'auto' : 480, minHeight: isMobile ? 420 : undefined`.
   - The existing `.promo-section { height: auto !important }` mobile CSS already handles overrides; this just makes the React side honest too.

4. **Remove the duo-specific mobile CSS** (`.promo-scene-duo` rules) since Duo no longer renders on mobile — keeps the stylesheet clean. Not strictly required, but tidier.

5. **Keep everything else from the previous pass**: vertical stack for Watch and Tablet scenes, 2×2 badge grid, image clamp, hidden grid SVGs, no float animation on mobile. Those parts work — the only real bug was Duo doubling the products.

## Result

- Mobile: see the watch, then see the tablet, then loop. No duplicates, no overlap, no second watch sneaking in below.
- Desktop: 100% unchanged — full cinematic 3-scene reel including the Duo "Kit" finale.

After approval I'll apply this single-file change.
