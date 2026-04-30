CREATE SCHEMA IF NOT EXISTS app_private;

CREATE OR REPLACE FUNCTION app_private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

REVOKE ALL ON SCHEMA app_private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA app_private TO authenticated;
REVOKE ALL ON FUNCTION app_private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) TO authenticated;

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
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins delete orders"
ON public.orders
FOR DELETE
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage product images"
ON public.product_images
FOR ALL
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage products"
ON public.products
FOR ALL
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins view all products"
ON public.products
FOR SELECT
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage promos"
ON public.promos
FOR ALL
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins view all promos"
ON public.promos
FOR SELECT
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));