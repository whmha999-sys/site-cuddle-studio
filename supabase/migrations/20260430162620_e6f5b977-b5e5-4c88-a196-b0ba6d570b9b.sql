CREATE TABLE public.section_visibility (
  section_key text PRIMARY KEY,
  visible boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.section_visibility ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone views section visibility"
ON public.section_visibility
FOR SELECT
USING (true);

CREATE POLICY "Admins manage section visibility"
ON public.section_visibility
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.section_visibility (section_key, visible) VALUES
  ('hero', true),
  ('promo_banners', true)
ON CONFLICT (section_key) DO NOTHING;