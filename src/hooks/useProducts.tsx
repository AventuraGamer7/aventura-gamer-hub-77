import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  platform: string[] | null;
  featured?: boolean;
  image: string | null;
  images: string[] | null;
  badge_text: string | null;
  badge_color: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const useProducts = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 min — fresh enough for a catalog
    gcTime: 1000 * 60 * 30, // keep in cache 30 min
    refetchOnWindowFocus: false,
  });

  // Realtime invalidation — replaces previous full re-fetch on every change
  useEffect(() => {
    const subscription = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => queryClient.invalidateQueries({ queryKey: ['products'] }),
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return {
    products: data ?? [],
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
};
