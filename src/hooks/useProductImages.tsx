import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export const useProductImages = (productId?: string) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id)
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      setImages(data || []);
    } catch (err: any) {
      console.error('Error fetching product images:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addImage = async (productId: string, imageData: {
    image_url: string;
    alt_text?: string;
    display_order?: number;
    is_primary?: boolean;
  }) => {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .insert([
          {
            product_id: productId,
            ...imageData
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setImages(prev => [...prev, data].sort((a, b) => a.display_order - b.display_order));
      return data;
    } catch (err: any) {
      console.error('Error adding product image:', err);
      throw err;
    }
  };

  const updateImage = async (imageId: string, updates: Partial<ProductImage>) => {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .update(updates)
        .eq('id', imageId)
        .select()
        .single();

      if (error) throw error;

      setImages(prev => 
        prev.map(img => img.id === imageId ? { ...img, ...data } : img)
          .sort((a, b) => a.display_order - b.display_order)
      );
      return data;
    } catch (err: any) {
      console.error('Error updating product image:', err);
      throw err;
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err: any) {
      console.error('Error deleting product image:', err);
      throw err;
    }
  };

  const reorderImages = async (imageIds: string[]) => {
    try {
      const updates = imageIds.map((id, index) => ({
        id,
        display_order: index
      }));

      const promises = updates.map(update =>
        supabase
          .from('product_images')
          .update({ display_order: update.display_order })
          .eq('id', update.id)
      );

      await Promise.all(promises);
      
      // Refresh images after reordering
      if (productId) {
        fetchImages(productId);
      }
    } catch (err: any) {
      console.error('Error reordering images:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (productId) {
      fetchImages(productId);
    }
  }, [productId]);

  return {
    images,
    loading,
    error,
    addImage,
    updateImage,
    deleteImage,
    reorderImages,
    refetch: productId ? () => fetchImages(productId) : () => {}
  };
};