import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { Plus, Eye, Image } from 'lucide-react';

const AddHeroSlideForm = () => {
  const { addSlide } = useHeroSlides();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    button_text: '',
    button_url: '',
    image_url: '',
    is_active: true,
    display_order: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addSlide(formData);
      
      toast({
        title: "Slide creado exitosamente",
        description: "El nuevo slide del hero ha sido agregado.",
      });

      // Reset form
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        button_text: '',
        button_url: '',
        image_url: '',
        is_active: true,
        display_order: 1
      });
      
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error al crear slide",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_active: checked
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gaming" className="glow-hover">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Slide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-glow">Crear Nuevo Slide del Hero</DialogTitle>
          <DialogDescription>
            Agrega un nuevo slide al carrusel principal de la página de inicio
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant={!previewMode ? "gaming" : "outline"}
            size="sm"
            onClick={() => setPreviewMode(false)}
          >
            Editar
          </Button>
          <Button
            variant={previewMode ? "gaming" : "outline"}
            size="sm"
            onClick={() => setPreviewMode(true)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>

        {previewMode ? (
          // Preview Mode
          <div className="space-y-4">
            <div className="relative h-64 rounded-lg overflow-hidden border border-primary/20">
              {formData.image_url ? (
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${formData.image_url})`,
                    filter: 'brightness(0.3)'
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Image className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-secondary/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <h1 className="text-3xl font-bold text-glow">
                    {formData.title || 'Título del Slide'}
                  </h1>
                  <p className="text-xl text-secondary">
                    {formData.subtitle || 'Subtítulo del slide'}
                  </p>
                  <p className="text-muted-foreground">
                    {formData.description || 'Descripción del contenido'}
                  </p>
                  <Button variant="gaming" className="mt-4">
                    {formData.button_text || 'Texto del Botón'}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p><strong>URL del botón:</strong> {formData.button_url || 'No especificado'}</p>
              <p><strong>Estado:</strong> {formData.is_active ? 'Activo' : 'Inactivo'}</p>
              <p><strong>Orden:</strong> {formData.display_order}</p>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título Principal *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Aventura Gamer"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo *</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  placeholder="Farmeando experiencia para tu mejor versión"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descripción detallada del slide..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="button_text">Texto del Botón *</Label>
                <Input
                  id="button_text"
                  name="button_text"
                  value={formData.button_text}
                  onChange={handleInputChange}
                  placeholder="Ver Servicios"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="button_url">URL del Botón *</Label>
                <Input
                  id="button_url"
                  name="button_url"
                  value={formData.button_url}
                  onChange={handleInputChange}
                  placeholder="/servicios"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">URL de la Imagen *</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                required
              />
              <p className="text-xs text-muted-foreground">
                Recomendado: 1920x1080px o superior. La imagen se oscurecerá automáticamente para mejor legibilidad del texto.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="is_active">Slide Activo</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Orden de Visualización</Label>
                <Input
                  id="display_order"
                  name="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="gaming"
                disabled={loading}
                className="glow-hover"
              >
                {loading ? 'Creando...' : 'Crear Slide'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddHeroSlideForm;