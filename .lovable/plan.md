# Fix clipped "J" on left side of promo price

## What's happening

The `J` in `JOD 50` (and the other slides) is getting clipped on its **left** side. Same root cause as the right-side clipping we just fixed: italic glyphs lean past their box on **both** sides — descenders lean left at the bottom, the top of the `J` curls left, and `background-clip: text` cuts whatever falls outside the box.

The previous fix only added breathing room on the right (`padding-inline-end`). The left edge still clips.

## The fix

Mirror the right-side padding on the start side of `.vk-promo-price`:

**`src/storefront/home.jsx`** (price span ~line 647) — add:
- `paddingInlineStart: '0.12em'`
- `marginInlineStart: '-0.04em'` (so layout doesn't visibly shift)

**`src/storefront/styles.css`** (mobile override ~line 881) — add the same two properties with `!important` so they survive the mobile font-size override.

The negative margin offsets the padding so surrounding elements (the strikethrough `JOD 75` and the `-33%` chip) keep their current spacing — only the gradient paint box grows.

## Out of scope

- Changing the font, weight, or italic styling.
- Touching the title gradient (titles have leading whitespace so the `T` in `Time.` doesn't clip).

After approval I'll apply both edits and we can verify on slide 1.
