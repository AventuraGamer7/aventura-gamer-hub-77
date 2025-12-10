import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus } from 'lucide-react';
import CategorySelector from './CategorySelector';

const AddProductForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    subcategory: [] as string[],
    image: '',
    images: [] as string[],
    badge_text: '',
    badge_color: 'primary'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast({
        title: "Error",
        description: "Nombre y precio son campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .insert([
          {
            name: formData.name,
            description: formData.description || null,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock) || 0,
            category: formData.category || null,
            subcategory: formData.subcategory.length > 0 ? formData.subcategory : null,
            image: formData.image || null,
            images: formData.images.length > 0 ? formData.images : null,
            badge_text: formData.badge_text || null,
            badge_color: formData.badge_color || 'primary'
          }
        ]);

      if (error) throw error;

      toast({
        title: "¡Producto agregado!",
        description: "El producto se ha agregado exitosamente a la tienda.",
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        subcategory: [],
        image: '',
        images: [],
        badge_text: '',
        badge_color: 'primary'
      });
      
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el producto. Inténtalo nuevamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="gaming" size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Agregar Producto
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-glow">Agregar Nuevo Producto</DialogTitle>
          <DialogDescription>
            Completa la información del producto para agregarlo a la tienda
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: Joystick PS5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio (COP) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="280000"
                min="0"
                step="1000"
                required
              />
            </div>
          </div>

          {/* Category Selector Component */}
          <div className="border border-border/50 rounded-lg p-4 bg-muted/10">
            <CategorySelector
              selectedCategory={formData.category}
              selectedSubcategories={formData.subcategory}
              onCategoryChange={(category) => setFormData(prev => ({ ...prev, category }))}
              onSubcategoriesChange={(subcategory) => setFormData(prev => ({ ...prev, subcategory }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="10"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descripción detallada del producto..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">URL de la Imagen Principal</Label>
            <Input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label>Imágenes Adicionales</Label>
            <div className="space-y-2">
              {formData.images.map((img, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="url"
                    value={img}
                    onChange={(e) => {
                      const newImages = [...formData.images];
                      newImages[index] = e.target.value;
                      setFormData(prev => ({ ...prev, images: newImages }));
                    }}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newImages = formData.images.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, images: newImages }));
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
                }}
              >
                + Agregar Imagen
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="badge_text">Texto del Badge (opcional)</Label>
              <Input
                id="badge_text"
                name="badge_text"
                value={formData.badge_text}
                onChange={handleInputChange}
                placeholder="Nuevo, Oferta, Premium..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge_color">Color del Badge</Label>
              <select
                id="badge_color"
                name="badge_color"
                value={formData.badge_color}
                onChange={(e) => setFormData(prev => ({ ...prev, badge_color: e.target.value }))}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="primary">Primario (Azul)</option>
                <option value="secondary">Secundario</option>
                <option value="destructive">Rojo</option>
                <option value="outline">Borde</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="gaming"
              disabled={loading}
            >
              {loading ? 'Agregando...' : 'Agregar Producto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductForm;