import { useMemo, useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { useServices } from '@/hooks/useServices';
import { useCourses } from '@/hooks/useCourses';
import { useSales } from '@/hooks/useSales';
import { toast } from '@/hooks/use-toast';
import { Loader2, ShoppingCart, Search, X, Package, Wrench, GraduationCap, TrendingUp, Clock, Banknote, CreditCard, ArrowRightLeft, Pencil } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format, isToday, isYesterday, subDays, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

type ItemType = 'producto' | 'servicio' | 'curso';
interface SelectedItemData { id: string; name: string; price: number; stock: number | null; image: string | null; itemType: ItemType; }

const formatCOP = (price: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

const itemTypeConfig: Record<ItemType, { label: string; icon: React.ReactNode; color: string }> = {
  producto: { label: 'Producto', icon: <Package className='h-3 w-3' />, color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  servicio: { label: 'Servicio', icon: <Wrench className='h-3 w-3' />, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  curso: { label: 'Curso', icon: <GraduationCap className='h-3 w-3' />, color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
};

const ItemTypeBadge = ({ type }: { type: ItemType }) => {
  const cfg = itemTypeConfig[type];
  return <Badge variant='outline' className={`text-xs gap-1 ${cfg.color}`}>{cfg.icon} {cfg.label}</Badge>;
};

const getUnifiedBadge = (type: string) => {
  switch (type) {
    case 'service': return <Badge variant='outline' className='text-[10px] bg-blue-500/20 text-blue-400 border-blue-500/40 ml-2'>Servicio</Badge>;
    case 'orden_servicio': return <Badge variant='outline' className='text-[10px] bg-orange-500/20 text-orange-400 border-orange-500/40 ml-2'>Orden de servicio</Badge>;
    case 'course': return <Badge variant='outline' className='text-[10px] bg-green-500/20 text-green-400 border-green-500/40 ml-2'>Curso</Badge>;
    case 'pedido': return <Badge variant='outline' className='text-[10px] bg-yellow-500/20 text-yellow-400 border-yellow-500/40 ml-2'>Pedido</Badge>;
    default: return null;
  }
};

const SalesManagementPanel = () => {
  const { user } = useAuth();
  const { products } = useProducts();
  const { services } = useServices();
  const { courses } = useCourses();
  const { sales, loading: loadingSales, error, refetch } = useSales();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<SelectedItemData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [salesSearch, setSalesSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<'hoy' | 'ayer' | '7dias' | 'mes' | 'todas'>('hoy');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowAutocomplete(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const allItems = useMemo(() => {
    const list: SelectedItemData[] = [];
    products?.forEach((p: any) => list.push({ id: p.id, name: p.name, price: p.price, stock: p.stock ?? null, image: p.image || null, itemType: 'producto' }));
    services?.forEach((s: any) => list.push({ id: s.id, name: s.name, price: s.price, stock: null, image: s.image || null, itemType: 'servicio' }));
    courses?.forEach((c: any) => list.push({ id: c.id, name: c.title || 'Curso', price: c.price, stock: null, image: c.cover || null, itemType: 'curso' }));
    return list;
  }, [products, services, courses]);

  const unifiedResults = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    return allItems.filter(i => i.name.toLowerCase().includes(term));
  }, [allItems, searchTerm]);

  const totalVenta = () => {
    if (!selectedItem) return 0;
    const unit = Number(customPrice) || selectedItem.price;
    return unit * quantity;
  };

  const handleRegisterSale = async () => {
    if (!selectedItem || !user) {
      toast({ title: 'Error', description: 'Selecciona un ítem', variant: 'destructive' });
      return;
    }
    if (selectedItem.itemType === 'producto' && selectedItem.stock !== null && quantity > selectedItem.stock) {
      toast({ title: 'Stock insuficiente', description: `Solo hay ${selectedItem.stock} unidades`, variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const payload: any = {
        item_type: selectedItem.itemType,
        quantity,
        total_price: totalVenta(),
        payment_method: 'efectivo',
      };
      if (selectedItem.itemType === 'producto') {
        payload.item_id = selectedItem.id;
      } else {
        payload.item_id = null;
        payload.description = selectedItem.name;
      }

      const { error: insertError } = await supabase.from('sales').insert(payload);
      if (insertError) throw insertError;

      if (selectedItem.itemType === 'producto') {
        await supabase.from('products').update({ stock: (selectedItem.stock ?? 0) - quantity }).eq('id', selectedItem.id);
      }

      toast({ title: 'Venta registrada', description: `${quantity} × ${selectedItem.name}` });
      setSelectedItem(null); setQuantity(1); setCustomPrice(''); setNotes(''); setSearchTerm('');
      refetch();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'No se pudo registrar la venta', variant: 'destructive' });
    } finally { setSubmitting(false); }
  };

  const filteredSales = useMemo(() => {
    let filtered = sales || [];
    if (salesSearch) {
      const term = salesSearch.toLowerCase();
      filtered = filtered.filter((s: any) => {
        const itemName = s.product_name || s.description || '';
        return (
          itemName.toLowerCase().includes(term) ||
          (s.seller_name || s.sold_by || '').toLowerCase().includes(term) ||
          (s.total_price || 0).toString().includes(term) ||
          (s.payment_method || '').toLowerCase().includes(term)
        );
      });
    }
    const now = new Date();
    return filtered.filter((sale: any) => {
      const d = new Date(sale.created_at);
      if (dateFilter === 'hoy') return isToday(d);
      if (dateFilter === 'ayer') return isYesterday(d);
      if (dateFilter === '7dias') return d >= subDays(now, 7);
      if (dateFilter === 'mes') return d >= startOfMonth(now);
      return true;
    });
  }, [sales, salesSearch, dateFilter]);

  const dateFilters = [
    { value: 'hoy', label: 'Hoy', icon: <Clock className='h-3 w-3' /> },
    { value: 'ayer', label: 'Ayer' },
    { value: '7dias', label: '7 días' },
    { value: 'mes', label: 'Este mes' },
    { value: 'todas', label: 'Todas' },
  ];

  return (
    <div className='space-y-4'>
      <Card className='card-gaming border-primary/20'>
        <CardHeader className='pb-3 bg-gradient-to-r from-primary/5 to-transparent rounded-t-xl'>
          <CardTitle className='text-base flex items-center gap-2'><ShoppingCart className='h-4 w-4 text-primary' />Agregar venta</CardTitle>
          <CardDescription>Registra ventas directas desde el dashboard</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='space-y-1' ref={searchRef}>
            <Label className='text-xs text-muted-foreground flex items-center gap-1'><Search className='h-3.5 w-3.5' />Buscar ítem</Label>
            <Input placeholder='Busca productos, servicios o cursos...' value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setShowAutocomplete(Boolean(e.target.value)); }} onFocus={() => setShowAutocomplete(Boolean(searchTerm))} />
            {showAutocomplete && searchTerm && (
              <div className='border border-border bg-card rounded-xl max-h-72 overflow-y-auto shadow-lg p-2 space-y-2'>
                {unifiedResults.length > 0 ? unifiedResults.slice(0, 10).map(item => (
                  <button key={`${item.itemType}-${item.id}`} onClick={() => { setSelectedItem(item); setCustomPrice(item.price.toString()); setShowAutocomplete(false); }} className='w-full text-left rounded-xl border border-border/40 p-2 bg-background hover:bg-primary/5 grid grid-cols-[auto_1fr] gap-2 items-center'>
                    <div className='h-10 w-10 rounded-md overflow-hidden bg-muted border border-border flex items-center justify-center text-[10px] text-muted-foreground'>
                      {item.image ? <img src={item.image} alt={item.name} className='h-full w-full object-cover' /> : 'Img'}
                    </div>
                    <div className='text-left min-w-0'>
                      <div className='flex items-center gap-2'><span className='font-medium text-sm truncate'>{item.name}</span><ItemTypeBadge type={item.itemType} /></div>
                      <p className='text-[11px] text-muted-foreground truncate'>Precio: {formatCOP(item.price)}</p>
                      {item.stock !== null && <p className='text-[11px] text-muted-foreground'>Stock: {item.stock}</p>}
                    </div>
                  </button>
                )) : <div className='p-3 text-xs text-muted-foreground'>No hay resultados</div>}
              </div>
            )}
          </div>
          {selectedItem && (
            <div className='rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-3'>
              <div className='flex items-start gap-3'>
                <div className='w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border flex items-center justify-center'>
                  {selectedItem.image ? <img src={selectedItem.image} alt={selectedItem.name} className='h-full w-full object-cover' /> : <span className='text-xs text-muted-foreground'>Sin imagen</span>}
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2'>
                    <p className='font-semibold truncate'>{selectedItem.name}</p>
                    <ItemTypeBadge type={selectedItem.itemType} />
                  </div>
                  <p className='text-xs text-muted-foreground truncate'>Precio base: {formatCOP(selectedItem.price)}</p>
                  {selectedItem.stock !== null && <Badge variant='outline' className='text-[10px] mt-1'>Stock: {selectedItem.stock}</Badge>}
                </div>
                <Button variant='ghost' size='icon' onClick={() => setSelectedItem(null)}><X className='h-4 w-4' /></Button>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                <div><Label className='text-xs'>Cantidad</Label><Input type='number' min={1} value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value) || 1))} /></div>
                <div><Label className='text-xs'>Precio unitario</Label><Input type='number' min={0} value={customPrice} onChange={e => setCustomPrice(e.target.value)} /></div>
                <div><Label className='text-xs'>Total</Label><div className='h-10 flex items-center px-2 border border-border rounded-lg font-bold'>{formatCOP(totalVenta())}</div></div>
              </div>
              <div className='mt-1'><Label className='text-xs'>Notas (opcional)</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} className='h-20' /></div>
            </div>
          )}
          <Button onClick={handleRegisterSale} disabled={!selectedItem || submitting} className='w-full'>{submitting ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' />Guardando...</> : 'Registrar venta'}</Button>
        </CardContent>
      </Card>
      <Card className='card-gaming border-primary/20'>
        <CardHeader className='pb-3 bg-gradient-to-r from-primary/5 to-transparent rounded-t-xl'>
          <div className='flex flex-wrap justify-between gap-2 items-start'><div><CardTitle className='text-base flex items-center gap-2'><TrendingUp className='h-4 w-4 text-primary' />Historial de ventas</CardTitle><CardDescription>{filteredSales.length} ventas mostradas</CardDescription></div><div className='flex gap-1 flex-wrap'>{dateFilters.map(opt => (<Button key={opt.value} variant={dateFilter === opt.value ? 'default' : 'outline'} size='sm' onClick={() => setDateFilter(opt.value as any)}>{opt.icon ? <span className='mr-1'>{opt.icon}</span> : null}{opt.label}</Button>))}</div></div>
        </CardHeader>
        <CardContent className='space-y-2 pt-2'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            <div className='rounded-lg border border-border bg-card p-3'>
              <p className='text-[11px] text-muted-foreground'>Ventas mostradas</p>
              <p className='text-xl font-bold'>{filteredSales.length}</p>
            </div>
            <div className='rounded-lg border border-border bg-card p-3'>
              <p className='text-[11px] text-muted-foreground'>Total ventas</p>
              <p className='text-xl font-bold'>{filteredSales.reduce((acc: number, sale: any) => acc + Number(sale.total_price || 0), 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</p>
            </div>
          </div>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <div className='relative w-full md:w-[320px]'><Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' /><Input className='pl-9' placeholder='Buscar ventas por producto, usuario o total...' value={salesSearch} onChange={e => setSalesSearch(e.target.value)} /></div>
            <div className='flex gap-2'>
              <Button size='sm' variant={viewMode === 'table' ? 'default' : 'outline'} onClick={() => setViewMode('table')}>Ver tabla</Button>
              <Button size='sm' variant={viewMode === 'cards' ? 'default' : 'outline'} onClick={() => setViewMode('cards')}>Ver tarjetas grandes</Button>
            </div>
          </div>
          {error && <div className='text-sm text-destructive'>Error cargando ventas: {error}</div>}
          {loadingSales ? (<div className='flex justify-center py-8'><Loader2 className='h-6 w-6 animate-spin text-primary' /></div>) : filteredSales.length === 0 ? (<div className='text-center py-6 text-muted-foreground'>No hay ventas para mostrar</div>) : (
            viewMode === 'table' ? (
              <div className='overflow-x-auto border border-border rounded-xl'>
                <Table>
                  <TableHeader>
                    <TableRow className='bg-muted/30'>
                      <TableHead>Imagen</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Cant.</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.map((sale: any) => {
                      const saleDate = new Date(sale.created_at);
                      const itemName = sale.product_name || sale.description || 'Venta libre';
                      const category = sale.product_category || '—';
                      const image = sale.product_image || '';
                      const method = sale.payment_method || '—';
                      const userName = sale.seller_name || sale.sold_by || 'Desconocido';
                      const isFree = sale.item_type === 'producto' && !sale.item_id;
                      return (
                        <TableRow key={sale.id} className={isToday(saleDate) ? 'bg-primary/5' : ''}>
                          <TableCell><div className='h-10 w-10 rounded-lg overflow-hidden bg-muted border border-border'>{image ? <img src={image} alt={itemName} className='h-full w-full object-cover' /> : <div className='h-full w-full flex items-center justify-center text-[10px] text-muted-foreground'>Sin imagen</div>}</div></TableCell>
                          <TableCell><div className='flex items-center gap-2'><span>{itemName}</span>{!isFree ? getUnifiedBadge(sale.item_type) : <Badge variant='outline' className='text-[10px]'>Libre</Badge>}</div></TableCell>
                          <TableCell>{category}</TableCell>
                          <TableCell>{sale.quantity}</TableCell>
                          <TableCell>{(sale.total_price ?? 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</TableCell>
                          <TableCell className='capitalize'>{method}</TableCell>
                          <TableCell>{userName}</TableCell>
                          <TableCell className='text-xs text-muted-foreground'>{saleDate.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                {filteredSales.map((sale: any) => {
                  const saleDate = new Date(sale.created_at);
                  const itemName = sale.product_name || sale.description || 'Venta libre';
                  const category = sale.product_category || '—';
                  const image = sale.product_image || '';
                  const method = sale.payment_method || '—';
                  const userName = sale.seller_name || sale.sold_by || 'Desconocido';
                  const isFree = sale.item_type === 'producto' && !sale.item_id;
                  return (
                    <div key={sale.id} className='border border-border rounded-xl p-3 bg-card space-y-2'>
                      <div className='flex items-start gap-2'>
                        <div className='h-14 w-14 rounded-lg overflow-hidden bg-muted border border-border'>{image ? <img src={image} alt={itemName} className='h-full w-full object-cover' /> : <div className='h-full w-full flex items-center justify-center text-[10px] text-muted-foreground'>Sin imagen</div>}</div>
                        <div className='flex-1'>
                          <div className='flex items-center gap-1 flex-wrap'><p className='font-semibold line-clamp-1'>{itemName}</p>{!isFree ? getUnifiedBadge(sale.item_type) : <Badge variant='outline' className='text-[10px]'>Libre</Badge>}</div>
                          <p className='text-xs text-muted-foreground'>Categoría: {category}</p>
                          <p className='text-xs text-muted-foreground'>Usuario: {userName}</p>
                        </div>
                        <Badge variant='outline' className='text-[10px] capitalize'>{method}</Badge>
                      </div>
                      <div className='grid grid-cols-2 gap-2 text-sm'>
                        <div className='rounded-lg border border-border p-2 bg-background text-center'><p className='text-[11px] text-muted-foreground'>Cantidad</p><p className='font-semibold'>{sale.quantity}</p></div>
                        <div className='rounded-lg border border-border p-2 bg-background text-center'><p className='text-[11px] text-muted-foreground'>Total</p><p className='font-semibold'>{(sale.total_price ?? 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</p></div>
                      </div>
                      <p className='text-[11px] text-muted-foreground'>Fecha: {saleDate.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                  );
                })}
              </div>
            )
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default SalesManagementPanel;
