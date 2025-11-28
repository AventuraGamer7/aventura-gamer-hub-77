import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProducts } from '@/hooks/useProducts';
import { Plus, Upload, X, Check } from 'lucide-react';

const AddProductForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { toast } = useToast();
  const { products } = useProducts();

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
  
  const [newSubcategory, setNewSubcategory] = useState('');

  // Get all existing unique subcategories from products
  const existingSubcategories = useMemo(() => {
    const subcats = new Set<string>();
    products.forEach(product => {
      if (product.subcategory && Array.isArray(product.subcategory)) {
        product.subcategory.forEach(sub => subcats.add(sub));
      }
    });
    return Array.from(subcats).sort();
  }, [products]);

  // Filter suggestions based on input
  const filteredSuggestions = useMemo(() => {
    if (!newSubcategory.trim()) return existingSubcategories;
    return existingSubcategories.filter(sub =>
      sub.toLowerCase().includes(newSubcategory.toLowerCase())
    );
  }, [newSubcategory, existingSubcategories]);

  const addSubcategory = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue && !formData.subcategory.includes(trimmedValue)) {
      setFormData(prev => ({
        ...prev,
        subcategory: [...prev.subcategory, trimmedValue]
      }));
      setNewSubcategory('');
      setPopoverOpen(false);
    }
  };

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
      
      setNewSubcategory('');
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
      
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
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
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Ej: Controles"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategorías</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <div className="flex-1">
                        <Input
                          id="subcategory"
                          value={newSubcategory}
                          onChange={(e) => {
                            setNewSubcategory(e.target.value);
                            setPopoverOpen(true);
                          }}
                          onFocus={() => setPopoverOpen(true)}
                          placeholder="Ej: Xbox, PS4, PS5"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSubcategory(newSubcategory);
                            }
                          }}
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <Command>
                        <CommandInput 
                          placeholder="Buscar subcategoría..." 
                          value={newSubcategory}
                          onValueChange={setNewSubcategory}
                        />
                        <CommandList>
                          {filteredSuggestions.length === 0 ? (
                            <CommandEmpty>
                              Presiona Enter para agregar "{newSubcategory}"
                            </CommandEmpty>
                          ) : (
                            <CommandGroup heading="Subcategorías existentes">
                              {filteredSuggestions.map((suggestion) => (
                                <CommandItem
                                  key={suggestion}
                                  value={suggestion}
                                  onSelect={() => addSubcategory(suggestion)}
                                  className="cursor-pointer"
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      formData.subcategory.includes(suggestion)
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    }`}
                                  />
                                  {suggestion}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addSubcategory(newSubcategory)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.subcategory.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.subcategory.map((subcat) => (
                      <Badge key={subcat} variant="secondary" className="gap-1">
                        {subcat}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              subcategory: prev.subcategory.filter(s => s !== subcat)
                            }));
                          }}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Escribe para ver sugerencias o presiona Enter para agregar nueva
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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