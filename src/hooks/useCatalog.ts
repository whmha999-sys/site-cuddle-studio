import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type DbProduct = {
  id: string;
  brand: string;
  category: string;
  name: string;
  tagline: string | null;
  price: number;
  specs: Record<string, string>;
  colors: string[];
  hero: boolean;
  active: boolean;
  sort_order: number;
};

export type DbProductImage = {
  id: string;
  product_id: string;
  color: string;
  url: string;
  sort_order: number;
};

/** Returns CATALOG-shaped array + PRODUCT_IMAGES-shaped map, fetched from DB. */
export function useCatalog() {
  return useQuery({
    queryKey: ["catalog"],
    queryFn: async () => {
      const [prodRes, imgRes] = await Promise.all([
        supabase.from("products").select("*").eq("active", true).order("sort_order"),
        supabase.from("product_images").select("*").order("sort_order"),
      ]);
      if (prodRes.error) throw prodRes.error;
      if (imgRes.error) throw imgRes.error;

      const catalog = (prodRes.data || []).map((p: any) => ({
        id: p.id,
        brand: p.brand,
        category: p.category,
        name: p.name,
        tagline: p.tagline,
        price: Number(p.price),
        specs: p.specs || {},
        colors: p.colors || [],
        hero: !!p.hero,
      }));

      const images: Record<string, Record<string, string[]>> = {};
      for (const img of (imgRes.data || []) as DbProductImage[]) {
        images[img.product_id] ??= {};
        images[img.product_id][img.color] ??= [];
        images[img.product_id][img.color].push(img.url);
      }

      return { catalog, images };
    },
    staleTime: 60_000,
  });
}

/** Admin-only: fetch ALL products (including inactive). */
export function useAllProducts() {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as DbProduct[];
    },
  });
}
