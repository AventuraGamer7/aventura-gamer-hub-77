import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProducts } from '@/hooks/useProducts';
import { useProfile } from '@/hooks/useProfile';
import ProductImageManager from './ProductImageManager';
import { ProductVariantsManager } from './ProductVariantsManager';
import { Edit, Trash2, Package, Eye, Search, EyeOff, Filter, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductManagementPanel = () => {
  const { toast } = useToast();
  const { isSuperadmin } = useProfile();
  const { products } = useProducts();
  const navigate = useNavigate();
  
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleEdit = (product: any) => {
    setEditingProduct({ ...product });
    setIsEditOpen(true);
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ active: !currentActive })
        .eq('id', id);
      if (error) throw error;
      toast({
        title: currentActive ? "Producto oculto" : "Producto activado",
        description: currentActive ? "Ya no será visible en la tienda." : "Ahora es visible en la tienda.",
      });
    } catch (error: any) {
      toast({ title: "Error", description: "No se pudo cambiar la visibilidad.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!isSuperadmin()) {
      toast({ title: "Sin permisos", description: "Solo el superadmin puede eliminar productos.", variant: "destructive" });
      return;
    }
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Producto eliminado", description: "Se eliminó exitosamente." });
    } catch (error: any) {
      toast({ title: "Error", description: "No se pudo eliminar el producto.", variant: "destructive" });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          description: editingProduct.description,
          price: parseFloat(editingProduct.price),
          stock: parseInt(editingProduct.stock) || 0,
          category: editingProduct.category,
          image: editingProduct.image,
          images: editingProduct.images,
          badge_text: editingProduct.badge_text,
          badge_color: editingProduct.badge_color
        })
        .eq('id', editingProduct.id);
      if (error) throw error;
      toast({ title: "Producto actualizado", description: "Los cambios se guardaron." });
      setIsEditOpen(false);
      setEditingProduct(null);
    } catch (error: any) {
      toast({ title: "Error", description: "No se pudo actualizar el producto.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditingProduct((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getMainImage = (product: any) => {
    if (product.images && product.images.length > 0) return product.images[0];
    return product.image || '/placeholder.svg';
  };

  const categories = Array.from(
    new Set(products?.map(p => p.category).filter(Boolean))
  ).sort();

  const filteredProducts = products?.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      product.name.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeCount = products?.filter(p => p.active).length || 0;
  const lowStockCount = products?.filter(p => p.stock <= 5 && p.stock > 0).length || 0;
  const outOfStockCount = products?.filter(p => p.stock === 0).length || 0;

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-border bg-background p-3 text-center">
          <p className="text-2xl font-bold">{products?.length || 0}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-3 text-center">
          <p className="text-2xl font-bold text-primary">{activeCount}</p>
          <p className="text-xs text-muted-foreground">Activos</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-3 text-center">
          <p className="text-2xl font-bold text-yellow-500">{lowStockCount}</p>
          <p className="text-xs text-muted-foreground">Stock bajo</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-3 text-center">
          <p className="text-2xl font-bold text-destructive">{outOfStockCount}</p>
          <p className="text-xs text-muted-foreground">Agotados</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 pl-9 pr-4 border border-input bg-background rounded-md text-sm appearance-none cursor-pointer"
            >
              <option value="all">Todas</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex border border-input rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results info */}
      <p className="text-xs text-muted-foreground">
        {filteredProducts?.length || 0} producto{filteredProducts?.length !== 1 ? 's' : ''} encontrado{filteredProducts?.length !== 1 ? 's' : ''}
      </p>

      {/* Product list */}
      {filteredProducts?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No se encontraron productos</p>
          <p className="text-sm">Intenta cambiar los filtros de búsqueda</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredProducts?.map((product: any) => (
            <Card key={product.id} className={`group overflow-hidden transition-shadow hover:shadow-md ${!product.active ? 'opacity-60' : ''}`}>
              <div className="relative aspect-square bg-muted/20 flex items-center justify-center overflow-hidden">
                <img
                  src={getMainImage(product)}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain p-2 group-hover:scale-105 transition-transform"
                />
                {!product.active && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-[10px]">Oculto</Badge>
                  </div>
                )}
                {product.badge_text && product.active && (
                  <div className="absolute top-2 right-2">
                    <Badge variant={product.badge_color === 'destructive' ? 'destructive' : 'default'} className="text-[10px]">
                      {product.badge_text}
                    </Badge>
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <Badge variant="destructive">Agotado</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-3 space-y-1.5">
                <h4 className="text-sm font-medium line-clamp-2 leading-tight">{product.name}</h4>
                <p className="text-xs text-muted-foreground">{product.category || 'Sin categoría'}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">{formatPrice(product.price)}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    product.stock === 0 ? 'bg-destructive/10 text-destructive' :
                    product.stock <= 5 ? 'bg-yellow-500/10 text-yellow-600' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {product.stock} uds
                  </span>
                </div>
                <div className="flex gap-1 pt-1">
                  <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => handleEdit(product)}>
                    <Edit className="h-3 w-3 mr-1" /> Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleToggleActive(product.id, product.active)}
                    title={product.active ? 'Ocultar' : 'Mostrar'}
                  >
                    {product.active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => navigate(`/producto/${product.id}`)}>
                    <Eye className="h-3 w-3" />
                  </Button>
                  {isSuperadmin() && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar "{product.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id)}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="space-y-2">
          {filteredProducts?.map((product: any) => (
            <div key={product.id} className={`flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors ${!product.active ? 'opacity-60' : ''}`}>
              <img
                src={getMainImage(product)}
                alt={product.name}
                className="w-12 h-12 object-contain rounded bg-muted/20 p-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium truncate">{product.name}</h4>
                  {!product.active && <Badge variant="secondary" className="text-[10px]">Oculto</Badge>}
                  {product.badge_text && product.active && (
                    <Badge variant={product.badge_color === 'destructive' ? 'destructive' : 'default'} className="text-[10px]">{product.badge_text}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{product.category || 'Sin categoría'}</span>
                  <span>·</span>
                  <span className={product.stock === 0 ? 'text-destructive' : product.stock <= 5 ? 'text-yellow-600' : ''}>
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold text-primary whitespace-nowrap">{formatPrice(product.price)}</span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-8" onClick={() => handleEdit(product)}>
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8" onClick={() => handleToggleActive(product.id, product.active)}>
                  {product.active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </Button>
                <Button variant="ghost" size="sm" className="h-8" onClick={() => navigate(`/producto/${product.id}`)}>
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                {isSuperadmin() && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar "{product.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(product.id)}>Eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog - cleaner */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0">
          <DialogHeader className="px-5 pt-5 pb-3">
            <DialogTitle className="text-lg">Editar Producto</DialogTitle>
          </DialogHeader>

          {editingProduct && (
            <Tabs defaultValue="general" className="px-5 pb-5">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="images">Imágenes</TabsTrigger>
                <TabsTrigger value="variants">Variantes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1">
                      <Label htmlFor="name" className="text-xs text-muted-foreground">Nombre *</Label>
                      <Input id="name" name="name" value={editingProduct.name || ''} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="price" className="text-xs text-muted-foreground">Precio *</Label>
                      <Input id="price" name="price" type="number" value={editingProduct.price || ''} onChange={handleInputChange} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="category" className="text-xs text-muted-foreground">Categoría</Label>
                      <Input id="category" name="category" value={editingProduct.category || ''} onChange={handleInputChange} placeholder="Controles, Consolas..." />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="stock" className="text-xs text-muted-foreground">Stock</Label>
                      <Input id="stock" name="stock" type="number" value={editingProduct.stock || ''} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="description" className="text-xs text-muted-foreground">Descripción</Label>
                    <Textarea id="description" name="description" value={editingProduct.description || ''} onChange={handleInputChange} rows={2} className="resize-none" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="image" className="text-xs text-muted-foreground">Imagen principal (URL)</Label>
                    <Input id="image" name="image" type="url" value={editingProduct.image || ''} onChange={handleInputChange} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="badge_text" className="text-xs text-muted-foreground">Etiqueta</Label>
                      <Input id="badge_text" name="badge_text" value={editingProduct.badge_text || ''} onChange={handleInputChange} placeholder="Nuevo, Oferta..." />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="badge_color" className="text-xs text-muted-foreground">Color etiqueta</Label>
                      <select
                        id="badge_color"
                        name="badge_color"
                        value={editingProduct.badge_color || 'primary'}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="primary">Azul</option>
                        <option value="secondary">Gris</option>
                        <option value="destructive">Rojo</option>
                        <option value="outline">Borde</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditOpen(false)} disabled={loading}>
                      Cancelar
                    </Button>
                    <Button type="submit" variant="gaming" className="flex-1" disabled={loading}>
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="images">
                <ProductImageManager 
                  productId={editingProduct.id}
                  onImagesChange={(images) => setEditingProduct((prev: any) => ({ ...prev, images }))}
                />
              </TabsContent>

              <TabsContent value="variants">
                <ProductVariantsManager productId={editingProduct.id} />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagementPanel;
