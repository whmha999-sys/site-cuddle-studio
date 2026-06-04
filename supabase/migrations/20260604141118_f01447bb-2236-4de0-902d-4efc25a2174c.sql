
-- Standardize RLS policies to use public.has_role and remove direct insert on orders

-- Drop direct INSERT policy on orders (use place_order RPC only)
DROP POLICY IF EXISTS "Anyone places an order" ON public.orders;

-- Recreate admin policies referencing public.has_role
DROP POLICY IF EXISTS "Admins manage hero settings" ON public.hero_slide_settings;
CREATE POLICY "Admins manage hero settings" ON public.hero_slide_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins delete orders" ON public.orders;
CREATE POLICY "Admins delete orders" ON public.orders
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins update orders" ON public.orders;
CREATE POLICY "Admins update orders" ON public.orders
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins view orders" ON public.orders;
CREATE POLICY "Admins view orders" ON public.orders
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins manage product images" ON public.product_images;
CREATE POLICY "Admins manage product images" ON public.product_images
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins manage products" ON public.products;
CREATE POLICY "Admins manage products" ON public.products
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins view all products" ON public.products;
CREATE POLICY "Admins view all products" ON public.products
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins view all profiles" ON public.profiles;
CREATE POLICY "Admins view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins manage promos" ON public.promos;
CREATE POLICY "Admins manage promos" ON public.promos
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins view all promos" ON public.promos;
CREATE POLICY "Admins view all promos" ON public.promos
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins manage section visibility" ON public.section_visibility;
CREATE POLICY "Admins manage section visibility" ON public.section_visibility
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins view all roles" ON public.user_roles;
CREATE POLICY "Admins view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Ensure anon can still call the order placement RPC
GRANT EXECUTE ON FUNCTION public.place_order(jsonb) TO anon, authenticated;
