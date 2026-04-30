
-- Fix function search_path on remaining functions
ALTER FUNCTION public.set_updated_at() SET search_path = public;

-- Lock down SECURITY DEFINER functions: only the database itself should invoke them
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Restrict bucket listing: replace broad SELECT with per-object access only via known URL.
-- Public buckets still serve files via /object/public/<bucket>/<path>; we just disallow LIST.
DROP POLICY IF EXISTS "Public read product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read promos" ON storage.objects;

CREATE POLICY "Admins list product-images" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins list promos" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'promos' AND public.has_role(auth.uid(), 'admin'));

-- Tighten orders insert: require non-empty customer fields and items
DROP POLICY IF EXISTS "Anyone places an order" ON public.orders;
CREATE POLICY "Anyone places an order" ON public.orders
  FOR INSERT
  WITH CHECK (
    length(customer_first) > 0
    AND length(customer_last) > 0
    AND length(customer_email) > 0
    AND length(customer_mobile) > 0
    AND length(customer_address) > 0
    AND jsonb_array_length(items) > 0
    AND total >= 0
  );
