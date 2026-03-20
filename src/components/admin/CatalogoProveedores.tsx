import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  X,
  ShoppingCart,
  FileText,
  Copy,
  Check,
  ArrowLeftRight,
  Eye,
  EyeOff,
  Package,
  Store,
  Filter,
  LayoutGrid,
  List,
  CheckSquare,
  Square,
  BarChart2,
  Pencil,
  Wifi,
  Mic,
  Zap,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Save,
  History,
  Trash2,
  Loader2,
  Plus,
} from 'lucide-react';
import * as XLSX from 'xlsx';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProductoProveedor {
  id: string;
  proveedor: string;
  categoria: 'Stickers' | 'Controles' | 'Diademas' | 'Accesorios';
  subcategoria: string | null;
  nombre: string;
  variante: string | null;
  plataforma: string | null;
  precio: number;
  precio_hasta: number | null;
  tipo_conexion: string | null;
  compatibilidad: string | null;
  tiene_microfono: boolean | null;
  tiene_rgb: boolean | null;
  emoji: string | null;
  imagen_url: string | null;
  notas: string | null;
  activo: boolean;
}

interface ItemOrden {
  producto: ProductoProveedor;
  cantidad: number;
  precio_venta: number;
}

interface ProductoInventario {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  image: string | null;
  images: string[] | null;
  slug: string | null;
  description?: string | null;
  active?: boolean | null;
}

interface OrdenGuardada {
  id: string;
  proveedor: string;
  fecha_creacion: string;
  fecha_recepcion: string | null;
  estado: 'pendiente' | 'recibida';
  total_orden: number;
  items: Array<{
    productoId: string;
    nombre: string;
    categoria: string;
    variante: string | null;
    cantidadSolicitada: number;
    precioUnitario: number;
    precio_venta: number;
    subtotal: number;
  }>;
}

function getProductImage(p: ProductoInventario): string | null {
  return p.image || p.images?.[0] || null;
}

type EstadoComparativa = 'tiene_stock' | 'sin_stock' | 'no_tenemos';
type ViewMode = 'grid' | 'list';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCOP(value: number): string {
  return '$' + value.toLocaleString('es-CO', { maximumFractionDigits: 0 });
}

function formatPrecio(p: ProductoProveedor): string {
  if (p.precio_hasta) {
    return `${formatCOP(p.precio)} – ${formatCOP(p.precio_hasta)}`;
  }
  return formatCOP(p.precio);
}

function getCategoriaBadge(cat: string) {
  switch (cat) {
    case 'Controles':
      return { cls: 'bg-purple-500/20 text-purple-300 border-purple-500/30', dot: 'bg-purple-400' };
    case 'Diademas':
      return { cls: 'bg-teal-500/20 text-teal-300 border-teal-500/30', dot: 'bg-teal-400' };
    case 'Accesorios':
      return { cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30', dot: 'bg-amber-400' };
    case 'Stickers':
      return { cls: 'bg-blue-500/20 text-blue-300 border-blue-500/30', dot: 'bg-blue-400' };
    default:
      return { cls: 'bg-muted text-muted-foreground border-border', dot: 'bg-muted-foreground' };
  }
}

function fuzzyMatch(inventoryName: string, catalogName: string): boolean {
  const words = catalogName.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const inv = inventoryName.toLowerCase();
  return words.some((w) => inv.includes(w));
}

function getEstadoComparativa(producto: ProductoProveedor, inventario: ProductoInventario[]): EstadoComparativa {
  const targetCats: string[] = [];
  if (producto.categoria === 'Controles') targetCats.push('Controles');
  if (producto.categoria === 'Diademas' || producto.categoria === 'Accesorios') {
    targetCats.push('Accesorios', 'Perifericos', 'Diademas');
  }
  const matches = inventario.filter(
    (inv) => targetCats.includes(inv.category) && fuzzyMatch(inv.name, producto.nombre)
  );
  if (matches.length === 0) return 'no_tenemos';
  if (matches.some((m) => m.stock > 0)) return 'tiene_stock';
  return 'sin_stock';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="rounded-lg border border-cyan-500/20 bg-gray-900 p-3 text-center">
      <p className={`text-2xl font-bold font-rajdhani ${color || 'text-cyan-400'}`}>{value}</p>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-orbitron mt-0.5">{label}</p>
    </div>
  );
}

