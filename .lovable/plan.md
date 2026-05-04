## The Problem

I found exactly what's wrong. Here are straight answers:

### 1. VB-1 4G marketing strip showing on EVERY product

**Root cause**: On line 366 of `pdp.jsx`, the VB-1 4G marketing strip (13 large images + a YouTube video) is **missing its `product.id === 'vb-1-4g'` condition**. It was accidentally stripped when I added the Type-C Cable marketing strip above it. Right now it renders unconditionally on every single product page.

This means every product page loads 13 extra `.webp` images + a YouTube iframe it doesn't need. That's your slowness culprit.

### 2. Is the dashboard causing problems?

**No, the dashboard itself is fine.** The sync logic in `StorefrontApp.jsx` properly fetches catalog data once and merges it with local fallbacks. The real issues were:

- My mistake dropping the VB-1 conditional wrapper (above)
- Earlier filename issues with spaces that caused 404s (already fixed)

The dashboard code is not the source of these problems. No need to delete it.

### 3. Marketing strip audit - all products

I checked every marketing strip condition in `pdp.jsx`. Here's the status:


| Product          | Line    | Condition                         | Status                             |
| ---------------- | ------- | --------------------------------- | ---------------------------------- |
| VZ-80 PLUS       | 174     | `product.id === 'vz-80-plus'`     | OK                                 |
| VZ-70            | 188     | `product.id === 'vz-70'`          | OK                                 |
| VZ-60 4G         | 202     | `product.id === 'vz-60-4g'`       | OK                                 |
| VZ-30 PRO        | 216     | `product.id === 'vz-30-pro-4g'`   | OK                                 |
| V-M1             | 236     | `product.id === 'v-m1'`           | OK                                 |
| VN-7 Kids        | 256     | `product.id === 'vn-7-kids'`      | OK                                 |
| Teclast T65      | 282     | `product.id === 'teclast-t65'`    | OK                                 |
| Teclast P30T     | 296     | `product.id === 'teclast-p30t'`   | OK                                 |
| Teclast P50      | 310     | `product.id === 'teclast-p50'`    | OK                                 |
| V-70             | 324     | `product.id === 'v-70'`           | OK                                 |
| USB Type-C 66W   | 338     | `product.id === 'usb-type-c-66w'` | OK                                 |
| Type-C Cable 66W | 352     | `product.id === 'type-c-66w'`     | OK                                 |
| **VB-1 4G**      | **366** | **MISSING**                       | **BROKEN - shows on ALL products** |


YouTube video section (line 158) is also properly gated to specific product IDs only.

## Fix

One change in `pdp.jsx`:

**Re-wrap the VB-1 4G section** (lines 366-388) with its missing condition:

```jsx
{product.id === 'vb-1-4g' && (
  <section style={{ marginTop: 72, ... }}>
    {['02','04','06','08',...].map(...)}
    <div><!-- YouTube iframe --></div>
  </section>
)}
```

This single fix will:

- Stop the VB-1 images/video from appearing on every product
- Dramatically improve page load speed for all other products
- Restore the correct behavior where each product only shows its own marketing strip  
  
and make a quick check on all the site and see i there is any problems cause we can't have any other errors the dead line is so clos 
  &nbsp;