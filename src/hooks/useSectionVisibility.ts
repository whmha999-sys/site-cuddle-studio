import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SectionKey = "hero" | "promo_banners" | "lifestyle_banner";

export function useSectionVisibility() {
  return useQuery({
    queryKey: ["section-visibility"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("section_visibility")
        .select("section_key, visible");
      if (error) throw error;
      const map: Record<string, boolean> = { hero: true, promo_banners: true, lifestyle_banner: true };
      (data || []).forEach((r: any) => { map[r.section_key] = r.visible; });
      return map as Record<SectionKey, boolean>;
    },
    staleTime: 30_000,
  });
}
