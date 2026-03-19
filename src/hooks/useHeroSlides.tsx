import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  button_text: string;
  button_url: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useHeroSlides = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      setSlides(data || []);
    } catch (err: any) {
      console.error('Error fetching hero slides:', err);
      setError(err.message);
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  const getActiveSlides = () => {
    return slides.filter(slide => slide.is_active);
  };

  const addSlide = async (slideData: Omit<HeroSlide, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .insert([slideData])
        .select()
        .single();

      if (error) throw error;

      await fetchSlides(); // Refresh the list
      return data;
    } catch (err: any) {
      console.error('Error adding hero slide:', err);
      throw err;
    }
  };

  const updateSlide = async (id: string, slideData: Partial<HeroSlide>) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ ...slideData, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      await fetchSlides(); // Refresh the list
    } catch (err: any) {
      console.error('Error updating hero slide:', err);
      throw err;
    }
  };

  const deleteSlide = async (id: string) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchSlides(); // Refresh the list
    } catch (err: any) {
      console.error('Error deleting hero slide:', err);
      throw err;
    }
  };

  const toggleSlideActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      await fetchSlides(); // Refresh the list
    } catch (err: any) {
      console.error('Error toggling slide active:', err);
      throw err;
    }
  };

  const reorderSlides = async (slideId: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ display_order: newOrder, updated_at: new Date().toISOString() })
        .eq('id', slideId);

      if (error) throw error;

      await fetchSlides(); // Refresh the list
    } catch (err: any) {
      console.error('Error reordering slide:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  return {
    slides,
    loading,
    error,
    getActiveSlides,
    addSlide,
    updateSlide,
    deleteSlide,
    toggleSlideActive,
    reorderSlides,
    refetch: fetchSlides
  };
};