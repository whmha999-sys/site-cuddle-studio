import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type HeroSlideSetting = {
  slide_id: string;
  primary_button_enabled: boolean;
  secondary_button_enabled: boolean;
};

export function useHeroSettings() {
  return useQuery({
    queryKey: ["hero-slide-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_slide_settings")
        .select("*");
      if (error) throw error;
      const map: Record<string, HeroSlideSetting> = {};
      (data as HeroSlideSetting[]).forEach((r) => { map[r.slide_id] = r; });
      return map;
    },
    staleTime: 30_000,
  });
}
