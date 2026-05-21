Make the promo banner section much shorter (shallower height), like the thin Kingston IronKey strip in the reference image.

## Change

In `src/storefront/PromoBanners.jsx`:

- Increase `.pb-section` `max-width` from `900px` → `1200px` (wider, more strip-like).
- Change `.pb-frame` `aspect-ratio` from `16 / 9` → `1200 / 200` (≈ 6:1), giving a short banner roughly 200px tall at full width.
- Match the mobile override: change `.pb-frame` aspect-ratio in the `@media (max-width: 768px)` block to the same `1200 / 200` (or `6 / 1`), and slightly reduce caption/CTA bottom offsets so they still fit.
- Keep `object-fit: cover` so 16:9 uploaded images crop cleanly to the strip.

No other files change.

## Note on uploaded images

Since images are 16:9 and the frame becomes ~6:1, the top and bottom of each image will be cropped. If you'd rather see the full image with no cropping, we'd need to either re-upload strip-shaped artwork or switch `object-fit` to `contain` (which would letterbox).