CREATE TABLE public.hero_slide_settings (
  slide_id text PRIMARY KEY,
  primary_button_enabled boolean NOT NULL DEFAULT true,
  secondary_button_enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_slide_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone views hero settings"
  ON public.hero_slide_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Admins manage hero settings"
  ON public.hero_slide_settings
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER hero_slide_settings_updated_at
  BEFORE UPDATE ON public.hero_slide_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.hero_slide_settings (slide_id, primary_button_enabled, secondary_button_enabled)
VALUES
  ('v-70', true, true),
  ('vz-30-pro-4g', true, true),
  ('teclast-p50', true, true)
ON CONFLICT (slide_id) DO NOTHING;