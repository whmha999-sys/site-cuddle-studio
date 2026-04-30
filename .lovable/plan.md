# Fix the cinematic Promo Reel on mobile (the "Your wrist Alive" section)

## My honest take: keep it, but rebuild it for mobile

This `PromoReel` (`src/storefront/promo.jsx`) is one of the strongest brand moments on the site — the cinematic watch / tablet / "the kit" scenes with floating spec badges and the gold accent. **Don't remove it.** What's broken is purely the mobile layout, not the idea.

### What's wrong (visible in your screenshot)

The section is one fixed-height stage (`height: 480`) with everything **absolutely positioned in % coordinates** designed for a 16:9 desktop viewport:

- Watch image is centered, 340px tall
- Left text column: `position:absolute; left:8%; top:50%`
- Right badges column: `position:absolute; right:7%; top:50%`

On a 360–390px phone, all three layers collide on top of the watch:
- "Your wrist Alive" sits **on** the watch face
- The 4 badges (AMOLED, BATTERY, WATER, SENSORS) overlap the watch's right edge
- "1.43″ AMOLED · NFC · Heart rate · IP67" wraps into the dial
- Price `JOD 50` is half-eaten by the strap

There are zero `@media` rules for this section, which is why the previous mobile work didn't touch it.

## The fix — responsive scene layout

Add a mobile breakpoint (≤ 768px) that converts each scene from "absolute overlay" to a **vertical stack** inside the same section, while keeping the desktop cinematic look 100% unchanged.

### Per-scene mobile layout

```text
┌────────────────────────────┐
│  VIKUSHA V70               │  ← eyebrow
│  Your wrist                │  ← title
│  Alive.                    │
│  ─────                     │
│  1.43″ AMOLED · NFC …      │  ← sub
│  JOD 50                    │  ← price
├────────────────────────────┤
│                            │
│         🕒  watch          │  ← image, centered, ~220px
│                            │
├────────────────────────────┤
│  AMOLED  ·  1.43″          │  ← badges as a 2×2 grid
│  BATTERY ·  300 mAh        │     (or horizontal scroll row)
│  WATER   ·  IP67           │
│  SENSORS ·  SpO2 · HR      │
└────────────────────────────┘
```

Same idea for `SceneTablet` and `SceneDuo`.

### Changes

1. **`src/storefront/promo.jsx`** — small structural changes only:
   - Wrap each absolute child with a class so CSS can re-layout it: add `className="promo-scene"` to the scene root, `promo-scene-image`, `promo-scene-text`, `promo-scene-badges` to the three layers in `SceneWatch`/`SceneTablet`/`SceneDuo`.
   - Reduce inline `height: 340/320` on images to `height: clamp(180px, 38vw, 340px)` so they shrink naturally.
   - Reduce inline title `fontSize: 42` → `clamp(26px, 6vw, 42px)`.
   - Make the section height responsive: `style={{ height: 'auto', minHeight: 480 }}` and let CSS set a taller min-height on mobile (or `auto`).

2. **`src/storefront/promo.jsx`** styles block (`promoStyles` template at top) — append a `@media (max-width: 768px)` rule:
   ```css
   .promo-section { min-height: auto; height: auto !important; padding: 24px 16px 56px; margin-top: 32px; }
   .promo-scene { position: relative !important; inset: auto !important;
     display: flex !important; flex-direction: column;
     align-items: stretch !important; gap: 18px;
     opacity: 1; }                  /* visibility now driven by display */
   .promo-scene-text,
   .promo-scene-image,
   .promo-scene-badges {
     position: static !important; transform: none !important;
     left: auto !important; right: auto !important; top: auto !important;
     max-width: none !important; text-align: start !important;
   }
   .promo-scene-image img { height: clamp(180px, 46vw, 240px) !important; margin: 0 auto; display: block; }
   .promo-scene-badges { display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 8px; }
   .promo-scene-badges > div { text-align: start !important; }
   .promo-section svg { display: none; }   /* hide grid/dot SVGs on mobile, they look noisy at small size */
   ```
   - Also gate the **non-active** scenes with `display: none` on mobile so stacking 3 scenes doesn't blow up the page height. Easiest: pass `visible` into `className` (`promo-scene ${visible?'is-visible':''}`) and add `.promo-scene:not(.is-visible){ display:none; }` inside the mobile media query only.

3. **Animations stay on** — the keyframes don't conflict with the static layout, but disable the `transform`-based `promo-float-watch` rotation on mobile to avoid weird tilt in the stacked card:
   ```css
   @media (max-width: 768px) {
     .promo-scene-image, .promo-scene-image > * { animation: none !important; }
   }
   ```
   Words still fade in via `WordReveal`.

### Optional polish (low risk, big gain)

- On mobile, change the section background from a hard rectangle to a soft inset card by adding `border: 1px solid rgba(255,255,255,0.06)` and a subtle inner gradient — matches the rest of the mobile cards.
- Move the scene-label ("WATCH · 1/3") from `top:16; right:20` to centered under the dots on mobile so it doesn't fight the eyebrow.

## Files to edit

- `src/storefront/promo.jsx` — add classnames to existing divs, soften inline sizes, append mobile CSS to the `promoStyles` string.

That's the only file. Desktop look is preserved — all overrides live behind `@media (max-width: 768px)`.

After approval I'll apply the edits and you'll see: text → image → badges, vertically stacked, nothing overlapping, the cinematic feel preserved.
