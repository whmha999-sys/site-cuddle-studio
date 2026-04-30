import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Order = {
  id: string;
  order_number: number;
  customer_first: string;
  customer_last: string;
  customer_email: string;
  customer_mobile: string;
  customer_address: string;
  customer_city: string;
  customer_zip: string | null;
  items: Array<{ id: string; name?: string; color: string; qty: number; price: number }>;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  payment_method: string;
  status: string;
  notes: string | null;
  created_at: string;
};

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Order[];
    },
  });
}
