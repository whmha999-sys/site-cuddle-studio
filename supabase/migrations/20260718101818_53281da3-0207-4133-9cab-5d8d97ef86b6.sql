UPDATE public.products 
SET specs = jsonb_set(specs, '{RAM}', '"12 + 8 GB"')
WHERE id = 'teclast-p50';