## Problem

Product images for some items (like VZ-80 PLUS and VZ-70) don't appear on initial page load. The root cause: `Silhouette` reads `PRODUCT_IMAGES` directly from a module-level global. When `syncCatalogFromDb` mutates this object, React has no way to know it changed — the `Silhouette` components that already rendered with empty/stale data never re-render.

The previous fix (fresh `catalog` array reference) only helps `useMemo` in `Home` recalculate the *product list*, but `Silhouette` still reads images from the same global object reference without triggering a re-render.

## Fix

Add an **image version counter** that increments whenever `syncCatalogFromDb` runs, and pass it through to `Silhouette` so React knows to re-render image components.

### Changes

**1. `src/storefront/data.js`** — Export a mutable version counter that increments on each sync:
```js
export let imageVersion = 0;
// Inside syncCatalogFromDb, after updating PRODUCT_IMAGES:
imageVersion++;
```

**2. `src/storefront/StorefrontApp.jsx`** — Track image version in state and pass it down:
```js
import { imageVersion } from './data.js';
// After syncCatalogFromDb call:
setImgVersion(imageVersion);
```
Pass `imgVersion` to `Home` as a prop.

**3. `src/storefront/home.jsx`** — Pass `imgVersion` through `ProductCard` to `Silhouette`:
```jsx
<Silhouette product={p} color={color} key={color + imgVersion} />
```
Using `key` forces React to remount the component when images change.

**4. `src/storefront/silhouettes.jsx`** — No logic change needed; the `key` change in the parent handles re-rendering.

This ensures that once DB images load, every product card re-renders with the correct photos.
