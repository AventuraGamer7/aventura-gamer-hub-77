import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  color_code: string | null;
  image_url: string;
  stock: number;
  price_adjustment: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useProductVariants = (productId?: string) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVariants = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id)
        .order('display_order', { ascending: true });

      if (error) throw error;

      setVariants(data || []);
    } catch (err: any) {
      console.error('Error fetching product variants:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addVariant = async (variantData: Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .insert(variantData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Variante agregada exitosamente');
      if (productId) fetchVariants(productId);
      return data;
    } catch (err: any) {
      console.error('Error adding variant:', err);
      toast.error('Error al agregar variante: ' + err.message);
      throw err;
    }
  };

  const updateVariant = async (variantId: string, updates: Partial<ProductVariant>) => {
    try {
      const { error } = await supabase
        .from('product_variants')
        .update(updates)
        .eq('id', variantId);

      if (error) throw error;

      toast.success('Variante actualizada exitosamente');
      if (productId) fetchVariants(productId);
    } catch (err: any) {
      console.error('Error updating variant:', err);
      toast.error('Error al actualizar variante: ' + err.message);
      throw err;
    }
  };

  const deleteVariant = async (variantId: string) => {
    try {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', variantId);

      if (error) throw error;

      toast.success('Variante eliminada exitosamente');
      if (productId) fetchVariants(productId);
    } catch (err: any) {
      console.error('Error deleting variant:', err);
      toast.error('Error al eliminar variante: ' + err.message);
      throw err;
    }
  };

  const toggleActive = async (variantId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('product_variants')
        .update({ is_active: isActive })
        .eq('id', variantId);

      if (error) throw error;

      toast.success(isActive ? 'Variante activada' : 'Variante desactivada');
      if (productId) fetchVariants(productId);
    } catch (err: any) {
      console.error('Error toggling variant:', err);
      toast.error('Error al cambiar estado de variante: ' + err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (productId) {
      fetchVariants(productId);
    }
  }, [productId]);

  return {
    variants,
    loading,
    error,
    addVariant,
    updateVariant,
    deleteVariant,
    toggleActive,
    refetch: productId ? () => fetchVariants(productId) : () => {}
  };
};
