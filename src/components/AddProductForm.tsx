import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus } from 'lucide-react';
import ProductImageUploader from './ProductImageUploader';
import CategoryCombobox from './CategoryCombobox';

const AddProductForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const CATEGORIES = ['videojuegos', 'consolas', 'controles', 'accesorios', 'perifericos', 'figuras', 'repuestos', 'otros'];
  const PLATFORMS = ['PS2', 'PS3', 'PS4', 'PS5', 'PS Vita', 'PSP', 'Xbox 360', 'Xbox Series', 'Nintendo DS', 'Nintendo Switch', 'Nintendo Wii', 'GameCube', 'PC', 'Smart TV', 'Streaming', 'Repuestos'];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    platform: [] as string[],
    images: [] as string[],
    badge_text: '',
    badge_color: 'primary'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', stock: '', category: '', platform: [], images: [], badge_text: '', badge_color: 'primary' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast({ title: "Error", description: "Nombre y precio son obligatorios", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('products').insert([{
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        category: formData.category || null,
        platform: formData.platform.length > 0 ? formData.platform : null,
        image: formData.images[0] || null,
        images: formData.images.length > 0 ? formData.images : null,
        badge_text: formData.badge_text || null,
        badge_color: formData.badge_color || 'primary'
      }]);
      if (error) throw error;
      toast({ title: "¡Producto agregado!", description: "Se agregó exitosamente a la tienda." });
      resetForm();
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({ title: "Error", description: "No se pudo agregar el producto.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
      <DialogTrigger asChild>
        <Button variant="gaming" size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Agregar Producto
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-lg font-semibold">Nuevo Producto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-4">
          {/* Nombre y Precio */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <Label htmlFor="name" className="text-xs text-muted-foreground">Nombre *</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Joystick PS5" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="price" className="text-xs text-muted-foreground">Precio (COP) *</Label>
              <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="280000" min="0" step="1000" required />
            </div>
          </div>

          {/* Categoría y Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="category" className="text-xs text-muted-foreground">Categoría</Label>
              <CategoryCombobox
                value={formData.category}
                onChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="stock" className="text-xs text-muted-foreground">Stock</Label>
              <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="10" min="0" />
            </div>
          </div>

          {/* Plataforma */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Plataforma</Label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    platform: prev.platform.includes(p)
                      ? prev.platform.filter(x => x !== p)
                      : [...prev.platform, p]
                  }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    formData.platform.includes(p)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            {formData.platform.length > 0 && (
              <p className="text-[10px] text-muted-foreground mt-1">
                Seleccionadas: {formData.platform.join(', ')}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <Label htmlFor="description" className="text-xs text-muted-foreground">Descripción</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Descripción del producto..." rows={2} className="resize-none" />
          </div>

          {/* Imágenes - Componente unificado */}
          <ProductImageUploader
            images={formData.images}
            onChange={(images) => setFormData(prev => ({ ...prev, images }))}
          />

          {/* Badge */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="badge_text" className="text-xs text-muted-foreground">Etiqueta</Label>
              <Input id="badge_text" name="badge_text" value={formData.badge_text} onChange={handleChange} placeholder="Nuevo, Oferta..." />
            </div>
            <div className="space-y-1">
              <Label htmlFor="badge_color" className="text-xs text-muted-foreground">Color etiqueta</Label>
              <select
                id="badge_color"
                name="badge_color"
                value={formData.badge_color}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="primary">Azul</option>
                <option value="secondary">Gris</option>
                <option value="destructive">Rojo</option>
                <option value="outline">Borde</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="gaming" className="flex-1" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductForm;
