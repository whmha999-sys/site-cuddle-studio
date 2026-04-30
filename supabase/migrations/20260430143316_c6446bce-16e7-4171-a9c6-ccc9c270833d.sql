ALTER TABLE public.promos
  ADD COLUMN IF NOT EXISTS button_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS button_label text,
  ADD COLUMN IF NOT EXISTS button_url text;