import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Promo = {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  link_url: string | null;
  active: boolean;
  sort_order: number;
  button_enabled: boolean;
  button_label: string | null;
  button_url: string | null;
};

export function usePromos() {
  return useQuery({
    queryKey: ["promos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promos")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data as Promo[];
    },
    staleTime: 60_000,
  });
}

export function useAllPromos() {
  return useQuery({
    queryKey: ["admin-promos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promos")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Promo[];
    },
  });
}
