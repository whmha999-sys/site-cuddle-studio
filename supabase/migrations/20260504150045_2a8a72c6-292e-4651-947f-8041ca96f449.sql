UPDATE public.products
SET colors = ARRAY['black']::text[]
WHERE id = 'p110';