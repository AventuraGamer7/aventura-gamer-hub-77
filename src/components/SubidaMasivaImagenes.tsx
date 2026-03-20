import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import {
  ImagePlus, Upload, Search, CheckCircle, X, Loader2,
  Package, AlertCircle, Trash2, ArrowRight
} from 'lucide-react';

/* ── tipos ─────────────────────────────────────── */
interface ProductResult {
  id: string;
  name: string;
  image: string | null;
}

interface UploadResult {
  filename: string;
  success: boolean;
  assigned: boolean;
  error?: string;
}

/* ── componente ────────────────────────────────── */
const SubidaMasivaImagenes = () => {
  const { user } = useAuth();

  // estado principal — arrays indexados por imagen
  const [archivos, setArchivos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [busquedas, setBusquedas] = useState<string[]>([]);
  const [resultados, setResultados] = useState<ProductResult[][]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<(ProductResult | null)[]>([]);
  const [notas, setNotas] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  // upload
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalToUpload, setTotalToUpload] = useState(0);
  const [results, setResults] = useState<UploadResult[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* limpieza de previews al desmontar */
  useEffect(() => {
    return () => {
      previews.forEach(p => URL.revokeObjectURL(p));
    };
  }, []);

  /* ── BÚSQUEDA de productos (por imagen) ──────── */
  const buscarProductos = async (termino: string, index: number) => {
    if (termino.trim().length < 2) {
      setResultados(prev => {
        const copy = [...prev];
        copy[index] = [];
        return copy;
      });
      return;
    }

    const { data, error } = await supabase
      .from('products')
      .select('id, name, image')
      .ilike('name', `%${termino}%`)
      .eq('active', true)
      .order('name', { ascending: true })
      .limit(8);

    if (error) {
      console.error('Error buscando productos:', error);
      return;
    }

    setResultados(prev => {
      const copy = [...prev];
      copy[index] = (data as ProductResult[]) || [];
      return copy;
    });
  };

  /* debounce por imagen con useEffect */
  useEffect(() => {
    if (busquedas.length === 0) return;

    const timers = busquedas.map((termino, index) => {
      if (!termino || termino.trim().length < 2) return null;
      return setTimeout(() => {
        buscarProductos(termino, index);
      }, 300);
    });

    return () => {
      timers.forEach(t => { if (t) clearTimeout(t); });
    };
  }, [busquedas]);

  /* cerrar dropdowns al clic fuera */
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  /* ── PASO 1: seleccionar archivos ────────────── */
  const handleSeleccionArchivos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews = files.map(f => URL.createObjectURL(f));

    setArchivos(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...newPreviews]);
    setBusquedas(prev => [...prev, ...new Array(files.length).fill('')]);
    setResultados(prev => [...prev, ...new Array(files.length).fill([])]);
    setProductosSeleccionados(prev => [...prev, ...new Array(files.length).fill(null)]);
    setNotas(prev => [...prev, ...new Array(files.length).fill('')]);
    setResults(null);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setArchivos(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setBusquedas(prev => prev.filter((_, i) => i !== index));
    setResultados(prev => prev.filter((_, i) => i !== index));
    setProductosSeleccionados(prev => prev.filter((_, i) => i !== index));
    setNotas(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    previews.forEach(p => URL.revokeObjectURL(p));
    setArchivos([]);
    setPreviews([]);
    setBusquedas([]);
    setResultados([]);
    setProductosSeleccionados([]);
    setNotas([]);
    setResults(null);
  };

  /* ── PASO 2: asignar / desasignar producto ───── */
  const handleBusquedaChange = (index: number, value: string) => {
    setBusquedas(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
    if (value.trim().length >= 2) {
      setActiveDropdown(index);
    }
  };

  const assignProduct = (index: number, product: ProductResult) => {
    setProductosSeleccionados(prev => {
      const copy = [...prev];
      copy[index] = product;
      return copy;
    });
    setBusquedas(prev => {
      const copy = [...prev];
      copy[index] = '';
      return copy;
    });
    setResultados(prev => {
      const copy = [...prev];
      copy[index] = [];
      return copy;
    });
    setActiveDropdown(null);
  };

  const unassignProduct = (index: number) => {
    setProductosSeleccionados(prev => {
      const copy = [...prev];
      copy[index] = null;
      return copy;
    });
  };

  /* ── PASO 3: subir todo ──────────────────────── */
  const handleUploadAll = async () => {
    if (archivos.length === 0 || !user) return;

    setUploading(true);
    setProgress(0);
    setTotalToUpload(archivos.length);
    const uploadResults: UploadResult[] = [];

    for (let i = 0; i < archivos.length; i++) {
      const file = archivos[i];
      const filename = `${Date.now()}_${file.name}`;

      try {
        // 1) subir al bucket
        const { error: uploadError } = await supabase.storage
          .from('imagenes')
          .upload(filename, file, { upsert: false });

        if (uploadError) throw uploadError;

        // 2) obtener URL pública
        const { data: urlData } = supabase.storage
          .from('imagenes')
          .getPublicUrl(filename);

        const publicUrl = urlData.publicUrl;

        // 3) llamar RPC con nota
        const { data: rpcData, error: rpcError } = await supabase.rpc('procesar_imagen_masiva', {
          p_url: publicUrl,
          p_filename: filename,
          p_product_id: productosSeleccionados[i]?.id || null,
          p_nota: notas[i] || null,
        });

        if (rpcError) throw rpcError;

        const result = rpcData as any;
        if (result && result.success === false) {
          throw new Error(result.error || 'Error procesando imagen');
        }

        uploadResults.push({
          filename: file.name,
          success: true,
          assigned: !!productosSeleccionados[i],
        });
      } catch (err: any) {
        console.error(`Error subiendo ${file.name}:`, err);
        uploadResults.push({
          filename: file.name,
          success: false,
          assigned: false,
          error: err.message || 'Error desconocido',
        });
      }

      setProgress(i + 1);
    }

    setResults(uploadResults);
    setUploading(false);

    const exitosas = uploadResults.filter(r => r.success).length;
    const asignadas = uploadResults.filter(r => r.success && r.assigned).length;
    const fallidas = uploadResults.filter(r => !r.success).length;

    toast({
      title: '🎮 Subida completada',
      description: `${exitosas} imágenes subidas${asignadas > 0 ? `, ${asignadas} asignadas a productos` : ''}${fallidas > 0 ? ` · ${fallidas} fallidas` : ''}`,
      variant: fallidas > 0 ? 'destructive' : 'default',
    });
  };

  const resetAfterUpload = () => {
    previews.forEach(p => URL.revokeObjectURL(p));
    setArchivos([]);
    setPreviews([]);
    setBusquedas([]);
    setResultados([]);
    setProductosSeleccionados([]);
    setNotas([]);
    setResults(null);
    setProgress(0);
    setTotalToUpload(0);
  };

  /* ── conteos ─────────────────────────────────── */
  const assignedCount = productosSeleccionados.filter(p => p !== null).length;
  const unassignedCount = archivos.length - assignedCount;

  /* ── RENDER ──────────────────────────────────── */
  return (
    <div className="space-y-6">

      {/* ═══ PASO 1: SELECCIÓN ═══ */}
      <Card className="card-gaming border-primary/20">
        <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent rounded-t-xl">
          <CardTitle className="text-base flex items-center gap-2">
            <ImagePlus className="h-5 w-5 text-primary" />
            Paso 1 — Seleccionar imágenes
          </CardTitle>
          <CardDescription>
            Selecciona las imágenes que deseas subir (JPG, PNG, WebP)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Zona de selección */}
          <div
            className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer
                       hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 group"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-10 w-10 mx-auto text-primary/40 group-hover:text-primary/70 transition-colors mb-3" />
            <p className="font-semibold text-foreground">
              Haz clic para seleccionar imágenes
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              JPG, PNG, WebP · Múltiples archivos
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={handleSeleccionArchivos}
            />
          </div>

          {/* Contador y acciones */}
          {archivos.length > 0 && (
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {archivos.length} imagen{archivos.length !== 1 ? 'es' : ''}
                </Badge>
                {assignedCount > 0 && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {assignedCount} asignada{assignedCount !== 1 ? 's' : ''}
                  </Badge>
                )}
                {unassignedCount > 0 && (
                  <Badge variant="outline" className="text-muted-foreground">
                    {unassignedCount} sin asignar
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  <ImagePlus className="h-3.5 w-3.5 mr-1" />
                  Agregar más
                </Button>
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Limpiar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ═══ PASO 2: ASIGNACIÓN ═══ */}
      {archivos.length > 0 && !results && (
        <Card className="card-gaming border-primary/20">
          <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent rounded-t-xl">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Paso 2 — Asignar a productos
            </CardTitle>
            <CardDescription>
              Busca y asigna cada imagen a un producto. Puedes dejar sin asignar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {archivos.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="relative rounded-xl border border-border/60 bg-card overflow-hidden
                             shadow-[0_0_8px_rgba(var(--primary-rgb,139,92,246),0.08)]
                             hover:shadow-[0_0_16px_rgba(var(--primary-rgb,139,92,246),0.15)]
                             transition-shadow duration-300"
                >
                  {/* Miniatura */}
                  <div className="aspect-square bg-muted/30 relative overflow-hidden">
                    <img
                      src={previews[index]}
                      alt={file.name}
                      className="w-full h-full object-contain p-2"
                    />
                    {/* Botón eliminar */}
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive/80 text-white
                                 flex items-center justify-center transition-opacity backdrop-blur-sm"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    {/* Badge de estado */}
                    {productosSeleccionados[index] && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-green-500/90 text-white border-0 text-[10px] gap-1 shadow-lg">
                          <CheckCircle className="h-3 w-3" />
                          Asignada
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Info + búsqueda + nota */}
                  <div className="p-3 space-y-2">
                    <p className="text-xs text-muted-foreground truncate font-mono" title={file.name}>
                      {file.name}
                    </p>

                    {/* Producto asignado */}
                    {productosSeleccionados[index] ? (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                        <span className="text-sm text-green-400 truncate flex-1" title={productosSeleccionados[index]!.name}>
                          {productosSeleccionados[index]!.name}
                        </span>
                        <button
                          onClick={() => unassignProduct(index)}
                          className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      /* Buscador */
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <Input
                            placeholder="Buscar producto..."
                            className="h-8 pl-8 text-xs bg-background/50"
                            value={busquedas[index] || ''}
                            onChange={(e) => handleBusquedaChange(index, e.target.value)}
                            onFocus={() => {
                              if ((busquedas[index] || '').trim().length >= 2) {
                                setActiveDropdown(index);
                              }
                            }}
                          />
                        </div>

                        {/* Dropdown resultados */}
                        {activeDropdown === index && (resultados[index] || []).length > 0 && (
                          <div
                            className="absolute z-50 w-full mt-1 border border-border bg-card rounded-lg shadow-xl
                                       max-h-48 overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {(resultados[index] || []).map(product => (
                              <button
                                key={product.id}
                                onClick={() => assignProduct(index, product)}
                                className="w-full text-left px-3 py-2 hover:bg-primary/10 flex items-center gap-2
                                           transition-colors border-b border-border/30 last:border-0"
                              >
                                <div className="h-8 w-8 rounded-md bg-muted overflow-hidden shrink-0 border border-border/50">
                                  {product.image ? (
                                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                      <Package className="h-3.5 w-3.5 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <span className="text-xs truncate">{product.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Campo de nota */}
                    <input
                      type="text"
                      placeholder="Nota ej: Caballero del Zodiaco, control rojo..."
                      value={notas[index] || ''}
                      onChange={(e) => {
                        const nuevas = [...notas];
                        nuevas[index] = e.target.value;
                        setNotas(nuevas);
                      }}
                      className="w-full mt-1 px-2 py-1 text-xs bg-black/40 border border-cyan-500/30
                                 rounded text-gray-300 placeholder-gray-600 focus:outline-none
                                 focus:border-cyan-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═══ PASO 3: BARRA DE PROGRESO + BOTÓN GUARDAR ═══ */}
      {archivos.length > 0 && !results && (
        <Card className="card-gaming border-primary/20">
          <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent rounded-t-xl">
            <CardTitle className="text-base flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Paso 3 — Guardar todo
            </CardTitle>
            <CardDescription>
              Sube todas las imágenes al servidor y asigna a los productos seleccionados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Barra de progreso */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subiendo imágenes...</span>
                  <span className="font-mono font-bold text-primary">
                    {progress}/{totalToUpload}
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden border border-border/50">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out
                               bg-gradient-to-r from-primary via-secondary to-primary
                               shadow-[0_0_12px_rgba(var(--primary-rgb,139,92,246),0.5)]"
                    style={{ width: `${totalToUpload > 0 ? (progress / totalToUpload) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Procesando: {archivos[Math.max(0, progress - 1)]?.name || '...'}
                </p>
              </div>
            )}

            {/* Resumen pre-subida */}
            {!uploading && (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{archivos.length}</p>
                  <p className="text-xs text-muted-foreground">Imágenes total</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                  <p className="text-2xl font-bold text-green-400">{assignedCount}</p>
                  <p className="text-xs text-muted-foreground">Con producto</p>
                </div>
              </div>
            )}

            <Button
              onClick={handleUploadAll}
              disabled={uploading || archivos.length === 0}
              className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-secondary
                         hover:from-primary/90 hover:to-secondary/90 shadow-lg
                         shadow-primary/20 transition-all duration-300"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Subiendo {progress}/{totalToUpload}...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Guardar todo ({archivos.length} imagen{archivos.length !== 1 ? 'es' : ''})
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ═══ RESULTADOS ═══ */}
      {results && (
        <Card className="card-gaming border-primary/20">
          <CardHeader className="pb-3 bg-gradient-to-r from-green-500/10 to-transparent rounded-t-xl">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Resumen de subida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-center">
                <p className="text-2xl font-bold text-green-400">
                  {results.filter(r => r.success).length}
                </p>
                <p className="text-xs text-green-400/80">Subidas ✓</p>
              </div>
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {results.filter(r => r.success && r.assigned).length}
                </p>
                <p className="text-xs text-blue-400/80">Asignadas</p>
              </div>
              {results.filter(r => !r.success).length > 0 && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center">
                  <p className="text-2xl font-bold text-red-400">
                    {results.filter(r => !r.success).length}
                  </p>
                  <p className="text-xs text-red-400/80">Fallidas</p>
                </div>
              )}
            </div>

            {/* Detalle de errores */}
            {results.filter(r => !r.success).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Errores:
                </p>
                {results.filter(r => !r.success).map((r, i) => (
                  <div key={i} className="text-xs text-muted-foreground bg-destructive/5 p-2 rounded-lg border border-destructive/20">
                    <span className="font-mono">{r.filename}</span>: {r.error}
                  </div>
                ))}
              </div>
            )}

            {/* Detalle exitosas */}
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {results.filter(r => r.success).map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-xs p-1.5 rounded-md bg-muted/20">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  <span className="font-mono truncate flex-1">{r.filename}</span>
                  {r.assigned ? (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px]">Asignada</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">Sin asignar</Badge>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={resetAfterUpload}
              className="w-full"
              variant="outline"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Subir más imágenes
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubidaMasivaImagenes;
