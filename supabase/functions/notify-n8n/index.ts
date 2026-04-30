// Forwards a new order to the configured n8n webhook.
// Public endpoint — called from the storefront after an order is inserted.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const webhook = Deno.env.get("N8N_ORDERS_WEBHOOK_URL");
    if (!webhook) {
      return new Response(JSON.stringify({ ok: false, skipped: true, reason: "N8N_ORDERS_WEBHOOK_URL not set" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ ok: false, error: "Invalid body" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "smart-leaders-storefront", event: "order.created", order: body }),
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
