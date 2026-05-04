I checked it directly. The problem is clear: the P200 photos were added to the code fallback, but the live storefront is loading product images from the database and overriding that fallback.

Current database state for `Power Bank P200`:

- Black has only:
  - `/uploads/p200-black-main.png`
  - `/uploads/p200-black-2.png`
- White has only:
  - `/uploads/p200-white-main.png`

That exactly matches your screenshots: black shows 2 thumbnails, white shows 1 thumbnail.

The uploaded product reference images are present in the project files, and they are correctly listed in `src/storefront/data.js`, but they are not in the `product_images` database table. Because `StorefrontApp.jsx` calls `useCatalog()` and then `syncCatalogFromDb(...)`, the database image list replaces the fallback list on the live page.

Plan to fix:

1. Add the missing P200 product gallery photos to the database table `product_images` with the correct `product_id = 'p200'`.
2. Use the correct color mapping:
  - Black:
    - `/uploads/p200-black-main.png`
    - `/uploads/p200-black-2.png`
    - `/uploads/p200-black-views.png`
    - `/uploads/p200-black-sixview.png`
  - White:
    - `/uploads/p200-white-main.png`
    - `/uploads/p200-white-2.png`
    - `/uploads/p200-white-views.png`
    - `/uploads/p200-white-sixview.png`
    - `/uploads/p200-white-angle.png`
3. Keep them as product gallery photos only. No marketing strip section will be added for P200 for now until you are able to upload the main pictures 
4. After approval, I will apply this as a database migration/update so the product page uses the full image gallery immediately.
5. don't repeate the same error again please 