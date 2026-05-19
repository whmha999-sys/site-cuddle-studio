import { useState, useEffect } from "react";
import { useAllPromos, type Promo } from "@/hooks/usePromos";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Upload, ArrowUp, ArrowDown } from "lucide-react";

const HERO_SLIDES_META = [
  { id: "v-70", name: "Vikusha Smartwatch", primaryLabel: "Claim Yours", secondaryLabel: "Explore Vikusha" },
  { id: "vz-30-pro-4g", name: "Vikusha VZ-30 PRO", primaryLabel: "Shop VZ-30 PRO", secondaryLabel: "Explore Tablets" },
  { id: "teclast-p50", name: "Teclast P50", primaryLabel: "Shop P50", secondaryLabel: "Explore Teclast" },
];

type HeroSetting = {
  slide_id: string;
  primary_button_enabled: boolean;
  secondary_button_enabled: boolean;
};

function SectionsVisibilitySection() {
  const [vis, setVis] = useState<Record<string, boolean>>({ hero: true, promo_banners: true, lifestyle_banner: true });
  const qc = useQueryClient();

  async function load() {
    const { data } = await supabase.from("section_visibility").select("section_key, visible");
    const map: Record<string, boolean> = { hero: true, promo_banners: true, lifestyle_banner: true };
    (data as { section_key: string; visible: boolean }[] | null)?.forEach((r) => {
      map[r.section_key] = r.visible;
    });
    setVis(map);
  }

  useEffect(() => { load(); }, []);

  async function toggle(key: "hero" | "promo_banners" | "lifestyle_banner", value: boolean) {
    setVis((v) => ({ ...v, [key]: value }));
    await supabase.from("section_visibility").upsert({
      section_key: key,
      visible: value,
      updated_at: new Date().toISOString(),
    });
    qc.invalidateQueries({ queryKey: ["section-visibility"] });
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Sections visibility</h2>
        <p className="text-sm text-muted-foreground">
          Master switches to show or hide entire sections on the home page.
        </p>
      </div>
      <Card>
        <CardContent className="p-4 space-y-4">
          <label className="flex items-center justify-between gap-3">
            <div>
              <div className="font-medium text-sm">Show Promo Banners section</div>
              <div className="text-xs text-muted-foreground">The promo banner strip below the hero.</div>
            </div>
            <Switch checked={vis.promo_banners} onCheckedChange={(v) => toggle("promo_banners", v)} />
          </label>
          <label className="flex items-center justify-between gap-3">
            <div>
              <div className="font-medium text-sm">Show Lifestyle Banner</div>
              <div className="text-xs text-muted-foreground">The full-width Vikusha watch lifestyle photo section.</div>
            </div>
            <Switch checked={vis.lifestyle_banner} onCheckedChange={(v) => toggle("lifestyle_banner", v)} />
          </label>
        </CardContent>
      </Card>
    </div>
  );
}

