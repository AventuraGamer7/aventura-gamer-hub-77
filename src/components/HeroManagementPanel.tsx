import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useHeroSlides, HeroSlide } from '@/hooks/useHeroSlides';
import { useProfile } from '@/hooks/useProfile';
import { Edit, Trash2, Image as ImageIcon, Eye, EyeOff, ArrowUp, ArrowDown, Monitor } from 'lucide-react';
import AddHeroSlideForm from './AddHeroSlideForm';

const HeroManagementPanel = () => {
  const { slides, loading, error, updateSlide, deleteSlide, toggleSlideActive, reorderSlides } = useHeroSlides();
  const { canCreateContent, canDeleteContent } = useProfile();
  const { toast } = useToast();
  
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [previewSlide, setPreviewSlide] = useState<HeroSlide | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide({ ...slide });
    setIsEditOpen(true);
  };

  const handlePreview = (slide: HeroSlide) => {
    setPreviewSlide(slide);
    setIsPreviewOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDeleteContent()) {
      toast({
        title: "Sin permisos",
        description: "Solo el superadmin puede eliminar slides.",
        variant: "destructive"
      });
      return;
    }

    try {
      await deleteSlide(id);
      toast({
        title: "Slide eliminado",
        description: "El slide se ha eliminado exitosamente.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el slide.",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      await toggleSlideActive(slide.id, !slide.is_active);
      toast({
        title: slide.is_active ? "Slide desactivado" : "Slide activado",
        description: `El slide se ha ${slide.is_active ? 'desactivado' : 'activado'} exitosamente.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del slide.",
        variant: "destructive"
      });
    }
  };

  const handleReorder = async (slideId: string, direction: 'up' | 'down') => {
    const currentSlide = slides.find(s => s.id === slideId);
    if (!currentSlide) return;

    const newOrder = direction === 'up' 
      ? Math.max(1, currentSlide.display_order - 1)
      : currentSlide.display_order + 1;

    try {
      await reorderSlides(slideId, newOrder);
      toast({
        title: "Orden actualizado",
        description: "El orden del slide se ha actualizado.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo cambiar el orden del slide.",
        variant: "destructive"
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    setUpdateLoading(true);
    
    try {
      await updateSlide(editingSlide.id, editingSlide);
      toast({
        title: "Slide actualizado",
        description: "El slide se ha actualizado exitosamente.",
      });
      setIsEditOpen(false);
      setEditingSlide(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el slide.",
        variant: "destructive"
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setEditingSlide(prev => prev ? {
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    } : null);
  };

  const handleSwitchChange = (checked: boolean) => {
    setEditingSlide(prev => prev ? {
      ...prev,
      is_active: checked
    } : null);
  };

  if (!canCreateContent()) {
    return (
      <Card className="card-gaming border-destructive/30">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold text-destructive mb-2">Acceso Denegado</h3>
          <p className="text-muted-foreground">Solo los administradores pueden gestionar los slides del hero.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="card-gaming border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary shadow-glow mx-auto"></div>
          <p className="text-muted-foreground mt-4">Cargando slides...</p>
        </CardContent>
      </Card>
    );
  }

  // Show setup message since table doesn't exist yet
  const showSetupMessage = slides.length === 0 && !error;

  return (
    <div className="space-y-6">
      <Card className="card-gaming border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-glow">
                <Monitor className="h-5 w-5" />
                Gestión del Hero
              </CardTitle>
              <CardDescription>
                Administra los slides del carrusel principal de la página de inicio
              </CardDescription>
            </div>
            <AddHeroSlideForm />
          </div>
        </CardHeader>
        <CardContent>
          {showSetupMessage ? (
            <div className="text-center py-12 space-y-6">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-glow">¡Configuración Requerida!</h3>
                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Para usar la gestión del hero, necesitas crear la tabla `hero_slides` en tu base de datos Supabase.
                </p>
                <Card className="card-gaming border-primary/20 p-6 text-left max-w-2xl mx-auto">
                  <h4 className="font-semibold mb-3 text-primary">SQL para crear la tabla:</h4>
                  <pre className="text-sm bg-muted/30 p-4 rounded-lg overflow-x-auto">
{`CREATE TABLE hero_slides (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  subtitle text NOT NULL,
  description text NOT NULL,
  button_text text NOT NULL,
  button_url text NOT NULL,
  image_url text NOT NULL,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Enable RLS
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Allow admins to do everything
CREATE POLICY "Admin can manage hero slides"
ON hero_slides FOR ALL
TO authenticated
USING (auth.jwt() ->> 'user_role' = 'admin' OR auth.jwt() ->> 'user_role' = 'superadmin');

-- Allow everyone to read active slides
CREATE POLICY "Everyone can view active hero slides"
ON hero_slides FOR SELECT
TO anon, authenticated
USING (is_active = true);`}
                  </pre>
                </Card>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>1. Ve al SQL Editor en tu dashboard de Supabase</p>
                  <p>2. Ejecuta el SQL de arriba para crear la tabla</p>
                  <p>3. ¡Listo! Podrás crear y gestionar slides del hero</p>
                </div>
              </div>
            </div>
          ) : slides.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No hay slides configurados aún.</p>
              <p className="text-sm text-muted-foreground">Crea tu primer slide para comenzar a gestionar el hero de la página principal.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {slides.map((slide) => (
                <div key={slide.id} className="p-4 bg-muted/20 rounded-lg border border-border/50">
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted/40 flex-shrink-0">
                      {slide.image_url ? (
                        <img 
                          src={slide.image_url} 
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground truncate">{slide.title}</h4>
                          <p className="text-sm text-muted-foreground truncate">{slide.subtitle}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{slide.description}</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={slide.is_active ? "default" : "secondary"} className="text-xs">
                              {slide.is_active ? 'Activo' : 'Inactivo'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Orden: {slide.display_order}
                            </Badge>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview(slide)}
                            title="Vista previa"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(slide)}
                            title={slide.is_active ? 'Desactivar' : 'Activar'}
                          >
                            {slide.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReorder(slide.id, 'up')}
                            disabled={slide.display_order === 1}
                            title="Mover arriba"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReorder(slide.id, 'down')}
                            title="Mover abajo"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(slide)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          {canDeleteContent() && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" title="Eliminar">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar slide?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. El slide será eliminado permanentemente del carrusel.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(slide.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-glow">Editar Slide del Hero</DialogTitle>
            <DialogDescription>
              Modifica la información del slide seleccionado
            </DialogDescription>
          </DialogHeader>

          {editingSlide && (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título Principal *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={editingSlide.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtítulo *</Label>
                  <Input
                    id="subtitle"
                    name="subtitle"
                    value={editingSlide.subtitle}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={editingSlide.description}
                  onChange={handleInputChange}
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
                    value={editingSlide.button_text}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="button_url">URL del Botón *</Label>
                  <Input
                    id="button_url"
                    name="button_url"
                    value={editingSlide.button_url}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL de la Imagen *</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={editingSlide.image_url}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={editingSlide.is_active}
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
                    value={editingSlide.display_order}
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
                  onClick={() => setIsEditOpen(false)}
                  disabled={updateLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="gaming"
                  disabled={updateLoading}
                  className="glow-hover"
                >
                  {updateLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Vista Previa del Slide</DialogTitle>
            <DialogDescription>
              Así se verá el slide en el hero de la página principal
            </DialogDescription>
          </DialogHeader>

          {previewSlide && (
            <div className="relative h-80 rounded-lg overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${previewSlide.image_url})`,
                  filter: 'brightness(0.3)'
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-secondary/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold text-glow">
                    {previewSlide.title}
                  </h1>
                  <p className="text-2xl text-secondary">
                    {previewSlide.subtitle}
                  </p>
                  <p className="text-muted-foreground max-w-2xl">
                    {previewSlide.description}
                  </p>
                  <Button variant="gaming" className="mt-4">
                    {previewSlide.button_text}
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

export default HeroManagementPanel;