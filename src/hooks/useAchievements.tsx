import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  name: string;
  description: string;
  xp_reward: number;
  condition_type: string;
  condition_value: number;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (err: any) {
      console.error('Error fetching achievements:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createAchievement = async (achievementData: Omit<Achievement, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .insert([achievementData])
        .select()
        .single();

      if (error) throw error;

      setAchievements(prev => [data, ...prev]);
      toast({
        title: "Logro creado",
        description: "El nuevo logro ha sido agregado exitosamente.",
      });
      return data;
    } catch (err: any) {
      console.error('Error creating achievement:', err);
      toast({
        title: "Error",
        description: "No se pudo crear el logro.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateAchievement = async (id: string, updates: Partial<Achievement>) => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAchievements(prev => prev.map(achievement => achievement.id === id ? data : achievement));
      toast({
        title: "Logro actualizado",
        description: "Los cambios han sido guardados exitosamente.",
      });
      return data;
    } catch (err: any) {
      console.error('Error updating achievement:', err);
      toast({
        title: "Error",
        description: "No se pudo actualizar el logro.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteAchievement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAchievements(prev => prev.filter(achievement => achievement.id !== id));
      toast({
        title: "Logro eliminado",
        description: "El logro ha sido eliminado exitosamente.",
      });
    } catch (err: any) {
      console.error('Error deleting achievement:', err);
      toast({
        title: "Error",
        description: "No se pudo eliminar el logro.",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  return {
    achievements,
    loading,
    error,
    createAchievement,
    updateAchievement,
    deleteAchievement,
    refetch: fetchAchievements,
  };
};