function HeroButtonsSection() {
  const [settings, setSettings] = useState<Record<string, HeroSetting>>({});
  const qc = useQueryClient();

  async function load() {
    const { data } = await supabase.from("hero_slide_settings").select("*");
    const map: Record<string, HeroSetting> = {};
    (data as HeroSetting[] | null)?.forEach((r) => { map[r.slide_id] = r; });
    setSettings(map);
  }

  useEffect(() => { load(); }, []);

  async function toggle(slideId: string, field: "primary_button_enabled" | "secondary_button_enabled", value: boolean) {
    const current = settings[slideId] || {
      slide_id: slideId,
      primary_button_enabled: true,
      secondary_button_enabled: true,
    };
    const next = { ...current, [field]: value };
    setSettings((s) => ({ ...s, [slideId]: next }));
    await supabase.from("hero_slide_settings").upsert({
      slide_id: slideId,
      primary_button_enabled: next.primary_button_enabled,
      secondary_button_enabled: next.secondary_button_enabled,
    });
    qc.invalidateQueries({ queryKey: ["hero-slide-settings"] });
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Hero buttons</h2>
        <p className="text-sm text-muted-foreground">
          Show or hide each button on the home page hero slides.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {HERO_SLIDES_META.map((s) => {
          const cfg = settings[s.id];
          const primaryOn = cfg?.primary_button_enabled !== false;
          const secondaryOn = cfg?.secondary_button_enabled !== false;
          return (
            <Card key={s.id}>
              <CardContent className="p-4 space-y-3">
                <div className="font-medium">{s.name}</div>
                <label className="flex items-center justify-between gap-3 text-sm">
                  <span>Show "{s.primaryLabel}"</span>
                  <Switch
                    checked={primaryOn}
                    onCheckedChange={(v) => toggle(s.id, "primary_button_enabled", v)}
                  />
                </label>
                <label className="flex items-center justify-between gap-3 text-sm">
                  <span>Show "{s.secondaryLabel}"</span>
                  <Switch
                    checked={secondaryOn}
                    onCheckedChange={(v) => toggle(s.id, "secondary_button_enabled", v)}
                  />
                </label>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function Promos() {
  const { data: promos = [], refetch, isLoading } = useAllPromos();
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage.from("promos").upload(path, file);
    if (upErr) {
      toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
      setUploading(false); return;
    }
    const { data: pub } = supabase.storage.from("promos").getPublicUrl(path);
    const nextOrder = (promos[promos.length - 1]?.sort_order ?? 0) + 1;
    const { error: insErr } = await supabase.from("promos").insert({
      image_url: pub.publicUrl,
      title: file.name.replace(/\.[^.]+$/, ""),
      active: true,
      sort_order: nextOrder,
    });
    setUploading(false);
    e.target.value = "";
    if (insErr) toast({ title: "Save failed", description: insErr.message, variant: "destructive" });
    else {
      toast({ title: "Promo uploaded" });
      refetch();
      qc.invalidateQueries({ queryKey: ["promos"] });
    }
  }

  async function update(id: string, patch: Partial<Promo>) {
    await supabase.from("promos").update(patch).eq("id", id);
    refetch();
    qc.invalidateQueries({ queryKey: ["promos"] });
  }

  async function remove(p: Promo) {
    if (!confirm("Remove this promo?")) return;
    await supabase.from("promos").delete().eq("id", p.id);
    // best-effort storage cleanup
    try {
      const path = p.image_url.split("/promos/").pop();
      if (path) await supabase.storage.from("promos").remove([path]);
    } catch {}
    refetch();
    qc.invalidateQueries({ queryKey: ["promos"] });
  }

  async function move(p: Promo, dir: -1 | 1) {
    const idx = promos.findIndex((x) => x.id === p.id);
    const swap = promos[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("promos").update({ sort_order: swap.sort_order }).eq("id", p.id),
      supabase.from("promos").update({ sort_order: p.sort_order }).eq("id", swap.id),
    ]);
    refetch();
    qc.invalidateQueries({ queryKey: ["promos"] });
  }

  return (
    <div className="p-6 space-y-8">
      <SectionsVisibilitySection />
      
      <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Promo banners</h1>
          <p className="text-sm text-muted-foreground">
            Banners shown on the storefront. Upload an image, toggle active, reorder.
          </p>
        </div>
        <label>
          <Button disabled={uploading} asChild>
            <span className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Uploading…" : "Upload promo"}
            </span>
          </Button>
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
        </label>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : promos.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          No promos yet. Upload your first banner above.
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promos.map((p, i) => (
            <Card key={p.id} className={p.active ? "" : "opacity-60"}>
              <CardContent className="p-4 space-y-3">
                <div className="aspect-[16/9] bg-muted rounded-md overflow-hidden">
                  <img src={p.image_url} alt={p.title || "promo"} className="w-full h-full object-cover" />
                </div>
                <Input
                  value={p.title || ""}
                  placeholder="Title (optional)"
                  onChange={(e) => update(p.id, { title: e.target.value })}
                />
                <Input
                  value={p.link_url || ""}
                  placeholder="Link URL (optional)"
                  onChange={(e) => update(p.id, { link_url: e.target.value })}
                />
                <div className="flex items-center gap-2 pt-1 border-t">
                  <Switch
                    checked={p.button_enabled}
                    onCheckedChange={(v) => update(p.id, { button_enabled: v })}
                  />
                  <span className="text-sm">Show button</span>
                </div>
                {p.button_enabled && (
                  <>
                    <Input
                      value={p.button_label || ""}
                      placeholder="Button label (e.g. Shop now)"
                      onChange={(e) => update(p.id, { button_label: e.target.value })}
                    />
                    <Input
                      value={p.button_url || ""}
                      placeholder="Button URL (https://… or /products)"
                      onChange={(e) => update(p.id, { button_url: e.target.value })}
                    />
                  </>
                )}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <Switch checked={p.active}
                      onCheckedChange={(v) => update(p.id, { active: v })} />
                    Active
                  </label>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" disabled={i === 0}
                      onClick={() => move(p, -1)}>
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" disabled={i === promos.length - 1}
                      onClick={() => move(p, 1)}>
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(p)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
