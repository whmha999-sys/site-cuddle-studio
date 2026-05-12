UPDATE public.products SET sort_order = CASE id
  WHEN 'teclast-p50' THEN 1
  WHEN 'teclast-p30t' THEN 2
  WHEN 'teclast-t65' THEN 3
  WHEN 'v-m1' THEN 4
  WHEN 'vz-80-plus' THEN 5
  WHEN 'vz-70' THEN 6
  WHEN 'vz-60-4g' THEN 7
  WHEN 'vz-30-pro-4g' THEN 8
  WHEN 'vn-7-kids' THEN 9
  WHEN 'v-70' THEN 10
  WHEN 'vb-1-4g' THEN 11
  ELSE sort_order
END;
UPDATE public.products SET hero = (id IN ('teclast-p50','teclast-p30t','teclast-t65','v-m1'));