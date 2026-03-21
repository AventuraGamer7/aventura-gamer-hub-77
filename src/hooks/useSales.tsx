import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Sale {
  id: string;
  item_id?: string | null;
  product_id?: string | null; // legacy fallback
  item_type: string;
  product_name: string;
  product_category: string;
  product_image: string | null;
  product_price: number;
  quantity: number;
  total_price: number;
  payment_method: string;
  description: string | null;
  seller_name: string;
  sold_by: string; // fallback
  created_at: string;
  // legacy relations
  products?: any;
  profiles?: any;
}

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await (supabase as any)
        .from('all_sales_unified')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSales((data as any[]) || []);
    } catch (err: any) {
      console.error('Error fetching sales:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();

    // Tipos se regenerarán automáticamente después de la migración
    const subscription = (supabase as any)
      .channel('sales_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales'
        },
        () => {
          fetchSales();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { sales, loading, error, refetch: fetchSales };
};
