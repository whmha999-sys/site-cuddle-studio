# Fix clipped price text in promo hero

## What you're seeing

On slides 2 and 3 (VZ-30 → `JOD 120`, Teclast P50 → `JOD 135`), the right edge of the last digit is sliced off — the "0" looks like a "C" and the "5" looks chopped. Slide 1 (`JOD 50`) doesn't show it because the "0" is rounder and any clipping is invisible.

## Why it happens

The price uses three things together:

1. A heavy **italic serif** (`var(--font-display)`) — italic glyphs visually lean past their advance-width box on the right.
2. A **gradient fill** via `background-clip: text` + `-webkit-text-fill-color: transparent`.
3. Negative letter-spacing (`-0.03em`) and `line-height: 1`.

WebKit/Blink clips the gradient to the element's content box, not to the ink (visible glyph) box. When italic glyphs spill past their advance, the gradient stops where the box ends, so the rightmost slanted edge of the last character renders as transparent — looking "cut off." This is a known browser rendering quirk with italic + `background-clip: text`, not a layout/overflow problem.

It's also why `flex` baseline alignment doesn't help: the box itself is the wrong width for italic ink.

## The fix

Two small, targeted changes to the `.vk-promo-price` span (in `src/storefront/home.jsx` around line 647 and `src/storefront/styles.css` around line 881):

1. **Extend the paint box past the italic slant.** Add `padding-inline-end: 0.18em` and a matching negative `margin-inline-end: -0.05em` so the gradient has room to render the leaning glyph edge without pushing surrounding layout (countdown chip, discount pill).
2. **Stop the parent from clipping it.** Ensure the price's flex parent uses `overflow: visible` (it should already, but lock it in) and remove `lineHeight: 1` in favor of `line-height: 1.05` — `line-height: 1` is the other common cause of italic descender/ascender clipping on big serif sizes.

Optional extra polish: add `display: inline-block` to `.vk-promo-price` so padding actually applies (inline elements ignore vertical padding for layout, but `inline-block` makes the gradient box behave predictably).

Apply the same overrides inside the mobile media query (≤768px) where the price is re-sized to `clamp(36px, 11vw, 52px)`, since the clipping is even more visible at large mobile sizes.

## Files to edit

- `src/storefront/home.jsx` — update the `.vk-promo-price` inline style (lines ~647-654): add `display:'inline-block'`, `paddingInlineEnd:'0.18em'`, `marginInlineEnd:'-0.05em'`, change `lineHeight:1` → `lineHeight:1.05`.
- `src/storefront/styles.css` — in the `@media (max-width: 768px)` block (lines ~881-883), reinforce the same `padding-inline-end` and `display: inline-block` so the mobile font-size override doesn't strip them.

## Out of scope

- Switching to a non-italic price (would change the editorial look).
- Replacing the gradient with a solid color (would lose the brand accent treatment).
- Touching the title gradient — titles have natural trailing whitespace so they don't clip.

After approval I'll implement and verify visually at desktop (1440px) and mobile (414px) widths.
