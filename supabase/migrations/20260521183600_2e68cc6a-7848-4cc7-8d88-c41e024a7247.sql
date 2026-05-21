
DROP POLICY IF EXISTS "Admins delete product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete promos" ON storage.objects;
DROP POLICY IF EXISTS "Admins list product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins list promos" ON storage.objects;
DROP POLICY IF EXISTS "Admins update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins update promos" ON storage.objects;
DROP POLICY IF EXISTS "Admins write product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins write promos" ON storage.objects;

CREATE POLICY "Admins delete product-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id='product-images' AND app_private.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete promos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id='promos' AND app_private.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins list product-images" ON storage.objects FOR SELECT TO authenticated USING (bucket_id='product-images' AND app_private.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins list promos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id='promos' AND app_private.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update product-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id='product-images' AND app_private.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update promos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id='promos' AND app_private.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins write product-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='product-images' AND app_private.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins write promos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='promos' AND app_private.has_role(auth.uid(),'admin'));

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
