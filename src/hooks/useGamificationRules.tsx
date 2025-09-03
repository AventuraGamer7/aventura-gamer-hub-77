import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GamificationRule {
  id: string;
  rule_type: string;
  rule_name: string;
  description: string;
  xp_amount: number;
  threshold_value: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useGamificationRules = () => {
  const [rules, setRules] = useState<GamificationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRules = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('gamification_rules')
        .select('*')
        .order('rule_type', { ascending: true });

      if (error) throw error;
      setRules(data || []);
    } catch (err: any) {
      console.error('Error fetching rules:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createRule = async (ruleData: Omit<GamificationRule, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('gamification_rules')
        .insert([ruleData])
        .select()
        .single();

      if (error) throw error;

      setRules(prev => [...prev, data]);
      toast({
        title: "Regla creada",
        description: "La nueva regla ha sido agregada exitosamente.",
      });
      return data;
    } catch (err: any) {
      console.error('Error creating rule:', err);
      toast({
        title: "Error",
        description: "No se pudo crear la regla.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateRule = async (id: string, updates: Partial<GamificationRule>) => {
    try {
      const { data, error } = await supabase
        .from('gamification_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setRules(prev => prev.map(rule => rule.id === id ? data : rule));
      toast({
        title: "Regla actualizada",
        description: "Los cambios han sido guardados exitosamente.",
      });
      return data;
    } catch (err: any) {
      console.error('Error updating rule:', err);
      toast({
        title: "Error",
        description: "No se pudo actualizar la regla.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gamification_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRules(prev => prev.filter(rule => rule.id !== id));
      toast({
        title: "Regla eliminada",
        description: "La regla ha sido eliminada exitosamente.",
      });
    } catch (err: any) {
      console.error('Error deleting rule:', err);
      toast({
        title: "Error",
        description: "No se pudo eliminar la regla.",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return {
    rules,
    loading,
    error,
    createRule,
    updateRule,
    deleteRule,
    refetch: fetchRules,
  };
};