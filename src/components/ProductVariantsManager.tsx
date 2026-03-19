import { useState } from 'react';
import { useProductVariants } from '@/hooks/useProductVariants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductVariantsManagerProps {
  productId: string;
}

export const ProductVariantsManager = ({ productId }: ProductVariantsManagerProps) => {
  const { variants, loading, addVariant, updateVariant, deleteVariant, toggleActive } = useProductVariants(productId);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    color_code: '',
    image_url: '',
    stock: 0,
    price_adjustment: 0,
    display_order: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'price_adjustment' || name === 'display_order' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVariant) {
      await updateVariant(editingVariant.id, formData);
      setEditingVariant(null);
    } else {
      await addVariant({
        product_id: productId,
        ...formData,
        is_active: true
      });
      setIsAddDialogOpen(false);
    }

    setFormData({
      name: '',
      color_code: '',
      image_url: '',
      stock: 0,
      price_adjustment: 0,
      display_order: 0
    });
  };

  const handleEdit = (variant: any) => {
    setEditingVariant(variant);
    setFormData({
      name: variant.name,
      color_code: variant.color_code || '',
      image_url: variant.image_url,
      stock: variant.stock,
      price_adjustment: variant.price_adjustment,
      display_order: variant.display_order
    });
  };

  const handleCancelEdit = () => {
    setEditingVariant(null);
    setFormData({
      name: '',
      color_code: '',
      image_url: '',
      stock: 0,
      price_adjustment: 0,
      display_order: 0
    });
  };

  if (loading && variants.length === 0) {
    return <div className="text-center py-4">Cargando variantes...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Variantes del Producto</h3>
          <p className="text-sm text-muted-foreground">Colores, diseños y presentaciones</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gaming" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Variante
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nueva Variante</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre de la Variante *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Rojo Brillante, Azul Marino"
                  required
                />
              </div>
              <div>
                <Label htmlFor="color_code">Código de Color (Hex)</Label>
                <div className="flex gap-2">
                  <Input
                    id="color_code"
                    name="color_code"
                    value={formData.color_code}
                    onChange={handleInputChange}
                    placeholder="#FF0000"
                  />
                  {formData.color_code && (
                    <div 
                      className="w-12 h-10 rounded border"
                      style={{ backgroundColor: formData.color_code }}
                    />
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="image_url">URL de la Imagen *</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="price_adjustment">Ajuste de Precio</Label>
                  <Input
                    id="price_adjustment"
                    name="price_adjustment"
                    type="number"
                    value={formData.price_adjustment}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="display_order">Orden de Visualización</Label>
                <Input
                  id="display_order"
                  name="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="gaming">
                  Agregar Variante
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {editingVariant && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-sm">Editando Variante</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nombre de la Variante *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-color_code">Código de Color (Hex)</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-color_code"
                    name="color_code"
                    value={formData.color_code}
                    onChange={handleInputChange}
                  />
                  {formData.color_code && (
                    <div 
                      className="w-12 h-10 rounded border"
                      style={{ backgroundColor: formData.color_code }}
                    />
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="edit-image_url">URL de la Imagen *</Label>
                <Input
                  id="edit-image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-price_adjustment">Ajuste de Precio</Label>
                  <Input
                    id="edit-price_adjustment"
                    name="price_adjustment"
                    type="number"
                    value={formData.price_adjustment}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-display_order">Orden de Visualización</Label>
                <Input
                  id="edit-display_order"
                  name="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
                <Button type="submit" variant="gaming">
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {variants.map((variant) => (
          <Card key={variant.id} className={!variant.is_active ? 'opacity-50' : ''}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={variant.image_url} 
                    alt={variant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{variant.name}</h4>
                    {variant.color_code && (
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-border"
                        style={{ backgroundColor: variant.color_code }}
                      />
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">Stock: {variant.stock}</Badge>
                    {variant.price_adjustment !== 0 && (
                      <Badge variant="secondary">
                        {variant.price_adjustment > 0 ? '+' : ''}{variant.price_adjustment}
                      </Badge>
                    )}
                    {!variant.is_active && (
                      <Badge variant="destructive">Inactivo</Badge>
                    )}
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(variant.id, !variant.is_active)}
                    >
                      {variant.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(variant)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar variante?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la variante "{variant.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteVariant(variant.id)}>
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {variants.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>No hay variantes para este producto.</p>
            <p className="text-sm">Agrega colores, diseños o presentaciones diferentes.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
