import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Sale {
  id: string;
  product_id: string;
  quantity: number;
  total_price: number;
  sold_by: string;
  created_at: string;
  products?: {
    name: string;
    price: number;
  };
  profiles?: {
    username: string;
  };
}

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          products:product_id (name, price)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Obtener información de usuarios por separado
      const userIds = [...new Set(data?.map(s => s.sold_by))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds);

      // Combinar datos
      const salesWithProfiles = data?.map(sale => ({
        ...sale,
        profiles: profilesData?.find(p => p.id === sale.sold_by)
      }));

      setSales(salesWithProfiles || []);
    } catch (err: any) {
      console.error('Error fetching sales:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();

    const subscription = supabase
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
