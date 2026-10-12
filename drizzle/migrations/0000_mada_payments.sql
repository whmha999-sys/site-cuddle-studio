ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS mada_order_id text,
  ADD COLUMN IF NOT EXISTS mada_reference text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

CREATE TABLE public.mada_webhook_deliveries (
  delivery_id text PRIMARY KEY,
  received_at timestamptz NOT NULL DEFAULT now(),
  payload jsonb
);
GRANT ALL ON public.mada_webhook_deliveries TO service_role;
ALTER TABLE public.mada_webhook_deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages deliveries" ON public.mada_webhook_deliveries FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION public.place_order(payload jsonb)
 RETURNS TABLE(id uuid, order_number bigint)
 LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  new_id uuid; new_num bigint; v_items jsonb; v_rate numeric;
  v_subtotal_base numeric := 0; v_subtotal numeric; v_item jsonb; v_pid text; v_qty int; v_price numeric;
  v_enriched jsonb := '[]'::jsonb; v_method text; v_currency text;
BEGIN
  IF coalesce(length(payload->>'customer_first'),0) = 0
     OR coalesce(length(payload->>'customer_last'),0) = 0
     OR coalesce(length(payload->>'customer_email'),0) = 0
     OR coalesce(length(payload->>'customer_mobile'),0) = 0
     OR coalesce(length(payload->>'customer_address'),0) = 0
     OR coalesce(jsonb_array_length(payload->'items'),0) = 0 THEN
    RAISE EXCEPTION 'Invalid order payload';
  END IF;
  v_method := coalesce(payload->>'payment_method', 'cod');
  IF v_method NOT IN ('cod','pickup','mada') THEN v_method := 'cod'; END IF;
  v_currency := coalesce(payload->>'currency', 'JOD');
  v_rate := coalesce((payload->>'exchange_rate')::numeric, 1);
  IF v_rate <= 0 THEN v_rate := 1; END IF;
  IF v_method = 'mada' THEN v_currency := 'JOD'; v_rate := 1; END IF;
  v_items := payload->'items';
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_items) LOOP
    v_pid := v_item->>'id';
    v_qty := greatest(1, coalesce((v_item->>'qty')::int, 1));
    SELECT p.price INTO v_price FROM public.products p WHERE p.id = v_pid AND p.active = true AND p.sold_out = false;
    IF v_price IS NULL THEN RAISE EXCEPTION 'Product unavailable: %', v_pid; END IF;
    v_subtotal_base := v_subtotal_base + (v_price * v_qty);
    v_enriched := v_enriched || jsonb_build_array(jsonb_build_object(
      'id', v_pid, 'name', coalesce(v_item->>'name',''), 'color', coalesce(v_item->>'color',''),
      'qty', v_qty, 'price', v_price, 'price_local', round(v_price * v_rate, 2)));
  END LOOP;
  v_subtotal := round(v_subtotal_base * v_rate, 2);
  INSERT INTO public.orders (customer_first, customer_last, customer_email, customer_mobile,
    customer_address, customer_city, customer_zip, items, subtotal, tax, shipping, discount, total,
    currency, exchange_rate, payment_method, status, payment_status)
  VALUES (payload->>'customer_first', payload->>'customer_last', payload->>'customer_email', payload->>'customer_mobile',
    payload->>'customer_address', payload->>'customer_city', payload->>'customer_zip', v_enriched,
    v_subtotal, 0, 0, 0, v_subtotal, v_currency, v_rate, v_method,
    CASE WHEN v_method = 'mada' THEN 'awaiting_payment' ELSE 'pending' END,
    CASE WHEN v_method = 'mada' THEN 'pending' ELSE 'unpaid' END)
  RETURNING public.orders.id, public.orders.order_number INTO new_id, new_num;
  id := new_id; order_number := new_num; RETURN NEXT;
END;
$function$;