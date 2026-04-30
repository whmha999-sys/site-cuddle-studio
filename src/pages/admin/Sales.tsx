import { useMemo } from "react";
import { useOrders } from "@/hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function fmtJOD(n: number) {
  return `JOD ${n.toFixed(2)}`;
}

export default function Sales() {
  const { data: orders = [], isLoading } = useOrders();

  const stats = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    const last30 = new Date(); last30.setDate(last30.getDate() - 30);

    let revenueToday = 0, ordersToday = 0, unitsToday = 0;
    let revenue30 = 0;
    const perProduct = new Map<string, { units: number; revenue: number; name: string }>();

    for (const o of orders) {
      const d = new Date(o.created_at);
      if (d >= today) { revenueToday += Number(o.total); ordersToday += 1; }
      if (d >= last30) { revenue30 += Number(o.total); }
      for (const it of (o.items || [])) {
        if (d >= today) unitsToday += it.qty;
        const key = it.id;
        const prev = perProduct.get(key) ?? { units: 0, revenue: 0, name: it.name || it.id };
        prev.units += it.qty;
        prev.revenue += it.qty * it.price;
        perProduct.set(key, prev);
      }
    }
    const top = [...perProduct.entries()]
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 8);

    return { revenueToday, ordersToday, unitsToday, revenue30, top };
  }, [orders]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sales dashboard</h1>
        <p className="text-sm text-muted-foreground">Live overview of orders and revenue.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Revenue today" value={fmtJOD(stats.revenueToday)} />
        <KPI label="Orders today" value={String(stats.ordersToday)} />
        <KPI label="Units sold today" value={String(stats.unitsToday)} />
        <KPI label="Revenue (30 days)" value={fmtJOD(stats.revenue30)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top selling products</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.top.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sales yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground border-b">
                  <tr><th className="py-2">Product</th><th>Units</th><th>Revenue</th></tr>
                </thead>
                <tbody>
                  {stats.top.map((t) => (
                    <tr key={t.id} className="border-b last:border-0">
                      <td className="py-2">{t.name}</td>
                      <td>{t.units}</td>
                      <td>{fmtJOD(t.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground border-b">
                  <tr>
                    <th className="py-2">#</th><th>Customer</th><th>Items</th>
                    <th>Total</th><th>Payment</th><th>Status</th><th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 25).map((o) => (
                    <tr key={o.id} className="border-b last:border-0">
                      <td className="py-2 font-mono">#{o.order_number}</td>
                      <td>{o.customer_first} {o.customer_last}</td>
                      <td>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                      <td>{fmtJOD(Number(o.total))}</td>
                      <td className="capitalize">{o.payment_method}</td>
                      <td><Badge variant="secondary">{o.status}</Badge></td>
                      <td className="text-muted-foreground">
                        {new Date(o.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
        <div className="text-2xl font-semibold mt-1">{value}</div>
      </CardContent>
    </Card>
  );
}
