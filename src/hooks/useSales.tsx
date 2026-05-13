import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UnifiedSale {
  id: string;
  item_id: string | null;
  item_type: string;
  product_name: string;
  product_category: string;
  product_image: string | null;
  product_price: number;
  quantity: number;
  total_price: number;
  payment_method: string;
  description: string | null;
  seller_name: string;
  sold_by: string;
  created_at: string;
}

const fetchUnifiedSales = async (): Promise<UnifiedSale[]> => {
  const { data: sales, error } = await supabase
    .from('sales')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!sales || sales.length === 0) return [];

  // Collect related ids
  const productIds = new Set<string>();
  const serviceIds = new Set<string>();
  const courseIds = new Set<string>();
  const sellerIds = new Set<string>();

  sales.forEach((s: any) => {
    if (s.sold_by) sellerIds.add(s.sold_by);
    if (!s.item_id) return;
    if (s.item_type === 'producto' || s.item_type === 'product') productIds.add(s.item_id);
    else if (s.item_type === 'servicio' || s.item_type === 'service') serviceIds.add(s.item_id);
    else if (s.item_type === 'curso' || s.item_type === 'course') courseIds.add(s.item_id);
  });

  const [productsRes, servicesRes, coursesRes, profilesRes] = await Promise.all([
    productIds.size
      ? supabase.from('products').select('id,name,category,image,price').in('id', Array.from(productIds))
      : Promise.resolve({ data: [] as any[], error: null }),
    serviceIds.size
      ? supabase.from('services').select('id,name,image,price').in('id', Array.from(serviceIds))
      : Promise.resolve({ data: [] as any[], error: null }),
    courseIds.size
      ? supabase.from('courses').select('id,title,cover,price').in('id', Array.from(courseIds))
      : Promise.resolve({ data: [] as any[], error: null }),
    sellerIds.size
      ? supabase.from('profiles').select('id,username').in('id', Array.from(sellerIds))
      : Promise.resolve({ data: [] as any[], error: null }),
  ]);

  const pMap = new Map((productsRes.data || []).map((p: any) => [p.id, p]));
  const sMap = new Map((servicesRes.data || []).map((s: any) => [s.id, s]));
  const cMap = new Map((coursesRes.data || []).map((c: any) => [c.id, c]));
  const profMap = new Map((profilesRes.data || []).map((p: any) => [p.id, p]));

  return (sales as any[]).map((s: any) => {
    let name = s.description || 'Venta libre';
    let category = '—';
    let image: string | null = null;
    let price = Number(s.total_price) / Math.max(1, Number(s.quantity || 1));

    if (s.item_id) {
      if ((s.item_type === 'producto' || s.item_type === 'product') && pMap.has(s.item_id)) {
        const p: any = pMap.get(s.item_id);
        name = p.name; category = p.category || '—'; image = p.image; price = Number(p.price);
      } else if ((s.item_type === 'servicio' || s.item_type === 'service') && sMap.has(s.item_id)) {
        const sv: any = sMap.get(s.item_id);
        name = sv.name; category = 'Servicio'; image = sv.image; price = Number(sv.price);
      } else if ((s.item_type === 'curso' || s.item_type === 'course') && cMap.has(s.item_id)) {
        const c: any = cMap.get(s.item_id);
        name = c.title; category = 'Curso'; image = c.cover; price = Number(c.price);
      }
    }

    const seller: any = profMap.get(s.sold_by);
    return {
      id: s.id,
      item_id: s.item_id,
      item_type: s.item_type,
      product_name: name,
      product_category: category,
      product_image: image,
      product_price: price,
      quantity: s.quantity,
      total_price: Number(s.total_price),
      payment_method: s.payment_method || '—',
      description: s.description,
      seller_name: seller?.username || 'Desconocido',
      sold_by: s.sold_by,
      created_at: s.created_at,
    };
  });
};

export const useSales = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sales-unified'],
    queryFn: fetchUnifiedSales,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const channel = supabase
      .channel('sales_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sales' },
        () => queryClient.invalidateQueries({ queryKey: ['sales-unified'] }),
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  return {
    sales: data ?? [],
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
};
