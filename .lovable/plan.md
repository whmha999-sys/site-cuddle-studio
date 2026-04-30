## Problem

Uploading a promo banner fails with toast: **"Upload failed — database error, code: 08P01"**.

Root cause: a previous hardening migration (`20260430132250_*.sql`) ran:

```sql
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role)
  FROM PUBLIC, anon, authenticated;
```

But the storage RLS policies on `storage.objects` (e.g. `Admins write promos`, `Admins list promos`) still call `public.has_role(auth.uid(), 'admin')`. Because the `authenticated` role no longer has EXECUTE on that function, the policy check raises a permission error during the storage insert, which the storage layer surfaces as Postgres error `08P01`.

The same issue affects:
- Uploading product images
- Listing/deleting/updating any storage object that uses these admin policies

It does NOT currently break table RLS because those policies were rewritten to use `app_private.has_role` in the latest migration, but the storage policies were left pointing at `public.has_role`.

## Fix

Single small migration that restores execute access on the role-check functions to `authenticated` (the function is `SECURITY DEFINER` + `STABLE`, so it only ever returns a boolean from `user_roles` — safe to expose):

```sql
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role)
  TO authenticated;

GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role)
  TO authenticated;
```

That immediately unblocks:
- Promo image upload (`storage.objects` INSERT policy on bucket `promos`)
- Product image upload (same pattern, bucket `product-images`)
- Admin list/delete/update on those buckets

No frontend changes needed. After the migration runs, retry "Upload promo" and it should succeed and appear in the grid.

## Why not rewrite the storage policies to use `app_private.has_role`?

We could, but:
1. It's more churn for the same effect.
2. `public.has_role` is the function the auto-generated types and other policies still expect.
3. Granting EXECUTE on a STABLE SECURITY DEFINER boolean check is the standard Supabase pattern and is safe.

If you'd prefer, I can also rewrite all storage policies to call `app_private.has_role` instead — let me know, otherwise I'll proceed with the GRANT-only fix above.
