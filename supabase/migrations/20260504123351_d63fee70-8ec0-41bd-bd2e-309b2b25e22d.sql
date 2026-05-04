UPDATE public.products
SET colors = ARRAY['white']::text[], updated_at = now()
WHERE id = 'usb-type-c-66w';