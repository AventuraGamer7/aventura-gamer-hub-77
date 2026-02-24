import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, ImagePlus, Upload, Link, Loader2 } from 'lucide-react';

const AddProductForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState<number | null>(null);
  const { toast } = useToast();
  const mainFileRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    images: [] as string[],
    badge_text: '',
    badge_color: 'primary'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', stock: '', category: '', image: '', images: [], badge_text: '', badge_color: 'primary' });
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);
      toast({ title: "Error", description: "No se pudo subir la imagen", variant: "destructive" });
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMain(true);
    const url = await uploadFile(file);
    if (url) setFormData(prev => ({ ...prev, image: url }));
    setUploadingMain(false);
    if (mainFileRef.current) mainFileRef.current.value = '';
  };

  const handleExtraImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingExtra(index);
    const url = await uploadFile(file);
    if (url) {
      const newImages = [...formData.images];
      newImages[index] = url;
      setFormData(prev => ({ ...prev, images: newImages }));
    }
    setUploadingExtra(null);
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
        image: formData.image || null,
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
          {/* Nombre y Precio - los más importantes arriba */}
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
              <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="Controles, Consolas..." />
            </div>
            <div className="space-y-1">
              <Label htmlFor="stock" className="text-xs text-muted-foreground">Stock</Label>
              <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="10" min="0" />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <Label htmlFor="description" className="text-xs text-muted-foreground">Descripción</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Descripción del producto..." rows={2} className="resize-none" />
          </div>

          {/* Imagen principal */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Imagen principal</Label>
            {formData.image && (
              <div className="relative w-20 h-20 rounded-md overflow-hidden border border-border">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: '' }))} className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input id="image" name="image" type="url" value={formData.image} onChange={handleChange} placeholder="https://..." className="h-9 text-sm" />
              </div>
              <input ref={mainFileRef} type="file" accept="image/*" className="hidden" onChange={handleMainImageUpload} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 gap-1 shrink-0"
                onClick={() => mainFileRef.current?.click()}
                disabled={uploadingMain}
              >
                {uploadingMain ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                Subir
              </Button>
            </div>
          </div>

          {/* Imágenes adicionales */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Imágenes adicionales</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => setFormData(prev => ({ ...prev, images: [...prev.images, ''] }))}
              >
                <ImagePlus className="h-3.5 w-3.5" /> Agregar
              </Button>
            </div>
            {formData.images.map((img, i) => (
              <div key={i} className="space-y-1">
                {img && (
                  <div className="relative w-16 h-16 rounded-md overflow-hidden border border-border">
                    <img src={img} alt={`Extra ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    type="url"
                    value={img}
                    onChange={(e) => {
                      const newImages = [...formData.images];
                      newImages[i] = e.target.value;
                      setFormData(prev => ({ ...prev, images: newImages }));
                    }}
                    placeholder="https://..."
                    className="h-9 text-sm"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`extra-img-${i}`}
                    onChange={(e) => handleExtraImageUpload(e, i)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() => document.getElementById(`extra-img-${i}`)?.click()}
                    disabled={uploadingExtra === i}
                  >
                    {uploadingExtra === i ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Badge - compacto */}
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
