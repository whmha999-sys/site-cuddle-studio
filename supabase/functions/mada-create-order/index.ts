import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { madaBase, money } from "../_shared/mada.ts";

const Body = z.object({ orderId: z.string().uuid(), origin: z.string().url() });
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const phoneIntl = (p: string) => {
  const d = (p || "").replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return d;
  if (d.startsWith("00")) return "+" + d.slice(2);
  if (d.startsWith("0")) return "+962" + d.slice(1);
  if (d.startsWith("962")) return "+" + d;
  return d;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const { orderId, origin } = parsed.data;
    const allowed = ["https://teclastmena.com", "https://www.teclastmena.com", "https://site-cuddle-studio.lovable.app"];
    const okOrigin = allowed.includes(origin) || /^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin) ||
      /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin) || origin.startsWith("http://localhost");
    if (!okOrigin) return json({ error: "Invalid origin" }, 400);

    const key = Deno.env.get("MADA_MERCHANT_API_KEY");
    if (!key) return json({ error: "Mada is not configured yet" }, 503);

    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: o, error } = await sb.from("orders").select("*").eq("id", orderId).maybeSingle();
    if (error || !o) return json({ error: "Order not found" }, 404);
    if (o.payment_method !== "mada") return json({ error: "Not a Mada order" }, 400);
    if (o.payment_status === "paid") return json({ error: "Already paid" }, 400);

    const items = (o.items as any[]).map((it) => ({
      reference_id: String(it.id),
      title: `${it.name || it.id}${it.color ? ` (${it.color})` : ""}`,
      quantity: Number(it.qty),
      unit_price: money(it.price),
      total_amount: money(Number(it.price) * Number(it.qty)),
      category: "Electronics",
      product_url: `${origin}/product/${it.id}`,
    }));
    const total = items.reduce((s, i) => s + Number(i.total_amount), 0);
    const name = `${o.customer_first} ${o.customer_last}`.trim();
    const phone = phoneIntl(o.customer_mobile);
    const body: Record<string, unknown> = {
      reference_id: `SL-${o.order_number}`,
      currency_code: "JOD",
      amount: money(total),
      shipping_amount: "0.000",
      tax_amount: "0.000",
      description: `Smart Leaders order #${o.order_number}`,
      country_code: "JO",
      buyer: { name, phone, ...(o.customer_email?.endsWith("@cod.local") ? {} : { email: o.customer_email }) },
      shipping_address: {
        country: "JO", city: o.customer_city, street_address: o.customer_address,
        recipient_name: name, phone_number: phone,
      },
      items,
      cart_validity_mins: 30,
    };

    const q = `?order=${o.id}`;
    const res = await fetch(`${madaBase()}/engine/merchant/online/orders/v2`, {
      method: "POST",
      headers: {
        accept: "*/*", "Content-Type": "application/json", "X-Merchant-Api-Key": key,
        "X-Success-Callback-Url": `${origin}/payment/success${q}`,
        "X-Fail-Callback-Url": `${origin}/payment/failed${q}`,
        "X-Cancel-Callback-Url": `${origin}/checkout`,
        "X-Edit-Callback-Url": `${origin}/checkout`,
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error(`Mada create failed [${res.status}]: ${text}`);
      return json({ error: "Mada request failed", status: res.status, details: text }, 502);
    }
    const r = JSON.parse(text);
    if (!r?.success || !r?.data?.redirect_url) return json({ error: "Mada did not return a checkout link", details: r }, 502);

    await sb.from("orders").update({
      mada_order_id: r.data.order_id, mada_reference: r.data.order_reference,
    }).eq("id", o.id);
    return json({ redirect_url: r.data.redirect_url });
  } catch (e) {
    console.error(e);
    return json({ error: String((e as Error).message || e) }, 500);
  }
});
