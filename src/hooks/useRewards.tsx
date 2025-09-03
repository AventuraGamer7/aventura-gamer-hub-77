import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Reward {
  id: string;
  name: string;
  description: string;
  xp_cost: number;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useRewards = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRewards = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRewards(data || []);
    } catch (err: any) {
      console.error('Error fetching rewards:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createReward = async (rewardData: Omit<Reward, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .insert([rewardData])
        .select()
        .single();

      if (error) throw error;

      setRewards(prev => [data, ...prev]);
      toast({
        title: "Recompensa creada",
        description: "La nueva recompensa ha sido agregada exitosamente.",
      });
      return data;
    } catch (err: any) {
      console.error('Error creating reward:', err);
      toast({
        title: "Error",
        description: "No se pudo crear la recompensa.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateReward = async (id: string, updates: Partial<Reward>) => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setRewards(prev => prev.map(reward => reward.id === id ? data : reward));
      toast({
        title: "Recompensa actualizada",
        description: "Los cambios han sido guardados exitosamente.",
      });
      return data;
    } catch (err: any) {
      console.error('Error updating reward:', err);
      toast({
        title: "Error",
        description: "No se pudo actualizar la recompensa.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteReward = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rewards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRewards(prev => prev.filter(reward => reward.id !== id));
      toast({
        title: "Recompensa eliminada",
        description: "La recompensa ha sido eliminada exitosamente.",
      });
    } catch (err: any) {
      console.error('Error deleting reward:', err);
      toast({
        title: "Error",
        description: "No se pudo eliminar la recompensa.",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  return {
    rewards,
    loading,
    error,
    createReward,
    updateReward,
    deleteReward,
    refetch: fetchRewards,
  };
};