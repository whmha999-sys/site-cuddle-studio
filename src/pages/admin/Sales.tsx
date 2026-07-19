import { useMemo, useState } from "react";
import { useOrders, type Order } from "@/hooks/useOrders";
import { useAllProducts } from "@/hooks/useCatalog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

function fmtJOD(n: number) {
  return `JOD ${Number(n).toFixed(2)}`;
}

function paymentLabel(p: string) {
  const k = (p || "").toLowerCase();
  if (k === "pickup" || k === "pick-up" || k === "store") return "Pick from store";
  if (k === "cod" || k === "cash" || k === "cash-on-delivery") return "Cash on Delivery";
  return p || "—";
}

export default function Sales() {
  const { data: orders = [], isLoading } = useOrders();
  const { data: products = [] } = useAllProducts();
  const [selected, setSelected] = useState<Order | null>(null);

  const productMap = useMemo(() => {
    const m = new Map<string, { brand: string; category: string; name: string }>();
    for (const p of products) m.set(p.id, { brand: p.brand, category: p.category, name: p.name });
    return m;
  }, [products]);

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

  const pending = orders.filter(o => (o.status || "").toLowerCase() === "pending");
  const processed = orders.filter(o => (o.status || "").toLowerCase() === "processed");

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

      <OrdersTable
        title="Recent orders (pending)"
        orders={pending}
        loading={isLoading}
        productMap={productMap}
        showActionButton
        emptyText="No pending orders."
        onRowClick={setSelected}
      />

      <OrdersTable
        title="Processed orders"
        orders={processed}
        loading={isLoading}
        productMap={productMap}
        showActionButton={false}
        emptyText="No processed orders yet."
        onRowClick={setSelected}
      />

      <OrderDetailsDialog
        order={selected}
        productMap={productMap}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function OrdersTable({
  title, orders, loading, productMap, showActionButton, emptyText, onRowClick,
}: {
  title: string;
  orders: Order[];
  loading: boolean;
  productMap: Map<string, { brand: string; category: string; name: string }>;
  showActionButton: boolean;
  emptyText: string;
  onRowClick: (o: Order) => void;
}) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);

  async function markProcessed(orderId: string) {
    setBusy(orderId);
    const { error } = await supabase.from("orders")
      .update({ status: "processed" }).eq("id", orderId);
    setBusy(null);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    qc.invalidateQueries({ queryKey: ["orders"] });
    toast({ title: "Order marked as processed" });
  }

  function brandsAndTypes(o: Order) {
    const brands = new Set<string>();
    const types = new Set<string>();
    for (const it of o.items || []) {
      const p = productMap.get(it.id);
      if (p?.brand) brands.add(p.brand);
      if (p?.category) types.add(p.category);
    }
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    return {
      brand: [...brands].map(cap).join(", ") || "—",
      type: [...types].map(cap).join(", ") || "—",
    };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground border-b">
                <tr>
                  <th className="py-2">#</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Brand</th>
                  <th>Type</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 50).map((o) => {
                  const bt = brandsAndTypes(o);
                  return (
                    <tr
                      key={o.id}
                      className="border-b last:border-0 cursor-pointer hover:bg-muted/40"
                      onClick={() => onRowClick(o)}
                    >
                      <td className="py-2 font-mono">#{o.order_number}</td>
                      <td>{o.customer_first} {o.customer_last}</td>
                      <td>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                      <td className="capitalize">{bt.brand}</td>
                      <td className="capitalize">{bt.type}</td>
                      <td>{fmtJOD(Number(o.total))}</td>
                      <td>
                        <Badge variant="outline" className="font-normal">
                          {paymentLabel(o.payment_method)}
                        </Badge>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        {showActionButton ? (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white h-7 px-2"
                            disabled={busy === o.id}
                            onClick={(e) => { e.stopPropagation(); markProcessed(o.id); }}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            {busy === o.id ? "…" : "Mark processed"}
                          </Button>
                        ) : (
                          <Badge className="bg-green-600 hover:bg-green-600 text-white">
                            Processed
                          </Badge>
                        )}
                      </td>
                      <td className="text-muted-foreground">
                        {new Date(o.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OrderDetailsDialog({
  order, productMap, onClose,
}: {
  order: Order | null;
  productMap: Map<string, { brand: string; category: string; name: string }>;
  onClose: () => void;
}) {
  const open = !!order;
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="!block w-[95vw] max-w-3xl max-h-[85vh] overflow-y-auto">
        {order && (
          <div className="space-y-4">
            <DialogHeader className="pr-8">
              <DialogTitle>Order #{order.order_number}</DialogTitle>
              <DialogDescription asChild>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span>{new Date(order.created_at).toLocaleString()}</span>
                  <Badge variant="outline" className="font-normal">
                    {(order.status || "").toUpperCase()}
                  </Badge>
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Section title="Customer">
                <Row label="Name" value={`${order.customer_first} ${order.customer_last}`} />
                <Row label="Email" value={order.customer_email} />
                <Row label="Mobile" value={order.customer_mobile} />
              </Section>
              <Section title="Shipping">
                <Row label="Address" value={order.customer_address} />
                <Row label="City" value={order.customer_city} />
                {order.customer_zip && <Row label="ZIP" value={order.customer_zip} />}
              </Section>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Items</h3>
              <div className="overflow-x-auto border rounded-md">
                <table className="w-full text-sm min-w-[520px]">
                  <thead className="text-left text-muted-foreground border-b bg-muted/30">
                    <tr>
                      <th className="py-2 px-3">Product</th>
                      <th className="px-3">Color</th>
                      <th className="px-3">Qty</th>
                      <th className="px-3">Unit</th>
                      <th className="px-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((it, idx) => {
                      const p = productMap.get(it.id);
                      return (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="py-2 px-3">{p?.name || it.name || it.id}</td>
                          <td className="px-3">{it.color || "—"}</td>
                          <td className="px-3">{it.qty}</td>
                          <td className="px-3 whitespace-nowrap">{fmtJOD(it.price)}</td>
                          <td className="px-3 whitespace-nowrap">{fmtJOD(it.price * it.qty)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Section title="Payment">
                <Row label="Method" value={paymentLabel(order.payment_method)} />
                {order.notes && <Row label="Notes" value={order.notes} />}
              </Section>
              <Section title="Totals">
                <Row label="Subtotal" value={fmtJOD(Number(order.subtotal))} />
                {Number(order.discount) > 0 && (
                  <Row label="Discount" value={`- ${fmtJOD(Number(order.discount))}`} />
                )}
                <Row label="Shipping" value={fmtJOD(Number(order.shipping))} />
                <div className="flex justify-between border-t pt-2 mt-1 font-semibold">
                  <span>Total</span>
                  <span>{fmtJOD(Number(order.total))}</span>
                </div>
              </Section>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border rounded-md p-3">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
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
