
-- Allow anon and authenticated to call an RPC that inserts an order and returns id + order_number.
CREATE OR REPLACE FUNCTION public.place_order(payload jsonb)
RETURNS TABLE (id uuid, order_number bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
  new_num bigint;
BEGIN
  -- Basic validation
  IF coalesce(length(payload->>'customer_first'),0) = 0
     OR coalesce(length(payload->>'customer_last'),0) = 0
     OR coalesce(length(payload->>'customer_email'),0) = 0
     OR coalesce(length(payload->>'customer_mobile'),0) = 0
     OR coalesce(length(payload->>'customer_address'),0) = 0
     OR coalesce(jsonb_array_length(payload->'items'),0) = 0
     OR coalesce((payload->>'total')::numeric, -1) < 0 THEN
    RAISE EXCEPTION 'Invalid order payload';
  END IF;

  INSERT INTO public.orders (
    customer_first, customer_last, customer_email, customer_mobile,
    customer_address, customer_city, customer_zip,
    items, subtotal, tax, shipping, discount, total,
    currency, exchange_rate, payment_method, status
  ) VALUES (
    payload->>'customer_first', payload->>'customer_last',
    payload->>'customer_email', payload->>'customer_mobile',
    payload->>'customer_address', payload->>'customer_city', payload->>'customer_zip',
    coalesce(payload->'items', '[]'::jsonb),
    coalesce((payload->>'subtotal')::numeric, 0),
    coalesce((payload->>'tax')::numeric, 0),
    coalesce((payload->>'shipping')::numeric, 0),
    coalesce((payload->>'discount')::numeric, 0),
    coalesce((payload->>'total')::numeric, 0),
    payload->>'currency',
    coalesce((payload->>'exchange_rate')::numeric, 1),
    coalesce(payload->>'payment_method', 'cod'),
    coalesce(payload->>'status', 'pending')
  )
  RETURNING orders.id, orders.order_number INTO new_id, new_num;

  RETURN QUERY SELECT new_id, new_num;
END;
$$;

REVOKE ALL ON FUNCTION public.place_order(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_order(jsonb) TO anon, authenticated;
