export const madaBase = () =>
  (Deno.env.get("MADA_ENV") || "sandbox").toLowerCase() === "live"
    ? "https://api.mada-bnpl.com"
    : "https://api.sandbox.mada-bnpl.com";

export const money = (n: number) => (Math.round(Number(n) * 1000) / 1000).toFixed(3);

export async function madaInquiry(madaOrderId: string) {
  const key = Deno.env.get("MADA_MERCHANT_API_KEY");
  if (!key) throw new Error("MADA_MERCHANT_API_KEY not configured");
  const res = await fetch(`${madaBase()}/engine/merchant/orders/${encodeURIComponent(madaOrderId)}/inquiry`, {
    headers: { accept: "application/json", "X-Merchant-Api-Key": key },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`[${res.status}]: ${text}`);
  return JSON.parse(text);
}
