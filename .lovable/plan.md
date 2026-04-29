## What's actually broken on mobile

I traced both issues to the same root cause: **layouts hardcoded for desktop with no real mobile fallback**, plus a scroll-math bug that silently kills the animations.

### 1. Laptop & watch animations frozen on phones

`TeclastScroll` (laptop/tablet) and `VikushaScroll` (watch) work by:
1. Measuring `section.offsetHeight - window.innerHeight` → total scrollable distance
2. Dividing scroll progress into `p` (0 → 1)
3. Setting `video.currentTime = p × video.duration`

The mobile CSS at `styles.css:826-841` overrides the section to `height: auto` and the sticky container to `overflow-y: auto`. Result:
- `section.offsetHeight - window.innerHeight` becomes near zero or negative
- `p` clamps to 0 forever, so the video sits on frame 1 — looks "frozen"
- The 560px-wide centre column also overflows, which is why the laptop/watch feel cut off

### 2. First promo slide ("Time. Reimagined.") broken on mobile

`VkPromoSlide` (home.jsx:483) uses its own grid (`1.05fr 1fr`), absolute background layers, and `padding: 0 0 0 56px`. The mobile rule in `styles.css:785` was written for the simpler `HeroSlide` and only forces `grid-template-columns: 1fr`. On VkPromoSlide that:
- Doesn't reset the 56px left padding → text gets cropped
- Doesn't reset the `hero-slide-img` height → the V-70 image area renders at 180px which clips the watch
- The price row (`clamp(48px, 5.2vw, 64px)` × 3 elements) overflows on a 360px viewport because nothing wraps the price/old-price/badge group

## The fix

### A. Make the scroll-scrub animations actually run on mobile

Two options — I recommend **Option 1** because the videos are 5–10 MB and scrubbing them on a phone is heavy anyway:

**Option 1 (recommended): On mobile, swap the scroll-scrub video for autoplay loop.**
In `TeclastScroll` and `VikushaScroll`, detect `window.matchMedia('(max-width: 768px)').matches`. If mobile:
- Remove the sticky/300vh wrapper, render a normal stacked section
- Set `video.autoplay = true; video.loop = true; video.muted = true; video.playsInline = true`
- Show all features at once (no threshold gating)

**Option 2: Keep scroll-scrub but fix the math.**
Recompute progress against the section's natural scroll range and remove the `overflow-y: auto` override, keep `300vh` height on mobile too. Heavier but preserves the effect.

### B. Fix the V-70 promo slide on mobile

Add a mobile-specific override in `styles.css` that targets `VkPromoSlide`'s structure (it has the `.hero-slide-inner` class plus a unique pattern):
- Reset its padding to `24px 18px`
- Force `grid-template-columns: 1fr`, `gap: 18px`
- Cap the title to `clamp(26px, 7vw, 32px)`
- Cap the price to `clamp(36px, 9vw, 44px)` and let the price row wrap properly
- Set the image container to a fixed `height: 220px` with `object-fit: contain`
- Hide or shrink the countdown's day-cell padding so the four cells fit on one row

I'll add a dedicated `.vk-promo-slide` class to VkPromoSlide's root so the mobile rules don't accidentally hit anything else.

### C. While I'm in there

- The "scroll to explore" hint is invisible on mobile when the section collapses — hide it under 768px.
- The hero carousel auto-advance interval (5s) is a bit fast for the dense V-70 slide on mobile; bump to 7s only on the promo slide. (Optional — say if you want this.)

## Files to change

```text
src/storefront/teclast-scroll.jsx   — branch on mobile: simple autoplay layout
src/storefront/vikusha-scroll.jsx   — branch on mobile: simple autoplay layout
src/storefront/home.jsx             — add className="vk-promo-slide" to VkPromoSlide root
src/storefront/styles.css           — new @media (max-width: 768px) block for .vk-promo-slide;
                                       remove the overflow-y:auto override that kills scroll math
                                       (only needed if you pick Option 2 above)
```

No new dependencies, no asset changes.

## What I need from you

Pick the animation strategy:
- **Option 1** (autoplay loop on mobile) — fast, smooth, recommended
- **Option 2** (keep the scroll-scrub on mobile) — preserves the effect but heavier on phones

If you don't pick, I'll go with Option 1.