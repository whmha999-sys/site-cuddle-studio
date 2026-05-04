## Add P200 Product Gallery Photos

### What
Add 3 new product reference images to the Power Bank P200 gallery (thumbnails + main image area). These are NOT marketing strips.

### Steps

1. **Copy images to project**
   - `user-uploads://six_view_White_01-2.png` → `public/uploads/p200-white-sixview.png`
   - `user-uploads://Z2_White_01_1-2.png` → `public/uploads/p200-white-angle.png`
   - `user-uploads://six_view_Black_01-2.png` → `public/uploads/p200-black-sixview.png`

2. **Update `src/storefront/data.js`** — add the new images to `PRODUCT_IMAGES.p200`:
   - `black` array: append `p200-black-sixview.png`
   - `white` array: append `p200-white-sixview.png` and `p200-white-angle.png`

No changes to `pdp.jsx` needed — the gallery already renders all images from the array automatically.
