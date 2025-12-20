import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProducts } from '@/hooks/useProducts';
import { useProfile } from '@/hooks/useProfile';
import ProductImageManager from './ProductImageManager';
import { ProductVariantsManager } from './ProductVariantsManager';
import { Edit, Trash2, Package, Eye, Search, EyeOff } from 'lucide-react';
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
        description: currentActive 
          ? "El producto ya no será visible en la tienda." 
          : "El producto ahora es visible en la tienda.",
      });
    } catch (error: any) {
      console.error('Error toggling product visibility:', error);
      toast({
        title: "Error",
        description: "No se pudo cambiar la visibilidad del producto.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!isSuperadmin()) {
      toast({
        title: "Sin permisos",
        description: "Solo el superadmin puede eliminar productos.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Producto eliminado",
        description: "El producto se ha eliminado exitosamente.",
      });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto.",
        variant: "destructive"
      });
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

      toast({
        title: "Producto actualizado",
        description: "El producto se ha actualizado exitosamente.",
      });

      setIsEditOpen(false);
      setEditingProduct(null);
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingProduct((prev: any) => ({ ...prev, [name]: value }));
  };

  const getMainImage = (product: any) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return product.image || '/api/placeholder/100/100';
  };

  // Obtener categorías únicas
  const categories = Array.from(
    new Set(products?.map(p => p.category).filter(Boolean))
  ).sort();

  const filteredProducts = products?.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      product.name.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower);
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="card-gaming border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Gestión de Productos ({products?.length || 0})
        </CardTitle>
        <CardDescription>
          Gestiona los productos existentes. {isSuperadmin() ? 'Puedes editar y eliminar.' : 'Solo puedes editar.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {products?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No hay productos registrados aún.
            </p>
          ) : filteredProducts?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No se encontraron productos que coincidan con la búsqueda.
            </p>
          ) : (
            <div className="grid gap-4">
              {filteredProducts?.map((product: any) => (
                <div key={product.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <img
                    src={getMainImage(product)}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium">{product.name}</h4>
                          {!product.active && (
                            <Badge variant="outline" className="text-xs">
                              Oculto
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm text-muted-foreground">
                            {product.category || 'Sin categoría'}
                          </p>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                        </div>
                        <p className="text-sm font-semibold text-primary">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      
                      {product.badge_text && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          product.badge_color === 'primary' ? 'bg-primary text-primary-foreground' :
                          product.badge_color === 'secondary' ? 'bg-secondary text-secondary-foreground' :
                          product.badge_color === 'destructive' ? 'bg-destructive text-destructive-foreground' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {product.badge_text}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/producto/${product.id}`)}
                      title="Ver producto"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant={product.active ? "outline" : "secondary"}
                      size="sm"
                      onClick={() => handleToggleActive(product.id, product.active)}
                      title={product.active ? "Ocultar producto" : "Mostrar producto"}
                    >
                      {product.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      title="Editar producto"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {isSuperadmin() && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" title="Eliminar producto">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. El producto será eliminado permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(product.id)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Producto</DialogTitle>
              <DialogDescription>
                Modifica la información del producto seleccionado
              </DialogDescription>
            </DialogHeader>

            {editingProduct && (
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">Información General</TabsTrigger>
                  <TabsTrigger value="images">Imágenes</TabsTrigger>
                  <TabsTrigger value="variants">Variantes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Producto *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={editingProduct.name || ''}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Categoría</Label>
                        <Input
                          id="category"
                          name="category"
                          value={editingProduct.category || ''}
                          onChange={handleInputChange}
                          placeholder="Ej: Controles, Consolas..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Precio *</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={editingProduct.price || ''}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          name="stock"
                          type="number"
                          value={editingProduct.stock || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={editingProduct.description || ''}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Imagen Principal</Label>
                      <Input
                        id="image"
                        name="image"
                        type="url"
                        value={editingProduct.image || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="badge_text">Texto del Badge</Label>
                        <Input
                          id="badge_text"
                          name="badge_text"
                          value={editingProduct.badge_text || ''}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="badge_color">Color del Badge</Label>
                        <select
                          id="badge_color"
                          name="badge_color"
                          value={editingProduct.badge_color || 'primary'}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                        >
                          <option value="primary">Primario</option>
                          <option value="secondary">Secundario</option>
                          <option value="destructive">Destructivo</option>
                          <option value="outline">Contorno</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditOpen(false)}
                        disabled={loading}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="gaming"
                        disabled={loading}
                      >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="images">
                  <ProductImageManager 
                    productId={editingProduct.id}
                    onImagesChange={(images) => {
                      setEditingProduct((prev: any) => ({ ...prev, images }));
                    }}
                  />
                </TabsContent>

                <TabsContent value="variants">
                  <ProductVariantsManager productId={editingProduct.id} />
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ProductManagementPanel;
