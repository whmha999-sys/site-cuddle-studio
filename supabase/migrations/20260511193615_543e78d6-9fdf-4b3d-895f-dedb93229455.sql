UPDATE public.product_images
SET url = regexp_replace(url, '\.(png|jpg|jpeg)$', '.webp', 'i')
WHERE url ~* '^/uploads/.*\.(png|jpg|jpeg)$';