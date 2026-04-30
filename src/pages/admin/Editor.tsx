import { useState } from "react";
import { useAllProducts, type DbProduct } from "@/hooks/useCatalog";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";

type ImgRow = { id: string; product_id: string; color: string; url: string; sort_order: number };

export default function Editor() {
  const { data: products = [], isLoading, refetch } = useAllProducts();
  const [editing, setEditing] = useState<DbProduct | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Catalog</h1>
          <p className="text-sm text-muted-foreground">Add, edit, or remove products.</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add product
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onEdit={() => setEditing(p)} onChanged={refetch} />
          ))}
        </div>
      )}

      <ProductDrawer
        product={editing}
        open={!!editing}
        onClose={() => setEditing(null)}
        onSaved={() => { setEditing(null); refetch(); }}
      />
      <ProductDrawer
        product={null}
        open={creating}
        onClose={() => setCreating(false)}
        onSaved={() => { setCreating(false); refetch(); }}
      />
    </div>
  );
}

function ProductCard({
  product, onEdit, onChanged,
}: { product: DbProduct; onEdit: () => void; onChanged: () => void }) {
  const { toast } = useToast();
  const { data: imgs = [] } = useQuery({
    queryKey: ["product-images", product.id, product.colors[0]],
    queryFn: async () => {
      const { data } = await supabase.from("product_images")
        .select("url").eq("product_id", product.id)
        .order("sort_order").limit(1);
      return data || [];
    },
  });

  async function toggleActive() {
    const { error } = await supabase.from("products")
      .update({ active: !product.active }).eq("id", product.id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else onChanged();
  }

  return (
    <Card className={product.active ? "" : "opacity-60"}>
      <CardContent className="p-4 space-y-3">
        <div className="aspect-square bg-muted rounded-md overflow-hidden flex items-center justify-center">
          {imgs[0]?.url ? (
            <img src={imgs[0].url} alt={product.name} className="w-full h-full object-contain" />
          ) : (
            <span className="text-xs text-muted-foreground">No image</span>
          )}
        </div>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-medium truncate">{product.name}</div>
            <div className="text-xs text-muted-foreground capitalize">
              {product.brand} · {product.category}
            </div>
          </div>
          <Badge variant={product.active ? "default" : "secondary"}>
            {product.active ? "Live" : "Hidden"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="font-mono text-sm">JOD {Number(product.price).toFixed(2)}</div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Pencil className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={toggleActive}>
              {product.active ? "Hide" : "Show"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductDrawer({
  product, open, onClose, onSaved,
}: { product: DbProduct | null; open: boolean; onClose: () => void; onSaved: () => void }) {
  const isNew = !product;
  const { toast } = useToast();
  const qc = useQueryClient();

  const [form, setForm] = useState(() => ({
    id: product?.id || "",
    brand: product?.brand || "vikusha",
    category: product?.category || "tablet",
    name: product?.name || "",
    tagline: product?.tagline || "",
    price: product?.price ?? 0,
    colors: (product?.colors || []).join(", "),
    specs: JSON.stringify(product?.specs || {}, null, 2),
    hero: product?.hero || false,
    active: product?.active ?? true,
    sort_order: product?.sort_order ?? 999,
  }));

  // Reset form when product changes
  useState(() => {
    if (product) setForm({
      id: product.id, brand: product.brand, category: product.category,
      name: product.name, tagline: product.tagline || "", price: product.price,
      colors: (product.colors || []).join(", "),
      specs: JSON.stringify(product.specs || {}, null, 2),
      hero: product.hero, active: product.active, sort_order: product.sort_order,
    });
  });

  async function save() {
    let specsObj: Record<string, string> = {};
    try { specsObj = JSON.parse(form.specs || "{}"); }
    catch { toast({ title: "Specs must be valid JSON", variant: "destructive" }); return; }

    const payload = {
      id: form.id.trim(),
      brand: form.brand.trim(),
      category: form.category.trim(),
      name: form.name.trim(),
      tagline: form.tagline.trim() || null,
      price: Number(form.price),
      colors: form.colors.split(",").map(c => c.trim()).filter(Boolean),
      specs: specsObj,
      hero: form.hero,
      active: form.active,
      sort_order: Number(form.sort_order) || 999,
    };
    if (!payload.id || !payload.name) {
      toast({ title: "ID and name are required", variant: "destructive" }); return;
    }

    const { error } = isNew
      ? await supabase.from("products").insert(payload)
      : await supabase.from("products").update(payload).eq("id", product!.id);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: isNew ? "Product created" : "Product updated" });
    qc.invalidateQueries({ queryKey: ["catalog"] });
    onSaved();
  }

  async function remove() {
    if (!product) return;
    if (!confirm(`Delete "${product.name}"? This removes all photos too.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Deleted" });
    qc.invalidateQueries({ queryKey: ["catalog"] });
    onSaved();
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isNew ? "Add product" : `Edit · ${product?.name}`}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-3">
            <Field label="ID (slug, e.g. vz-90)">
              <Input value={form.id} disabled={!isNew}
                onChange={(e) => setForm({ ...form, id: e.target.value })} />
            </Field>
            <Field label="Sort order">
              <Input type="number" value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </Field>
            <Field label="Name">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Price (JOD)">
              <Input type="number" step="0.01" value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </Field>
            <Field label="Brand">
              <select className="border rounded-md h-10 px-3 bg-background"
                value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}>
                <option value="vikusha">Vikusha</option>
                <option value="teclast">Teclast</option>
              </select>
            </Field>
            <Field label="Category">
              <select className="border rounded-md h-10 px-3 bg-background"
                value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="tablet">Tablet</option>
                <option value="watch">Watch</option>
                <option value="accessory">Accessory</option>
              </select>
            </Field>
          </div>

          <Field label="Tagline">
            <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </Field>

          <Field label="Colors (comma-separated)">
            <Input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })}
              placeholder="graphite, silver, blue" />
          </Field>

          <Field label="Specs (JSON)">
            <Textarea rows={6} className="font-mono text-xs" value={form.specs}
              onChange={(e) => setForm({ ...form, specs: e.target.value })} />
          </Field>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              Active (visible)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.hero} onCheckedChange={(v) => setForm({ ...form, hero: v })} />
              Featured / hero
            </label>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button onClick={save}>Save</Button>
            {!isNew && (
              <Button variant="destructive" onClick={remove}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            )}
          </div>

          {!isNew && product && (
            <div className="pt-6 border-t">
              <h3 className="font-medium mb-3">Photos</h3>
              <ImagesEditor productId={product.id} colors={product.colors} />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function ImagesEditor({ productId, colors }: { productId: string; colors: string[] }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [activeColor, setActiveColor] = useState(colors[0] || "default");

  const { data: imgs = [], refetch } = useQuery({
    queryKey: ["edit-product-images", productId],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_images")
        .select("*").eq("product_id", productId).order("sort_order");
      if (error) throw error;
      return data as ImgRow[];
    },
  });

  const colorImgs = imgs.filter((i) => i.color === activeColor);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    let nextOrder = colorImgs.length;
    for (const f of files) {
      const ext = f.name.split(".").pop();
      const path = `${productId}/${activeColor}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("product-images").upload(path, f);
      if (upErr) { toast({ title: "Upload failed", description: upErr.message, variant: "destructive" }); continue; }
      const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
      const { error: insErr } = await supabase.from("product_images").insert({
        product_id: productId, color: activeColor, url: pub.publicUrl, sort_order: nextOrder++,
      });
      if (insErr) toast({ title: "DB insert failed", description: insErr.message, variant: "destructive" });
    }
    refetch();
    qc.invalidateQueries({ queryKey: ["catalog"] });
    e.target.value = "";
  }

  async function removeImage(img: ImgRow) {
    await supabase.from("product_images").delete().eq("id", img.id);
    refetch();
    qc.invalidateQueries({ queryKey: ["catalog"] });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(colors.length ? colors : ["default"]).map((c) => (
          <button key={c} onClick={() => setActiveColor(c)}
            className={`px-3 py-1 rounded-md text-xs border ${
              activeColor === c ? "bg-primary text-primary-foreground" : "bg-background"
            }`}>
            {c}
          </button>
        ))}
      </div>

      <label className="flex items-center justify-center gap-2 border-2 border-dashed rounded-md p-6 cursor-pointer hover:bg-muted text-sm">
        <Upload className="h-4 w-4" />
        <span>Upload photos for "{activeColor}"</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={onUpload} />
      </label>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {colorImgs.map((img) => (
          <div key={img.id} className="relative group aspect-square bg-muted rounded overflow-hidden">
            <img src={img.url} alt="" className="w-full h-full object-contain" />
            <button onClick={() => removeImage(img)}
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
