import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { madaInquiry } from "../_shared/mada.ts";

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = z.object({ orderId: z.string().uuid() }).safeParse(await req.json());
    if (!parsed.success) return json({ error: "Invalid order id" }, 400);
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: o } = await sb.from("orders").select("id, order_number, total, payment_status, mada_order_id")
      .eq("id", parsed.data.orderId).maybeSingle();
    if (!o) return json({ error: "Order not found" }, 404);
    let paymentStatus = o.payment_status;
    if (paymentStatus !== "paid" && o.mada_order_id) {
      try {
        const r = await madaInquiry(o.mada_order_id);
        const s = String(r?.data?.status || "").toUpperCase();
        if (["SUCCESS", "ACTIVE", "COMPLETED", "PAID"].includes(s)) {
          await sb.from("orders").update({ payment_status: "paid", paid_at: new Date().toISOString(), status: "pending" }).eq("id", o.id);
          paymentStatus = "paid";
        } else if (s === "EXPIRED") {
          await sb.from("orders").update({ payment_status: "expired" }).eq("id", o.id);
          paymentStatus = "expired";
        }
      } catch (e) { console.error("inquiry failed", e); }
    }
    return json({ order_number: o.order_number, total: o.total, payment_status: paymentStatus });
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});
