## Problem

When the site first loads, some product images don't appear. The root cause is a **race condition** in how the catalog data syncs from the database.

Here's what happens:

1. The app renders immediately using **static** `CATALOG` and `PRODUCT_IMAGES` from `data.js` — images show up fine
2. The database query (`useCatalog`) completes and `syncCatalogFromDb` runs
3. `syncCatalogFromDb` **deletes all keys** from `PRODUCT_IMAGES` first, then assigns the DB images
4. React 18 may batch/defer the `forceRerender` state update, so components can briefly read the **empty** `PRODUCT_IMAGES` object during this window — resulting in missing images and SVG silhouette fallbacks rendering instead
5. Additionally, the `useMemo` in `Home` depends on the `products` array reference which never changes (it's always the same `CATALOG` array), so the grid may not fully re-render after the sync

## Fix (2 files)

### 1. `src/storefront/data.js` — safer `syncCatalogFromDb`

Instead of delete-then-assign (which creates a gap), **assign first, then remove stale keys**:

```js
export function syncCatalogFromDb(dbCatalog, dbImages) {
  if (Array.isArray(dbCatalog)) {
    CATALOG.length = 0;
    for (const p of dbCatalog) CATALOG.push(p);
  }
  if (dbImages && typeof dbImages === 'object') {
    // Assign new data FIRST (no gap where images are missing)
    Object.assign(PRODUCT_IMAGES, dbImages);
    // Then remove keys that aren't in the DB set
    for (const k of Object.keys(PRODUCT_IMAGES)) {
      if (!(k in dbImages)) delete PRODUCT_IMAGES[k];
    }
  }
  if (typeof window !== 'undefined') {
    window.CATALOG = CATALOG;
    window.PRODUCT_IMAGES = PRODUCT_IMAGES;
  }
}
```

### 2. `src/storefront/StorefrontApp.jsx` — use a fresh array reference to trigger proper re-renders

Change the `products` prop from the mutated `CATALOG` reference to a fresh copy, so `useMemo` in `Home` properly recalculates:

```jsx
const [catalog, setCatalog] = useState(CATALOG);

useEffect(() => {
  if (dbCat) {
    syncCatalogFromDb(dbCat.catalog, dbCat.images);
    setCatalog([...CATALOG]); // new reference triggers useMemo
  }
}, [dbCat]);
```

Then pass `catalog` instead of `CATALOG` to `Home` and other components.

These two changes eliminate the window where images disappear and ensure the product grid fully re-renders after the database sync.
