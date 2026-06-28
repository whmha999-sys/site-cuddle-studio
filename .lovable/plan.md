The current "Latest Creations" gallery uses a fixed 520px height with `object-fit: cover`, which is cropping the promotional banner images and making them look mixed up. The plan is to replace it with a clean one-full-width-banner slideshow.

What we'll build:
1. Replace the hover-expand strip with a slideshow that shows one full-width banner at a time.
2. Use a 16:9 aspect ratio for the slide container so the banner images fit without being cropped or stretched.
3. Add a thumbnail navigation strip below the main slide using the same banner images, so users can click to jump to any banner.
4. Keep auto-advance (optional, 5 seconds) plus left/right arrows on the main slide.
5. Preserve the click-to-product behavior on both the main slide and thumbnails.
6. Make it responsive: stack thumbnails and adjust height for mobile.

Files to touch:
- `src/storefront/LatestCreations.jsx` — rebuild the component as a slideshow.
- `src/storefront/styles.css` — add minimal slideshow-specific styles if needed.

After this change, the gallery section will look more like a hero carousel and the banner images will display fully without cropping.