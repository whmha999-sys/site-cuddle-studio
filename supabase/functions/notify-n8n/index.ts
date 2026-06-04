// Forwards a new order to the configured n8n webhook.
// Auth model: requires a valid order id that exists in the DB. The order
// row is fetched server-side with the service role and forwarded — the
// caller's body is NEVER trusted as the source of the order.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const webhook = Deno.env.get("N8N_ORDERS_WEBHOOK_URL");
    if (!webhook) {
      return new Response(
        JSON.stringify({ ok: false, skipped: true, reason: "N8N_ORDERS_WEBHOOK_URL not set" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!supabaseUrl || !serviceKey) {
      return new Response(JSON.stringify({ ok: false, error: "Server misconfigured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => null);
    const orderId = body && typeof body === "object" ? (body.id || body.orderId) : null;
    if (!orderId || typeof orderId !== "string") {
      return new Response(JSON.stringify({ ok: false, error: "orderId required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch the order from the DB; reject if it doesn't exist.
    const supabase = createClient(supabaseUrl, serviceKey);
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (error || !order) {
      return new Response(JSON.stringify({ ok: false, error: "Order not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "smart-leaders-storefront",
        event: "order.created",
        order,
      }),
    });

    return new Response(JSON.stringify({ ok: res.ok, status: res.status }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("notify-n8n error:", msg);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
