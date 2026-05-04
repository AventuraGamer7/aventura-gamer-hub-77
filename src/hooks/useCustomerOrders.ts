import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  user_id: string;
  item_id: string;
  item_type: string;
  quantity: number;
  total_price: number;
  created_at: string;
  shipping_status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';
  shipping_address?: string;
  tracking_number?: string;
  estimated_delivery?: string;
  shipped_at?: string;
  delivered_at?: string;
}

export function useCustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Listen for real-time updates on orders
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order update received:', payload);
          fetchOrders(); // Refresh orders when there's a change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    orders,
    loading,
    refetch: fetchOrders
  };
}