function EstadoBadge({ estado }: { estado: EstadoComparativa }) {
  if (estado === 'tiene_stock') return <span className="text-[10px] font-semibold text-green-400 bg-green-900/40 border border-green-500/30 px-1.5 py-0.5 rounded">🟢 En stock</span>;
  if (estado === 'sin_stock') return <span className="text-[10px] font-semibold text-yellow-500 bg-yellow-900/40 border border-yellow-500/30 px-1.5 py-0.5 rounded">🟡 Sin stock</span>;
  return <span className="text-[10px] font-semibold text-blue-400 bg-blue-900/40 border border-blue-500/30 px-1.5 py-0.5 rounded">🔵 Oportunidad</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const CatalogoProveedores: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [debouncedBusqueda, setDebouncedBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [plataformaFiltro, setPlataformaFiltro] = useState('Todos');
  const [proveedorFiltro, setProveedorFiltro] = useState('Todos');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [productos, setProductos] = useState<ProductoProveedor[]>([]);
  const [inventario, setInventario] = useState<ProductoInventario[]>([]);
  const [plataformas, setPlataformas] = useState<string[]>([]);
  const [proveedores, setProveedores] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [ordenItems, setOrdenItems] = useState<ItemOrden[]>(() => {
    try {
      const saved = localStorage.getItem('pedido_proveedor_v1');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [mostrarOrden, setMostrarOrden] = useState(false);
  const [copiadoTexto, setCopiadoTexto] = useState(false);
  const [exportadoXLSX, setExportadoXLSX] = useState(false);
  const [mostrarComparativa, setMostrarComparativa] = useState(false);
  const [soloOportunidades, setSoloOportunidades] = useState(false);

  // Comparativa — inventory‑side filters
  const [inventarioCatFiltro, setInventarioCatFiltro] = useState('Todos');
  const [inventarioBusqueda, setInventarioBusqueda] = useState('');

  // Comparativa — row selection + detail modal
  const [selectedProveedor, setSelectedProveedor] = useState<ProductoProveedor | null>(null);
  const [selectedInventario, setSelectedInventario] = useState<ProductoInventario | null>(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [copyingImage, setCopyingImage] = useState(false);
  const [editando, setEditando] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ProductoInventario>>({});
  const [guardando, setGuardando] = useState(false);

  const [ordenesGuardadas, setOrdenesGuardadas] = useState<OrdenGuardada[]>([]);
  const [cargandoOrdenes, setCargandoOrdenes] = useState(false);
  const [mostrarHistorialOrdenes, setMostrarHistorialOrdenes] = useState(false);
  const [guardandoOrden, setGuardandoOrden] = useState(false);
  const [confirmandoOrden, setConfirmandoOrden] = useState<string | null>(null);
  const [eliminandoOrden, setEliminandoOrden] = useState<string | null>(null);

  // Reference search in order modal
  const [refBusqueda, setRefBusqueda] = useState('');
  const [refResultados, setRefResultados] = useState<{ inventario: any[]; catalogo: any[] } | null>(null);
  const [refBuscando, setRefBuscando] = useState(false);
  const [refMostrar, setRefMostrar] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('pedido_proveedor_v1', JSON.stringify(ordenItems));
  }, [ordenItems]);

  // Debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedBusqueda(busqueda), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [busqueda]);

  // Reference search debounce
  useEffect(() => {
    if (refDebounceRef.current) clearTimeout(refDebounceRef.current);
    if (refBusqueda.trim().length < 2) {
      setRefResultados(null);
      return;
    }
    setRefBuscando(true);
    refDebounceRef.current = setTimeout(async () => {
      try {
        const { data, error } = await supabase.rpc('buscar_referencia_producto', { p_termino: refBusqueda.trim() });
        if (error) {
          console.error('Error buscando referencia:', error);
          setRefResultados(null);
        } else {
          setRefResultados(data as any);
        }
      } catch (err) {
        console.error('Error RPC:', err);
        setRefResultados(null);
      } finally {
        setRefBuscando(false);
      }
    }, 300);
    return () => { if (refDebounceRef.current) clearTimeout(refDebounceRef.current); };
  }, [refBusqueda]);

  // Meta (platforms, providers)
  useEffect(() => {
    const fetchMeta = async () => {
      const { data: plats } = await supabase
        .from('catalogo_proveedores').select('plataforma').eq('activo', true).not('plataforma', 'is', null);
      if (plats) setPlataformas(Array.from(new Set(plats.map((p: any) => p.plataforma).filter(Boolean))).sort() as string[]);

      const { data: provs } = await supabase
        .from('catalogo_proveedores').select('proveedor').eq('activo', true);
      if (provs) setProveedores(Array.from(new Set(provs.map((p: any) => p.proveedor).filter(Boolean))).sort() as string[]);
    };
    fetchMeta();
  }, []);

  // Products
  const fetchProductos = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('catalogo_proveedores').select('*').eq('activo', true)
      .order('categoria').order('subcategoria').order('nombre');
    if (debouncedBusqueda) {
      query = query.or(`nombre.ilike.%${debouncedBusqueda}%,variante.ilike.%${debouncedBusqueda}%,plataforma.ilike.%${debouncedBusqueda}%,subcategoria.ilike.%${debouncedBusqueda}%`);
    }
    if (categoriaFiltro !== 'Todos') query = query.eq('categoria', categoriaFiltro);
    if (plataformaFiltro !== 'Todos') query = query.eq('plataforma', plataformaFiltro);
    if (proveedorFiltro !== 'Todos') query = query.eq('proveedor', proveedorFiltro);
    const { data, error } = await query;
    if (!error && data) setProductos(data as ProductoProveedor[]);
    setLoading(false);
  }, [debouncedBusqueda, categoriaFiltro, plataformaFiltro, proveedorFiltro]);

  useEffect(() => { fetchProductos(); }, [fetchProductos]);

  // Inventory for comparison — load ALL active products so the user can filter freely
  useEffect(() => {
    if (!mostrarComparativa) return;
    supabase.from('products').select('id, name, category, stock, price, image, images, slug, description, active')
      .eq('active', true)
      .order('category').order('name')
      .then(({ data }) => { if (data) setInventario(data as ProductoInventario[]); });
  }, [mostrarComparativa]);

  const fetchOrdenesGuardadas = useCallback(async () => {
    setCargandoOrdenes(true);
    const { data, error } = await supabase
      .from('ordenes_proveedores')
      .select('*')
      .order('fecha_creacion', { ascending: false });
    if (!error && data) {
      setOrdenesGuardadas(data as any as OrdenGuardada[]);
    }
    setCargandoOrdenes(false);
  }, []);

  useEffect(() => {
    if (mostrarHistorialOrdenes) fetchOrdenesGuardadas();
  }, [mostrarHistorialOrdenes, fetchOrdenesGuardadas]);

  // ── Cart helpers ─────────────────────────────────────────────────────────────

  const isSeleccionado = (id: string) => ordenItems.some((i) => i.producto.id === id);

  const toggleSeleccion = (producto: ProductoProveedor) => {
    setOrdenItems((prev) => {
      if (prev.some((i) => i.producto.id === producto.id)) return prev.filter((i) => i.producto.id !== producto.id);
      return [...prev, { producto, cantidad: 1, precio_venta: 0 }];
    });
  };

  const updateCantidad = (id: string, cantidad: number) => {
    setOrdenItems((prev) => prev.map((item) => item.producto.id === id ? { ...item, cantidad: Math.max(1, cantidad) } : item));
  };

  const updatePrecioVenta = (id: string, precio_venta: number) => {
    setOrdenItems((prev) => prev.map((item) => item.producto.id === id ? { ...item, precio_venta: Math.max(0, precio_venta) } : item));
  };

  const removeItem = (id: string) => setOrdenItems((prev) => prev.filter((i) => i.producto.id !== id));

  const totalOrden = ordenItems.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);

  const generarTextoOrden = (): string => {
    const fecha = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const lineas = ordenItems.map((item) => {
      const nombre = item.producto.variante ? `${item.producto.nombre} (${item.producto.variante})` : item.producto.nombre;
      return `- ${nombre} x${item.cantidad} — ${formatCOP(item.producto.precio)} c/u`;
    }).join('\n');
    const proveedor = ordenItems[0]?.producto.proveedor?.toUpperCase() || 'PROVEEDOR';
    return `ORDEN ${proveedor} — ${fecha}\n${'─'.repeat(40)}\n${lineas}\nTOTAL: ${formatCOP(totalOrden)}`;
  };

  const copiarOrden = async () => {
    await navigator.clipboard.writeText(generarTextoOrden());
    setCopiadoTexto(true);
    setTimeout(() => setCopiadoTexto(false), 2000);
  };

  const guardarOrden = async () => {
    if (ordenItems.length === 0) return;
    setGuardandoOrden(true);
    const proveedor = ordenItems[0]?.producto.proveedor || 'Varios';
    const total = totalOrden;
    const itemsParaGuardar = ordenItems.map(item => ({
      productoId: item.producto.id,
      nombre: item.producto.nombre,
      categoria: item.producto.categoria,
      variante: item.producto.variante,
      cantidadSolicitada: item.cantidad,
      precioUnitario: item.producto.precio,
      precio_venta: item.precio_venta || 0,
      subtotal: item.producto.precio * item.cantidad,
    }));
    
    const { error } = await supabase.from('ordenes_proveedores').insert([{
      proveedor,
      total_orden: total,
      items: itemsParaGuardar as any,
      estado: 'pendiente'
    }]);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Orden guardada', description: 'La orden ha sido registrada exitosamente.' });
      setOrdenItems([]);
      setMostrarOrden(false);
      fetchOrdenesGuardadas();
    }
    setGuardandoOrden(false);
  };

  const confirmarRecepcionOrden = async (orden: OrdenGuardada) => {
    if (!confirm('¿Confirmar que se recibió toda la mercancía de esta orden?')) return;
    setConfirmandoOrden(orden.id);
    
    try {
        const { error } = await supabase.from('ordenes_proveedores').update({
          estado: 'recibida',
          fecha_recepcion: new Date().toISOString()
        }).eq('id', orden.id);
        
        if (error) throw error;

        // Get all actual products from inventory to match and update stock
        const { data: invData } = await supabase.from('products').select('id, name, stock');
        const productosExis = invData || [];

        // Update each item
        for (const item of orden.items) {
          const match = productosExis.find(p => p.name.toLowerCase() === item.nombre.toLowerCase());
          if (match) {
            await supabase.from('products').update({ stock: match.stock + item.cantidadSolicitada }).eq('id', match.id);
          }
        }
        
        toast({ title: 'Orden recibida', description: 'El inventario de los productos coincidentes ha sido actualizado.', variant: 'default' });
        fetchOrdenesGuardadas();
        
        // Refresh catalog or inventory if they are active
        if (mostrarComparativa) {
          supabase.from('products').select('*').eq('active', true).then(({ data }) => setInventario(data as ProductoInventario[]));
        }
    } catch(e: any) {
        toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
        setConfirmandoOrden(null);
    }
  };

  const eliminarOrdenGuardada = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta orden?')) return;
    setEliminandoOrden(id);
    try {
      const { error } = await supabase.from('ordenes_proveedores').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Orden eliminada', description: 'La orden ha sido borrada exitosamente.' });
      fetchOrdenesGuardadas();
    } catch(e: any) {
      toast({ title: 'Error al eliminar', description: e.message, variant: 'destructive' });
    } finally {
      setEliminandoOrden(null);
    }
  };

  const exportarOrdenXLSX = () => {
    if (ordenItems.length === 0) return;
    const rows = ordenItems.map((item, index) => ({
      '#': index + 1,
      Proveedor: item.producto.proveedor,
      Categoria: item.producto.categoria,
      Subcategoria: item.producto.subcategoria || '-',
      Producto: item.producto.nombre,
      Variante: item.producto.variante || '-',
      Plataforma: item.producto.plataforma || '-',
      Cantidad: item.cantidad,
      Precio: item.producto.precio,
      Total: item.producto.precio * item.cantidad,
      Notas: item.producto.notas || '-',
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orden de Compra');
    const fileName = `orden_compra_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    setExportadoXLSX(true);
    setTimeout(() => setExportadoXLSX(false), 2000);
  };

  const limpiarFiltros = () => {
    setBusqueda(''); setCategoriaFiltro('Todos'); setPlataformaFiltro('Todos');
    setProveedorFiltro('Todos'); setMostrarComparativa(false); setSoloOportunidades(false);
  };

  // Stats
  const totalProductos = productos.length;
  const totalProveedores = proveedores.length;
  const categorias = Array.from(new Set(productos.map((p) => p.categoria))).length;
  const enOrden = ordenItems.length;

  const puedeComparar = categoriaFiltro !== 'Todos' && categoriaFiltro !== 'Stickers';

  const productosParaComparar = soloOportunidades
    ? productos.filter((p) => getEstadoComparativa(p, inventario) === 'no_tenemos')
    : productos;

  // Auto‑suggest inventory category from proveedor filter
  const inventarioCatSugerida = (() => {
    if (inventarioCatFiltro !== 'Todos') return inventarioCatFiltro;
    if (categoriaFiltro === 'Controles') return 'Controles';
    if (categoriaFiltro === 'Diademas' || categoriaFiltro === 'Accesorios') return 'Accesorios';
    return 'Todos';
  })();

  const inventarioRelevante = inventario.filter((inv) => {
    const catMatch = inventarioCatSugerida === 'Todos' || inv.category === inventarioCatSugerida;
    const busqMatch = inventarioBusqueda === '' || inv.name.toLowerCase().includes(inventarioBusqueda.toLowerCase());
    return catMatch && busqMatch;
  });

  // Margin calculation helper
  const calcMargen = (precioVenta: number, costoProveedor: number) => {
    const margen = precioVenta - costoProveedor;
    const pct = costoProveedor > 0 ? Math.round((margen / costoProveedor) * 100) : 0;
    const color = pct >= 40 ? 'text-green-400' : pct >= 20 ? 'text-yellow-400' : 'text-red-400';
    return { margen, pct, color };
  };

  const verProducto = (p: ProductoInventario) => {
    const ruta = p.slug ? `/productos/${p.slug}` : `/productos/${p.id}`;
    window.open(ruta, '_blank');
  };

  const guardarEdicion = async () => {
    if (!selectedInventario) return;
    setGuardando(true);
    const { error } = await supabase
      .from('products')
      .update({
        name: editForm.name,
        category: editForm.category,
        price: editForm.price,
        stock: editForm.stock,
        active: editForm.active,
      })
      .eq('id', selectedInventario.id);

    if (!error) {
      setSelectedInventario((prev) => (prev ? { ...prev, ...editForm } : prev));
      setInventario((prev) => prev.map((p) => (p.id === selectedInventario.id ? { ...p, ...editForm } : p)));
      setEditando(false);
      toast({ title: 'Producto actualizado' });
    } else {
      toast({ title: 'Error', description: 'No se pudo guardar', variant: 'destructive' });
    }
    setGuardando(false);
  };

  const copiarImagenAlCatalogo = async () => {
    if (!selectedProveedor || !selectedInventario) return;
    const imagenInventario = getProductImage(selectedInventario);
    if (!imagenInventario) return;
    setCopyingImage(true);
    try {
      const { error } = await supabase
        .from('catalogo_proveedores')
        .update({ imagen_url: imagenInventario })
        .eq('id', selectedProveedor.id);
      if (error) throw error;
      setSelectedProveedor((prev) => (prev ? { ...prev, imagen_url: imagenInventario } : prev));
      setProductos((prev) => prev.map((p) => (p.id === selectedProveedor.id ? { ...p, imagen_url: imagenInventario } : p)));
      toast({ title: 'Imagen actualizada', description: 'La imagen se guardó en el catálogo del proveedor.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'No se pudo actualizar la imagen', variant: 'destructive' });
    } finally {
      setCopyingImage(false);
    }
  };

  // ─── Product Card ──────────────────────────────────────────────────────────

  const renderCard = (prod: ProductoProveedor) => {
    const sel = isSeleccionado(prod.id);
    const badge = getCategoriaBadge(prod.categoria);
    return (
      <Card
        key={prod.id}
        className={`bg-gray-900/60 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${
          sel ? 'border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border border-cyan-500/20 hover:border-cyan-500/40 hover:bg-gray-900/80'
        }`}
        onClick={() => toggleSeleccion(prod)}
      >
        {/* Image / Emoji area */}
        <div className="relative aspect-square bg-gray-950 flex items-center justify-center overflow-hidden border-b border-cyan-500/10">
          {prod.imagen_url ? (
            <img src={prod.imagen_url} alt={prod.nombre} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          ) : (
            <span className="text-5xl hover:scale-110 transition-transform duration-300">{prod.emoji || '📦'}</span>
          )}
          {/* Selection overlay */}
          <div className={`absolute inset-0 transition-all duration-200 ${sel ? 'bg-cyan-500/10' : 'bg-transparent'}`} />
          {/* Checkbox indicator */}
          <div className={`absolute top-2 right-2 transition-all duration-200 ${sel ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            {sel ? (
              <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                <Check className="h-3.5 w-3.5 text-gray-950 font-bold" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-cyan-500/60 bg-gray-950/70" />
            )}
          </div>
          {/* Category badge on top-left */}
          <div className="absolute top-2 left-2">
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badge.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
              {prod.categoria}
            </span>
          </div>
        </div>

        <CardContent className="p-3 space-y-1.5 bg-gray-900/40">
          <h4 className="text-sm font-semibold leading-tight line-clamp-2 text-gray-200 font-rajdhani">{prod.nombre}</h4>
          {prod.variante && (
            <p className="text-[11px] text-gray-400 truncate">{prod.variante}</p>
          )}
          <div className="flex items-center justify-between gap-1">
            <span className="text-sm font-bold text-cyan-400 font-orbitron">{formatPrecio(prod)}</span>
            {prod.plataforma && (
              <Badge variant="outline" className="text-[9px] h-4 px-1 border-cyan-500/30 text-cyan-300 bg-cyan-500/10">{prod.plataforma}</Badge>
            )}
          </div>
          <p className="text-[10px] text-gray-500 truncate">{prod.proveedor}</p>
          <Button
            size="sm"
            className={`w-full h-8 text-xs mt-1 transition-all rounded-lg font-rajdhani font-semibold ${
              sel 
                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400' 
                : 'bg-transparent border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50'
            }`}
            onClick={(e) => { e.stopPropagation(); toggleSeleccion(prod); }}
          >
            {sel ? (
              <><CheckSquare className="h-3 w-3 mr-1" />Seleccionado</>
            ) : (
              <><Square className="h-3 w-3 mr-1" />Agregar</>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  // ─── List Row ──────────────────────────────────────────────────────────────

  const renderListRow = (prod: ProductoProveedor) => {
    const sel = isSeleccionado(prod.id);
    const badge = getCategoriaBadge(prod.categoria);
    return (
      <div
        key={prod.id}
        onClick={() => toggleSeleccion(prod)}
        className={`bg-gray-900/60 border border-cyan-500/20 rounded-lg p-3 flex items-center gap-3 transition-all duration-200 cursor-pointer ${
          sel ? 'border-cyan-400 bg-cyan-500/5' : 'hover:border-cyan-500/40 hover:bg-gray-900/80'
        }`}
      >
        {/* Thumbnail */}
        <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center bg-gray-950 border border-cyan-500/10 overflow-hidden">
          {prod.imagen_url ? (
            <img src={prod.imagen_url} alt={prod.nombre} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl">{prod.emoji || '📦'}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold truncate text-gray-200 font-rajdhani">{prod.nombre}</h4>
            <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border ${badge.cls}`}>
              {prod.categoria}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 flex-wrap">
            {prod.variante && <span>{prod.variante}</span>}
            {prod.variante && prod.subcategoria && <span>·</span>}
            {prod.subcategoria && <span>{prod.subcategoria}</span>}
            {prod.plataforma && <><span>·</span><Badge variant="outline" className="text-[9px] h-4 px-1 border-cyan-500/30 text-cyan-300 bg-cyan-500/10">{prod.plataforma}</Badge></>}
          </div>
        </div>

        {/* Price */}
        <span className="text-sm font-bold text-cyan-400 whitespace-nowrap font-orbitron">{formatPrecio(prod)}</span>

        {/* Provider */}
        <span className="text-xs text-gray-500 hidden lg:block w-28 truncate text-right">{prod.proveedor}</span>

        {/* Action */}
        <Button
          size="sm"
          className={`h-8 px-4 text-xs flex-shrink-0 transition-all rounded-lg font-rajdhani font-semibold ${
            sel 
              ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400' 
              : 'bg-transparent border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50'
          }`}
          onClick={(e) => { e.stopPropagation(); toggleSeleccion(prod); }}
        >
          {sel ? 'Quitar' : '+ Orden'}
        </Button>
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 bg-gray-950 border border-cyan-500/20 rounded-xl p-4">

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total catálogo" value={totalProductos} color="" />
        <StatCard label="Proveedores" value={totalProveedores} color="text-cyan-400" />
        <StatCard label="Categorías" value={categorias} color="text-purple-400" />
        <StatCard label="En orden" value={enOrden} color="text-green-400" />
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500/50 pointer-events-none" />
          <Input
            placeholder="Buscar por nombre, variante, plataforma..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10 h-10 bg-gray-900 border border-cyan-500/30 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 w-full"
          />
          {busqueda && (
            <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Category */}
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-cyan-500/50 pointer-events-none" />
            <select
              value={categoriaFiltro}
              onChange={(e) => { setCategoriaFiltro(e.target.value); setMostrarComparativa(false); setSoloOportunidades(false); }}
              className="h-10 pl-8 pr-3 border border-cyan-500/30 bg-gray-900 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 appearance-none cursor-pointer"
            >
              <option value="Todos">Todas</option>
              <option value="Stickers">Stickers</option>
              <option value="Controles">Controles</option>
              <option value="Diademas">Diademas</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </div>

          {/* Platform */}
          <select
            value={plataformaFiltro}
            onChange={(e) => setPlataformaFiltro(e.target.value)}
            className="h-10 px-3 border border-cyan-500/30 bg-gray-900 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 appearance-none cursor-pointer"
          >
            <option value="Todos">Plataforma</option>
            {plataformas.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

          {/* Provider */}
          <select
            value={proveedorFiltro}
            onChange={(e) => setProveedorFiltro(e.target.value)}
            className="h-10 px-3 border border-cyan-500/30 bg-gray-900 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 appearance-none cursor-pointer"
          >
            <option value="Todos">Proveedor</option>
            {proveedores.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

          {/* View toggle */}
          <div className="flex border border-cyan-500/30 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-900 text-gray-500 hover:text-cyan-400'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-900 text-gray-500 hover:text-cyan-400'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick filter pills ── */}
      <div className="flex flex-wrap gap-2">
        {['Stickers', 'Controles', 'Diademas', 'Accesorios'].map((cat) => {
          const badge = getCategoriaBadge(cat);
          const active = categoriaFiltro === cat;
          return (
            <button
              key={cat}
              onClick={() => { setCategoriaFiltro(active ? 'Todos' : cat); setMostrarComparativa(false); setSoloOportunidades(false); }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                active ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : `${badge.cls} hover:border-cyan-500/30`
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
              {cat}
            </button>
          );
        })}

        {/* Compare button */}
        {puedeComparar && (
          <button
            onClick={() => { setMostrarComparativa((v) => !v); setSoloOportunidades(false); setMostrarHistorialOrdenes(false); }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              mostrarComparativa
                ? 'bg-accent text-accent-foreground border-accent'
                : 'bg-background text-muted-foreground border-border hover:border-accent/50 hover:text-accent'
            }`}
          >
            <ArrowLeftRight className="h-3 w-3" />
            Comparar inventario
          </button>
        )}

        {/* Historial Órdenes pill */}
        <button
          onClick={() => { setMostrarHistorialOrdenes((v) => !v); setMostrarComparativa(false); }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            mostrarHistorialOrdenes
              ? 'bg-purple-500 text-white border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
              : 'bg-background text-muted-foreground border-border hover:border-purple-500/50 hover:text-purple-400'
          }`}
        >
          <History className="h-3 w-3" />
          Órdenes Guardadas
        </button>

        {/* Cart pill */}
        {ordenItems.length > 0 && (
          <button
            onClick={() => setMostrarOrden(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors"
          >
            <ShoppingCart className="h-3 w-3" />
            Ver orden ({ordenItems.length})
          </button>
        )}

        {/* Clear */}
        {(busqueda || categoriaFiltro !== 'Todos' || plataformaFiltro !== 'Todos' || proveedorFiltro !== 'Todos') && (
          <button
            onClick={limpiarFiltros}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <X className="h-3 w-3" />
            Limpiar
          </button>
        )}
      </div>

      {/* ── Results count ── */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{productos.length}</span> producto{productos.length !== 1 ? 's' : ''} encontrado{productos.length !== 1 ? 's' : ''}
        </p>
        {mostrarComparativa && puedeComparar && (
          <button
            onClick={() => setSoloOportunidades((v) => !v)}
            className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${soloOportunidades ? 'text-blue-400' : 'text-muted-foreground hover:text-blue-400'}`}
          >
            {soloOportunidades ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            Solo oportunidades
          </button>
        )}
      </div>

      {/* ── Main layout: products + comparativa + historial ── */}
      {mostrarHistorialOrdenes ? (
        /* ── Historial Órdenes View ── */
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-lg font-bold tracking-wider uppercase text-purple-400 flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <History className="h-5 w-5" />
              Historial de Órdenes Guardadas
            </h3>
            <Button variant="outline" size="sm" onClick={() => fetchOrdenesGuardadas()}>
              Actualizar
            </Button>
          </div>
          
          {cargandoOrdenes ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
            </div>
          ) : ordenesGuardadas.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl bg-card/20">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium text-lg">No hay órdenes guardadas</p>
              <p className="text-sm mt-1">Cuando guardes una orden de compra aparecerá aquí.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {ordenesGuardadas.map(orden => (
                <Card key={orden.id} className="overflow-hidden border-border/50 bg-card/50">
                  <div className={`p-3 text-xs font-bold uppercase tracking-widest flex items-center justify-between ${
                    orden.estado === 'recibida' ? 'bg-green-500/10 text-green-400 border-b border-green-500/20' : 'bg-primary/10 text-primary border-b border-primary/20'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="opacity-70">Fecha:</span> 
                      {new Date(orden.fecha_creacion).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      {orden.estado === 'recibida' ? (
                        <><CheckCircle2 className="h-4 w-4" /> RECIBIDA</>
                      ) : (
                        <><Clock className="h-4 w-4" /> PENDIENTE</>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                      <div>
                        <h4 className="text-lg font-bold">Proveedor: {orden.proveedor}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {orden.items.length} producto{orden.items.length !== 1 ? 's' : ''} en la orden
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Total Orden</p>
                        <p className="text-2xl font-bold text-primary">{formatCOP(orden.total_orden)}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-4 opacity-50" />
                    
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Detalle de items</p>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {orden.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 rounded bg-background/50 border border-border/40 text-sm">
                            <span className="font-bold text-accent">{item.cantidadSolicitada}x</span>
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-medium">{item.nombre}</p>
                              {item.variante && <p className="text-[10px] text-muted-foreground truncate">{item.variante}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {orden.estado === 'pendiente' && (
                      <div className="mt-5 flex justify-end gap-3">
                        <Button
                          variant="destructive"
                          onClick={() => eliminarOrdenGuardada(orden.id)}
                          disabled={eliminandoOrden === orden.id || confirmandoOrden === orden.id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {eliminandoOrden === orden.id ? 'Eliminando...' : 'Eliminar Orden'}
                        </Button>
                        <Button 
                          onClick={() => confirmarRecepcionOrden(orden)}
                          disabled={confirmandoOrden === orden.id || eliminandoOrden === orden.id}
                          className="bg-green-600 hover:bg-green-500 text-white"
                        >
                          {confirmandoOrden === orden.id ? 'Confirmando...' : 'Confirmar Recibido'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : mostrarComparativa ? (
        /* ── Comparativa view ── */
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">

            {/* ── Left column: Catalog ── */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5" /> Catálogo Proveedor
              </h3>
              <ScrollArea className="h-[580px] rounded-xl border border-border pr-1">
                <div className="space-y-1.5 p-2">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)
                  ) : productosParaComparar.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />Sin productos
                    </div>
                  ) : (
                    productosParaComparar.map((prod) => {
                      const estado = getEstadoComparativa(prod, inventario);
                      const badge = getCategoriaBadge(prod.categoria);
                      const isChecked = selectedProveedor?.id === prod.id;
                      return (
                        <div
                          key={prod.id}
                          onClick={() => setSelectedProveedor(isChecked ? null : prod)}
                          className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                            isChecked
                              ? 'border-primary/60 bg-primary/8'
                              : estado === 'no_tenemos'
                              ? 'border-blue-500/30 bg-blue-600/5 hover:bg-blue-600/8'
                              : 'border-border bg-background/50 hover:bg-muted/20'
                          }`}
                        >
                          {/* Checkbox */}
                          <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                            isChecked ? 'bg-primary border-primary' : 'border-muted-foreground'
                          }`}>
                            {isChecked && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                          </div>
                          {/* Thumbnail */}
                          <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center bg-muted/30 overflow-hidden">
                            {prod.imagen_url
                              ? <img src={prod.imagen_url} alt={prod.nombre} className="w-full h-full object-cover" />
                              : <span className="text-xl">{prod.emoji || '📦'}</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{prod.nombre}</p>
                            {prod.variante && <p className="text-[10px] text-muted-foreground truncate">{prod.variante}</p>}
                            <span className={`inline-flex text-[9px] font-medium px-1 py-0.5 rounded border ${badge.cls}`}>{prod.categoria}</span>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-bold text-primary">{formatPrecio(prod)}</p>
                            <EstadoBadge estado={estado} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* ── Right column: Inventory ── */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" /> Nuestro inventario
              </h3>

              {/* Inventory‑side filters */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Buscar en inventario..."
                    value={inventarioBusqueda}
                    onChange={(e) => setInventarioBusqueda(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 border border-input bg-background rounded-md text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {inventarioBusqueda && (
                    <button onClick={() => setInventarioBusqueda('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <select
                  value={inventarioCatFiltro}
                  onChange={(e) => setInventarioCatFiltro(e.target.value)}
                  className="h-8 px-2 border border-input bg-background rounded-md text-xs appearance-none cursor-pointer"
                >
                  <option value="Todos">Todas</option>
                  <option value="Controles">Controles</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Perifericos">Periféricos</option>
                  <option value="Consolas">Consolas</option>
                  <option value="Juegos PS4">Juegos PS4</option>
                  <option value="Juegos PS5">Juegos PS5</option>
                  <option value="Juegos PS3">Juegos PS3</option>
                  <option value="Figuras">Figuras</option>
                  <option value="Repuestos">Repuestos</option>
                </select>
              </div>

              <ScrollArea className="h-[534px] rounded-xl border border-border pr-1">
                <div className="space-y-1.5 p-2">
                  {inventarioRelevante.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />Sin resultados
                    </div>
                  ) : (
                    inventarioRelevante.map((inv) => {
                      const img = getProductImage(inv);
                      const isChecked = selectedInventario?.id === inv.id;
                      return (
                        <div
                          key={inv.id}
                          onClick={() => setSelectedInventario(isChecked ? null : inv)}
                          className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                            isChecked
                              ? 'border-accent/60 bg-accent/8'
                              : 'border-border bg-background/50 hover:bg-muted/20'
                          }`}
                        >
                          {/* Checkbox */}
                          <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                            isChecked ? 'bg-accent border-accent' : 'border-muted-foreground'
                          }`}>
                            {isChecked && <Check className="h-2.5 w-2.5 text-accent-foreground" />}
                          </div>
                          {/* Thumbnail */}
                          <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center bg-muted/30 overflow-hidden">
                            {img
                              ? <img src={img} alt={inv.name} className="w-full h-full object-cover" />
                              : <Package className="h-4 w-4 text-muted-foreground" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{inv.name}</p>
                            <p className="text-[10px] text-muted-foreground">{inv.category}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-bold text-green-400">{formatCOP(inv.price)}</p>
                            <span className={`text-[10px] font-semibold ${
                              inv.stock === 0 ? 'text-red-400' : inv.stock <= 2 ? 'text-yellow-400' : 'text-green-400'
                            }`}>Stock: {inv.stock}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* ── Sticky action bar when something is selected ── */}
          {(selectedProveedor || selectedInventario) && (
            <div className="sticky bottom-0 flex items-center justify-between gap-3 p-3 rounded-xl border border-accent/40 bg-card/90 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-3 text-sm">
                {selectedProveedor && (
                  <span className="flex items-center gap-1.5 text-primary">
                    <Store className="h-3.5 w-3.5" />
                    <span className="font-medium truncate max-w-[160px]">{selectedProveedor.nombre}</span>
                  </span>
                )}
                {selectedProveedor && selectedInventario && <span className="text-muted-foreground">vs</span>}
                {selectedInventario && (
                  <span className="flex items-center gap-1.5 text-accent">
                    <Package className="h-3.5 w-3.5" />
                    <span className="font-medium truncate max-w-[160px]">{selectedInventario.name}</span>
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => { setSelectedProveedor(null); setSelectedInventario(null); }}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <Button
                  size="sm"
                  className="h-8 text-xs bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => setMostrarDetalle(true)}
                >
                  <BarChart2 className="h-3.5 w-3.5 mr-1.5" />
                  Ver comparativa detallada
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Normal view with optional cart sidebar */
        <div className="flex gap-4">
          {/* Products area */}
          <div className="flex-1 min-w-0">
            {loading ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="aspect-square w-full" />
                      <CardContent className="p-3 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
                </div>
              )
            ) : productos.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No se encontraron productos</p>
                <p className="text-sm">Intenta cambiar los filtros de búsqueda</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {productos.map(renderCard)}
              </div>
            ) : (
              <div className="space-y-2">
                {productos.map(renderListRow)}
              </div>
            )}
          </div>

          {/* Cart sidebar */}
          {ordenItems.length > 0 && (
            <div className="w-full lg:w-80 flex-shrink-0 bg-gray-950 border border-cyan-500/20 rounded-xl flex flex-col overflow-hidden lg:sticky lg:top-4 max-h-[40vh] lg:max-h-[calc(100vh-160px)]">
              {/* Header: Compact layout */}
              <div className="p-3 border-b border-cyan-500/20 flex items-center justify-between gap-2 bg-gray-900/80">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-cyan-400" />
                  <h3 className="font-orbitron text-cyan-400 text-sm uppercase tracking-wider">
                    Orden
                  </h3>
                  <span className="text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-full w-5 h-5 flex items-center justify-center">
                    {ordenItems.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-cyan-400 hidden sm:block">{formatCOP(totalOrden)}</span>
                  <Button
                    className="bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 rounded-lg px-3 py-1.5 font-rajdhani font-semibold transition-all text-xs h-8"
                    onClick={() => setMostrarOrden(true)}
                  >
                    Ver completa
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-2 hidden lg:block">
                <div className="space-y-2">
                  {ordenItems.map((item) => (
                    <div key={item.producto.id} className="p-2.5 rounded-lg border border-cyan-500/20 bg-gray-900/60 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold leading-tight truncate text-gray-200">{item.producto.nombre}</p>
                          {item.producto.variante && (
                            <p className="text-[10px] text-gray-500 truncate">{item.producto.variante}</p>
                          )}
                        </div>
                        <button onClick={() => removeItem(item.producto.id)} className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-500">Cant:</span>
                          <Input
                            type="number" min={1} value={item.cantidad}
                            onChange={(e) => updateCantidad(item.producto.id, parseInt(e.target.value) || 1)}
                            className="h-6 w-12 text-xs text-center px-1 bg-gray-900 border border-cyan-500/30 rounded-md text-gray-200 focus:outline-none focus:border-cyan-400"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <span className="text-xs font-bold text-cyan-400">{formatCOP(item.producto.precio * item.cantidad)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      )}

      {/* ── Comparativa Detallada Modal ── */}
      <Dialog open={mostrarDetalle} onOpenChange={setMostrarDetalle}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col card-gaming">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-wider uppercase text-primary flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <BarChart2 className="h-5 w-5" />
              Comparativa Detallada
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-2 gap-4 py-2">

              {/* Card proveedor */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 overflow-hidden">
                <div className="p-2 bg-primary/10 text-xs font-bold uppercase tracking-widest text-primary text-center">
                  📦 Del proveedor
                </div>
                {selectedProveedor ? (
                  <div className="p-4 space-y-3">
                    {/* Image */}
                    <div className="w-full aspect-video rounded-lg bg-muted/30 flex items-center justify-center overflow-hidden">
                      {selectedProveedor.imagen_url
                        ? <img src={selectedProveedor.imagen_url} alt={selectedProveedor.nombre} className="w-full h-full object-cover" />
                        : <span className="text-6xl">{selectedProveedor.emoji || '📦'}</span>}
                    </div>
                    {/* Info */}
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base leading-tight">{selectedProveedor.nombre}</h3>
                      {selectedProveedor.variante && (
                        <p className="text-sm text-muted-foreground">{selectedProveedor.variante}</p>
                      )}
                      {selectedProveedor.plataforma && (
                        <Badge variant="outline" className="text-[10px]">{selectedProveedor.plataforma}</Badge>
                      )}
                      <div className="pt-1 space-y-1">
                        <p className="text-2xl font-bold text-primary">{formatPrecio(selectedProveedor)}</p>
                        {selectedProveedor.proveedor && (
                          <p className="text-xs text-muted-foreground">Proveedor: {selectedProveedor.proveedor}</p>
                        )}
                      </div>
                      {/* Feature badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedProveedor.tiene_rgb && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            <Zap className="h-2.5 w-2.5" /> RGB
                          </span>
                        )}
                        {selectedProveedor.tiene_microfono && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            <Mic className="h-2.5 w-2.5" /> Micrófono
                          </span>
                        )}
                        {selectedProveedor.tipo_conexion && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            <Wifi className="h-2.5 w-2.5" /> {selectedProveedor.tipo_conexion}
                          </span>
                        )}
                      </div>
                      {(selectedInventario && getProductImage(selectedInventario)) && (
                        <Button
                          className="w-full mt-2"
                          size="sm"
                          variant={selectedProveedor.imagen_url ? 'outline' : 'default'}
                          onClick={copiarImagenAlCatalogo}
                          disabled={copyingImage}
                        >
                          {copyingImage ? 'Guardando...' : selectedProveedor.imagen_url ? '🔄 Reemplazar imagen' : '📷 Usar imagen de mi producto'}
                        </Button>
                      )}
                      {selectedProveedor.notas && (
                        <p className="text-[11px] text-muted-foreground italic border-l-2 border-primary/30 pl-2">{selectedProveedor.notas}</p>
                      )}
                    </div>
                    {/* Add to order button */}
                    <Button
                      className="w-full mt-2"
                      variant={isSeleccionado(selectedProveedor.id) ? 'default' : 'outline'}
                      onClick={() => { toggleSeleccion(selectedProveedor); }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {isSeleccionado(selectedProveedor.id) ? 'En la orden ✓' : '+ Agregar a orden'}
                    </Button>
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    <Store className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    Selecciona un producto del catálogo
                  </div>
                )}
              </div>

              {/* Card inventario */}
              <div className="rounded-xl border border-accent/30 bg-accent/5 overflow-hidden">
                <div className="p-2 bg-accent/10 text-xs font-bold uppercase tracking-widest text-accent text-center">
                  🏪 En nuestro inventario
                </div>
                {selectedInventario ? (
                  editando ? (
                    <div className="p-4 space-y-3">
                      <h3 className="text-base font-bold">Editar producto</h3>
                      <div className="space-y-2 text-xs">
                        <div>
                          <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Nombre</Label>
                          <Input
                            value={editForm.name ?? ''}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Categoría</Label>
                          <select
                            value={editForm.category ?? ''}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                            className="h-9 w-full text-sm rounded-md border border-input bg-background px-2"
                          >
                            <option value="Controles">Controles</option>
                            <option value="Accesorios">Accesorios</option>
                            <option value="Periféricos">Periféricos</option>
                            <option value="Consolas">Consolas</option>
                            <option value="Juegos PS4">Juegos PS4</option>
                            <option value="Juegos PS5">Juegos PS5</option>
                            <option value="Juegos PS3">Juegos PS3</option>
                            <option value="Figuras">Figuras</option>
                            <option value="Repuestos">Repuestos</option>
                            <option value="Otros">Otros</option>
                          </select>
                        </div>
                        <div>
                          <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Precio</Label>
                          <Input
                            type="number"
                            value={editForm.price ?? 0}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Stock</Label>
                          <Input
                            type="number"
                            value={editForm.stock ?? 0}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, stock: Number(e.target.value) }))}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Descripción</Label>
                          <Textarea
                            value={editForm.description ?? ''}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                            className="h-20 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={Boolean(editForm.active)}
                            onCheckedChange={(checked) => setEditForm((prev) => ({ ...prev, active: checked }))}
                          />
                          <span className="text-xs text-muted-foreground">Activo</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button className="flex-1 h-8 text-xs" onClick={guardarEdicion} disabled={guardando}>
                          {guardando ? 'Guardando...' : 'Guardar'}
                        </Button>
                        <Button className="flex-1 h-8 text-xs" variant="ghost" onClick={() => setEditando(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {/* Image */}
                      <div className="w-full aspect-video rounded-lg bg-muted/30 flex items-center justify-center overflow-hidden">
                        {(() => { const img = getProductImage(selectedInventario); return img
                          ? <img src={img} alt={selectedInventario.name} className="w-full h-full object-cover" />
                          : <Package className="h-12 w-12 text-muted-foreground opacity-40" />;
                        })()}
                      </div>
                      {/* Info */}
                      <div className="space-y-1.5">
                        <h3 className="font-bold text-base leading-tight">{selectedInventario.name}</h3>
                        <p className="text-xs text-muted-foreground">{selectedInventario.category}</p>
                        <p className="text-2xl font-bold text-green-400">{formatCOP(selectedInventario.price)}</p>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          selectedInventario.stock === 0
                            ? 'bg-red-500/20 text-red-300 border-red-500/30'
                            : selectedInventario.stock <= 2
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            : 'bg-green-500/20 text-green-300 border-green-500/30'
                        }`}>
                          {selectedInventario.stock === 0 && <AlertTriangle className="h-3 w-3" />}
                          {selectedInventario.stock} uds en stock
                        </div>
                      </div>
                      {/* Action buttons */}
                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8 text-xs border-accent/40 text-accent hover:bg-accent/10"
                          onClick={() => {
                            setEditForm({ ...selectedInventario });
                            setEditando(true);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1" /> Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8 text-xs"
                          onClick={() => verProducto(selectedInventario)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> Ver
                        </Button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    Selecciona un producto del inventario
                  </div>
                )}
              </div>
            </div>

            {/* ── Margin footer (only when both selected) ── */}
            {selectedProveedor && selectedInventario && (() => {
              const { margen, pct, color } = calcMargen(selectedInventario.price, selectedProveedor.precio);
              return (
                <div className={`mx-0 mt-3 p-4 rounded-xl border ${
                  pct >= 40 ? 'border-green-500/30 bg-green-500/5' :
                  pct >= 20 ? 'border-yellow-500/30 bg-yellow-500/5' :
                  'border-red-500/30 bg-red-500/5'
                }`}>
                  <p className={`text-sm font-bold ${color}`}>
                    💡 Margen potencial: {formatCOP(margen)} ({pct}% sobre costo)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Costo proveedor: {formatCOP(selectedProveedor.precio)} · Precio venta: {formatCOP(selectedInventario.price)}
                  </p>
                </div>
              );
            })()}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* ── Order Modal ── */}
      <Dialog open={mostrarOrden} onOpenChange={setMostrarOrden}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col bg-gray-950 border border-cyan-500/20 rounded-xl p-3 md:p-4 gap-3">
          {/* Header Layout (Problema 1) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-900/40 p-3 rounded-lg border border-cyan-500/10 relative z-50">
            <DialogHeader className="m-0 space-y-0 text-left">
              <DialogTitle className="font-orbitron text-cyan-400 text-sm uppercase tracking-wider flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Orden de Compra
              </DialogTitle>
            </DialogHeader>

            {/* ── Reference Search (Problema 3) ── */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500/50" />
              <Input
                placeholder="Buscar referencia..."
                value={refBusqueda}
                onChange={(e) => { setRefBusqueda(e.target.value); setRefMostrar(true); }}
                onFocus={() => setRefMostrar(true)}
                className="pl-9 h-10 w-full bg-gray-900 border border-cyan-500/30 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
              />
              {refBusqueda && (
                <button onClick={() => { setRefBusqueda(''); setRefResultados(null); setRefMostrar(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400">
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Reference Search Results Popup (Problema 3) */}
              {refMostrar && refBusqueda.trim().length >= 2 && (
                <div className="absolute top-[48px] right-0 w-[calc(100vw-48px)] max-w-sm md:w-[400px] z-[100] border border-cyan-500/30 rounded-xl bg-gray-950 max-h-80 overflow-y-auto shadow-[0_4px_25px_rgba(6,182,212,0.2)]">
                  {refBuscando ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                    </div>
                  ) : refResultados ? (
                    <div className="p-2 space-y-3">
                      {/* Sección 1: Inventario */}
                      {(refResultados.inventario || []).length > 0 && (
                        <div>
                          <p className="font-orbitron text-[10px] text-green-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1">
                            <Package className="h-3 w-3" /> En tu inventario
                          </p>
                          <div className="space-y-1">
                            {(refResultados.inventario || []).map((inv: any) => (
                              <button
                                key={inv.id}
                                className="w-full text-left flex items-center gap-3 p-2 rounded-lg bg-gray-900/60 border border-cyan-500/10 hover:border-cyan-500/40 min-h-[60px] transition-colors"
                                onClick={() => {
                                  const syntheticProd: ProductoProveedor = {
                                    id: `inv-${inv.id}`, proveedor: 'Inventario', categoria: inv.category || 'Otros' as any, subcategoria: null,
                                    nombre: inv.name, variante: null, plataforma: null, precio: 0, precio_hasta: null,
                                    tipo_conexion: null, compatibilidad: null, tiene_microfono: null, tiene_rgb: null,
                                    emoji: null, imagen_url: inv.image || null, notas: null, activo: true,
                                  };
                                  setOrdenItems(prev => {
                                    if (prev.some(i => i.producto.id === syntheticProd.id)) return prev;
                                    return [...prev, { producto: syntheticProd, cantidad: 1, precio_venta: inv.price || 0 }];
                                  });
                                  setRefBusqueda(''); setRefResultados(null); setRefMostrar(false);
                                  toast({ title: 'Agregado', description: inv.name });
                                }}
                              >
                                <div className="w-10 h-10 rounded-md bg-gray-950 overflow-hidden shrink-0 border border-cyan-500/20">
                                  {inv.image ? <img src={inv.image} alt={inv.name} className="h-full w-full object-cover" />
                                    : <div className="h-full w-full flex items-center justify-center"><Package className="h-4 w-4 text-gray-500" /></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-rajdhani text-sm font-semibold truncate text-gray-200">{inv.name}</p>
                                  <p className="text-cyan-400 text-xs font-semibold">{formatCOP(inv.price)} <span className="text-gray-500 font-normal">({inv.stock} items)</span></p>
                                </div>
                                <Plus className="h-4 w-4 text-cyan-400 shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sección 2: Catálogo proveedor */}
                      {(refResultados.catalogo || []).length > 0 && (
                        <div>
                          <p className="font-orbitron text-[10px] text-cyan-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1">
                            <Store className="h-3 w-3" /> Del catálogo del proveedor
                          </p>
                          <div className="space-y-1">
                            {(refResultados.catalogo || []).map((cat: any) => (
                              <button
                                key={cat.id}
                                className="w-full text-left p-2 rounded-lg bg-gray-900/60 border border-cyan-500/10 hover:border-cyan-500/40 transition-colors space-y-1 min-h-[60px]"
                                onClick={() => {
                                  const syntheticProd: ProductoProveedor = {
                                    id: cat.id, proveedor: cat.proveedor || 'Proveedor', categoria: 'Accesorios' as any, subcategoria: null,
                                    nombre: cat.nombre, variante: cat.variante || null, plataforma: null, precio: cat.precio || 0,
                                    precio_hasta: null, tipo_conexion: null, compatibilidad: null, tiene_microfono: null, tiene_rgb: null,
                                    emoji: null, imagen_url: cat.imagen_url || null, notas: null, activo: true,
                                  };
                                  setOrdenItems(prev => {
                                    if (prev.some(i => i.producto.id === syntheticProd.id)) return prev;
                                    return [...prev, { producto: syntheticProd, cantidad: 1, precio_venta: cat.match_product_price || 0 }];
                                  });
                                  setRefBusqueda(''); setRefResultados(null); setRefMostrar(false);
                                  toast({ title: 'Agregado', description: cat.nombre });
                                }}
                              >
                                <div className="flex flex-row items-center gap-3">
                                  <div className="w-10 h-10 rounded-md bg-gray-950 overflow-hidden shrink-0 border border-cyan-500/20">
                                    {cat.imagen_url ? <img src={cat.imagen_url} alt={cat.nombre} className="h-full w-full object-cover" />
                                      : <div className="h-full w-full flex items-center justify-center"><Store className="h-4 w-4 text-gray-600" /></div>}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-rajdhani text-sm font-semibold truncate text-gray-200">
                                      {cat.nombre}
                                      {cat.variante && <span className="text-gray-400 font-normal"> ({cat.variante})</span>}
                                    </p>
                                    <p className="text-cyan-400 text-xs font-semibold">{formatCOP(cat.precio)}</p>
                                  </div>
                                  <Plus className="h-4 w-4 text-cyan-400 shrink-0" />
                                </div>
                                {cat.tiene_match ? (
                                  <div className="bg-green-900/60 text-green-400 border border-green-500/30 text-[10px] rounded px-2 py-0.5 mt-1">
                                    ✓ Actualizará stock ({cat.match_product_name})
                                  </div>
                                ) : (
                                  <div className="bg-gray-800 text-gray-400 text-[10px] rounded px-2 py-0.5 mt-1 border border-gray-700">
                                    + Nuevo producto
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {(refResultados.inventario || []).length === 0 && (refResultados.catalogo || []).length === 0 && (
                        <p className="text-xs text-gray-500 text-center py-4">No se encontraron resultados</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-4">Escribe al menos 2 caracteres</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Items List (Problema 2) */}
          <div className="flex-1 min-h-[300px] overflow-hidden rounded-lg">
            <ScrollArea className="h-full w-full pr-2">
              <div className="space-y-2 py-2">
                {ordenItems.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">No hay ítems en la orden</p>
                ) : (
                  ordenItems.map((item) => (
                    <div key={item.producto.id} className="bg-gray-900/60 border border-cyan-500/20 rounded-lg p-3 flex flex-col sm:flex-row items-center sm:items-stretch gap-3 hover:border-cyan-500/40 transition-colors">
                      <div className="w-12 h-12 sm:w-10 sm:h-10 flex-shrink-0 rounded-lg flex items-center justify-center bg-gray-950 border border-cyan-500/20 overflow-hidden text-xl pt-0 mt-0">
                        {item.producto.imagen_url
                          ? <img src={item.producto.imagen_url} alt={item.producto.nombre} className="w-full h-full object-cover" />
                          : (item.producto.emoji || '📦')}
                      </div>
                      
                      <div className="flex-1 min-w-0 w-full text-center sm:text-left flex flex-col justify-center">
                        <p className="font-rajdhani text-sm font-semibold truncate text-gray-200" title={`${item.producto.nombre} ${item.producto.variante || ''}`}>
                          {item.producto.nombre}
                          {item.producto.variante && <span className="text-gray-400 font-normal ml-1">({item.producto.variante})</span>}
                        </p>
                        <p className="text-[10px] text-gray-500 hidden sm:block truncate">{item.producto.categoria} · {item.producto.proveedor}</p>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-start">
                        <div className="text-center bg-gray-950/50 rounded p-1.5 min-w-[70px]">
                          <span className="block text-gray-500 text-[9px] uppercase tracking-wider mb-0.5">Costo</span>
                          <span className="font-orbitron font-medium text-xs text-gray-300">{formatCOP(item.producto.precio)}</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <span className="block text-gray-500 text-[9px] uppercase tracking-wider mb-0.5">Precio Venta</span>
                          <Input
                            type="number" min={0} placeholder="-"
                            value={item.precio_venta || ''}
                            onChange={(e) => updatePrecioVenta(item.producto.id, Number(e.target.value) || 0)}
                            className="h-8 w-24 text-xs text-center bg-gray-900 border border-cyan-500/30 rounded-lg px-2 text-gray-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                          />
                        </div>

                        <div className="flex flex-col items-center">
                          <span className="block text-gray-500 text-[9px] uppercase tracking-wider mb-0.5">Cant</span>
                          <Input
                            type="number" min={1} value={item.cantidad}
                            onChange={(e) => updateCantidad(item.producto.id, parseInt(e.target.value) || 1)}
                            className="h-8 w-16 text-xs text-center bg-gray-900 border border-cyan-500/30 rounded-lg px-2 text-gray-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                          />
                        </div>
                        
                        <button onClick={() => removeItem(item.producto.id)} className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-lg p-2 transition-colors sm:ml-2">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Footer */}
          {ordenItems.length > 0 && (
            <div className="mt-2 space-y-3 p-1">
              <div className="flex items-center justify-between p-3 bg-gray-900/60 border border-cyan-500/20 rounded-lg">
                <span className="font-orbitron text-cyan-400 text-sm uppercase tracking-wider">Total Orden</span>
                <span className="text-xl font-bold font-orbitron text-cyan-400">{formatCOP(totalOrden)}</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  className="bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 rounded-lg px-4 py-2.5 font-rajdhani font-semibold transition-all h-auto"
                  onClick={guardarOrden} disabled={guardandoOrden}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {guardandoOrden ? 'Guardando...' : 'Guardar en BD'}
                </Button>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-gray-900 border border-cyan-500/30 text-gray-300 hover:text-cyan-400 hover:border-cyan-400 rounded-lg font-rajdhani text-xs transition-all h-auto py-2.5" onClick={copiarOrden}>
                    {copiadoTexto ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
                    {copiadoTexto ? 'Copiado!' : 'Exportar Lista'}
                  </Button>
                  <Button className="flex-1 bg-gray-900 border border-cyan-500/30 text-gray-300 hover:text-cyan-400 hover:border-cyan-400 rounded-lg font-rajdhani text-xs transition-all h-auto py-2.5" onClick={exportarOrdenXLSX}>
                    {exportadoXLSX ? <Check className="h-4 w-4 mr-1.5" /> : <FileText className="h-4 w-4 mr-1.5" />}
                    {exportadoXLSX ? 'Exportado' : 'A Excel'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CatalogoProveedores;
