import { createClient } from "npm:@supabase/supabase-js@2";

async function hmacHex(secret: string, body: string) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function safeEq(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const secret = Deno.env.get("MADA_WEBHOOK_SECRET");
  if (!secret) return new Response("Not configured", { status: 503 });

  const raw = await req.text();
  const header = req.headers.get("X-Mada-Webhook-Signature") || "";
  if (!header.startsWith("sha256=")) return new Response("Invalid signature", { status: 401 });
  const expected = await hmacHex(secret, raw);
  if (!safeEq(header.slice(7).toLowerCase(), expected)) return new Response("Invalid signature", { status: 401 });

  let ev: any;
  try { ev = JSON.parse(raw); } catch { return new Response("Bad JSON", { status: 400 }); }
  if (!ev?.deliveryId || !ev?.orderId) return new Response("Missing fields", { status: 400 });

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error: dupErr } = await sb.from("mada_webhook_deliveries").insert({ delivery_id: ev.deliveryId, payload: ev });
  if (dupErr) {
    if (dupErr.code === "23505") return new Response("ok", { status: 200 });
    console.error(dupErr);
    return new Response("DB error", { status: 500 });
  }

  const status = String(ev.eventStatus || "").toUpperCase();
  if (status === "SUCCESS") {
    await sb.from("orders").update({ payment_status: "paid", paid_at: new Date().toISOString(), status: "pending" })
      .eq("mada_order_id", ev.orderId).neq("payment_status", "paid");
  } else if (status === "EXPIRED") {
    await sb.from("orders").update({ payment_status: "expired" })
      .eq("mada_order_id", ev.orderId).neq("payment_status", "paid");
  }
  return new Response("ok", { status: 200 });
});
