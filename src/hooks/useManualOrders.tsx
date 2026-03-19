import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ManualOrder {
  id: string;
  user_id: string;
  description: string;
  total_value: number;
  payment_method: string;
  receipt_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  // joined field for admin view
  profiles?: { username: string; email?: string } | null;
}

export const useManualOrders = (adminMode = false) => {
  const [orders, setOrders] = useState<ManualOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let query = supabase
        .from('manual_orders' as any)
        .select(adminMode ? '*, profiles!manual_orders_user_id_fkey(username)' : '*')
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      setOrders((data as any[]) || []);
    } catch (err: any) {
      console.error('Error fetching manual orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user, adminMode]);

  const createOrder = async (order: {
    description: string;
    total_value: number;
    payment_method: string;
    receipt_url?: string;
  }) => {
    if (!user) return { error: 'No authenticated' };
    try {
      const { error } = await supabase
        .from('manual_orders' as any)
        .insert({
          user_id: user.id,
          description: order.description,
          total_value: order.total_value,
          payment_method: order.payment_method,
          receipt_url: order.receipt_url || null,
        } as any);

      if (error) throw error;
      toast({ title: '¡Orden enviada!', description: 'Tu compra fue registrada y está pendiente de validación.' });
      await fetchOrders();
      return { error: null };
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      return { error: err.message };
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('manual_orders' as any)
        .update({ status: newStatus } as any)
        .eq('id', orderId);

      if (error) throw error;
      toast({ title: 'Estado actualizado', description: `Orden marcada como "${newStatus}"` });
      await fetchOrders();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  return { orders, loading, createOrder, updateStatus, refetch: fetchOrders };
};
