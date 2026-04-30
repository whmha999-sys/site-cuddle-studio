DROP POLICY IF EXISTS "Admins delete orders" ON public.orders;
DROP POLICY IF EXISTS "Admins update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins view orders" ON public.orders;
DROP POLICY IF EXISTS "Admins manage product images" ON public.product_images;
DROP POLICY IF EXISTS "Admins manage products" ON public.products;
DROP POLICY IF EXISTS "Admins view all products" ON public.products;
DROP POLICY IF EXISTS "Admins view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins manage promos" ON public.promos;
DROP POLICY IF EXISTS "Admins view all promos" ON public.promos;
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins view all roles" ON public.user_roles;

CREATE POLICY "Admins view orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins delete orders"
ON public.orders
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins manage product images"
ON public.product_images
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins manage products"
ON public.products
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins view all products"
ON public.products
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins manage promos"
ON public.promos
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins view all promos"
ON public.promos
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;