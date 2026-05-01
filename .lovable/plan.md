
## Fix Lifestyle Banner layout

Move the text overlay from the center to the **left side** of the banner, so the Vikusha watch photo on the right stays fully visible and unobstructed.

### Changes (single file: `src/storefront/home.jsx`)

1. **Gradient overlay**: Change from centered 135deg gradient to a left-to-right gradient that only darkens the left ~40% of the image (flipped for Arabic RTL).
2. **Text container**: Align to `flex-start` (left) instead of `center`, with generous left padding. For Arabic, flip to right side.
3. **Text alignment**: Change from `center` to `left` (or `right` for Arabic).

The watch photo on the right half will be completely clear with no overlay blocking it.
