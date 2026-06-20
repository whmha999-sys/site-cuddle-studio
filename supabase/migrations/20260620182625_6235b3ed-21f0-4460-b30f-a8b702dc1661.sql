
CREATE OR REPLACE FUNCTION public.place_order(payload jsonb)
 RETURNS TABLE(id uuid, order_number bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_id uuid;
  new_num bigint;
  v_items jsonb;
  v_rate numeric;
  v_coupon text;
  v_discount_pct numeric := 0;
  v_subtotal_base numeric := 0;
  v_discount_base numeric;
  v_tax_base numeric := 0;
  v_ship_base numeric;
  v_total_base numeric;
  v_subtotal numeric;
  v_discount numeric;
  v_tax numeric := 0;
  v_ship numeric;
  v_total numeric;
  v_item jsonb;
  v_pid text;
  v_qty int;
  v_price numeric;
  v_enriched jsonb := '[]'::jsonb;
BEGIN
  IF coalesce(length(payload->>'customer_first'),0) = 0
     OR coalesce(length(payload->>'customer_last'),0) = 0
     OR coalesce(length(payload->>'customer_email'),0) = 0
     OR coalesce(length(payload->>'customer_mobile'),0) = 0
     OR coalesce(length(payload->>'customer_address'),0) = 0
     OR coalesce(jsonb_array_length(payload->'items'),0) = 0 THEN
    RAISE EXCEPTION 'Invalid order payload';
  END IF;

  v_items := payload->'items';
  v_rate := coalesce((payload->>'exchange_rate')::numeric, 1);
  IF v_rate <= 0 THEN v_rate := 1; END IF;

  v_coupon := upper(coalesce(payload->>'coupon', ''));
  IF v_coupon = 'SL10' THEN
    v_discount_pct := 0.10;
  ELSIF v_coupon = 'WELCOME' THEN
    v_discount_pct := 0.05;
  ELSE
    v_discount_pct := 0;
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(v_items)
  LOOP
    v_pid := v_item->>'id';
    v_qty := greatest(1, coalesce((v_item->>'qty')::int, 1));
    SELECT p.price INTO v_price FROM public.products p WHERE p.id = v_pid AND p.active = true;
    IF v_price IS NULL THEN
      RAISE EXCEPTION 'Unknown product: %', v_pid;
    END IF;
    v_subtotal_base := v_subtotal_base + (v_price * v_qty);
    v_enriched := v_enriched || jsonb_build_array(
      jsonb_build_object(
        'id', v_pid,
        'name', coalesce(v_item->>'name', ''),
        'color', coalesce(v_item->>'color', ''),
        'qty', v_qty,
        'price', v_price,
        'price_local', round(v_price * v_rate, 2)
      )
    );
  END LOOP;

  v_discount_base := round(v_subtotal_base * v_discount_pct, 2);
  v_tax_base := 0;
  v_ship_base := CASE WHEN v_subtotal_base > 100 THEN 0 ELSE 3 END;
  v_total_base := v_subtotal_base - v_discount_base + v_ship_base;

  v_subtotal := round(v_subtotal_base * v_rate, 2);
  v_discount := round(v_discount_base * v_rate, 2);
  v_tax := 0;
  v_ship := round(v_ship_base * v_rate, 2);
  v_total := round(v_total_base * v_rate, 2);

  INSERT INTO public.orders (
    customer_first, customer_last, customer_email, customer_mobile,
    customer_address, customer_city, customer_zip,
    items, subtotal, tax, shipping, discount, total,
    currency, exchange_rate, payment_method, status
  ) VALUES (
    payload->>'customer_first', payload->>'customer_last',
    payload->>'customer_email', payload->>'customer_mobile',
    payload->>'customer_address', payload->>'customer_city', payload->>'customer_zip',
    v_enriched,
    v_subtotal, v_tax, v_ship, v_discount, v_total,
    coalesce(payload->>'currency', 'JOD'),
    v_rate,
    coalesce(payload->>'payment_method', 'cod'),
    'pending'
  )
  RETURNING public.orders.id, public.orders.order_number INTO new_id, new_num;

  id := new_id;
  order_number := new_num;
  RETURN NEXT;
END;
$function$;
