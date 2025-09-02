import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useProductImages } from '@/hooks/useProductImages';
import { Plus, Trash2, Edit, Image as ImageIcon, GripVertical } from 'lucide-react';

interface ProductImageManagerProps {
  productId: string;
  onImagesChange?: (images: string[]) => void;
}

const ProductImageManager = ({ productId, onImagesChange }: ProductImageManagerProps) => {
  const { images, loading, addImage, updateImage, deleteImage, reorderImages } = useProductImages(productId);
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<any>(null);
  const [imageForm, setImageForm] = useState({
    image_url: '',
    alt_text: '',
    is_primary: false
  });

  const resetForm = () => {
    setImageForm({
      image_url: '',
      alt_text: '',
      is_primary: false
    });
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageForm.image_url) {
      toast({
        title: "Error",
        description: "La URL de la imagen es requerida",
        variant: "destructive"
      });
      return;
    }

    try {
      await addImage(productId, {
        ...imageForm,
        display_order: images.length
      });

      toast({
        title: "Imagen agregada",
        description: "La imagen se ha agregado exitosamente"
      });

      resetForm();
      setIsAddOpen(false);
      
      // Notify parent component of changes
      if (onImagesChange) {
        onImagesChange([...images.map(img => img.image_url), imageForm.image_url]);
      }
    } catch (error: any) {
      console.error('Error adding image:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar la imagen",
        variant: "destructive"
      });
    }
  };

  const handleEditImage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingImage) return;

    try {
      await updateImage(editingImage.id, imageForm);

      toast({
        title: "Imagen actualizada",
        description: "La imagen se ha actualizado exitosamente"
      });

      setIsEditOpen(false);
      setEditingImage(null);
      resetForm();
    } catch (error: any) {
      console.error('Error updating image:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la imagen",
        variant: "destructive"
      });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteImage(imageId);
      
      toast({
        title: "Imagen eliminada",
        description: "La imagen se ha eliminado exitosamente"
      });

      // Notify parent component of changes
      if (onImagesChange) {
        onImagesChange(images.filter(img => img.id !== imageId).map(img => img.image_url));
      }
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la imagen",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (image: any) => {
    setEditingImage(image);
    setImageForm({
      image_url: image.image_url,
      alt_text: image.alt_text || '',
      is_primary: image.is_primary
    });
    setIsEditOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Imágenes del Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Cargando imágenes...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Imágenes del Producto ({images.length})</span>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Imagen
              </Button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nueva Imagen</DialogTitle>
                <DialogDescription>
                  Agrega una nueva imagen al producto
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddImage} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url">URL de la Imagen *</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={imageForm.image_url}
                    onChange={(e) => setImageForm(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alt_text">Texto Alternativo</Label>
                  <Input
                    id="alt_text"
                    value={imageForm.alt_text}
                    onChange={(e) => setImageForm(prev => ({ ...prev, alt_text: e.target.value }))}
                    placeholder="Descripción de la imagen"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_primary"
                    checked={imageForm.is_primary}
                    onChange={(e) => setImageForm(prev => ({ ...prev, is_primary: e.target.checked }))}
                  />
                  <Label htmlFor="is_primary">Imagen principal</Label>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="gaming">
                    Agregar Imagen
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay imágenes agregadas</p>
            <p className="text-sm text-muted-foreground">Agrega la primera imagen del producto</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={image.id} className="relative group">
                <div className="relative rounded-lg overflow-hidden border-2 border-border hover:border-primary/50 transition-colors">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || `Imagen ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  
                  {image.is_primary && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Principal
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(image)}
                        className="bg-background/90"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {image.alt_text || 'Sin descripción'}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Imagen</DialogTitle>
              <DialogDescription>
                Modifica la información de la imagen
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEditImage} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_image_url">URL de la Imagen *</Label>
                <Input
                  id="edit_image_url"
                  type="url"
                  value={imageForm.image_url}
                  onChange={(e) => setImageForm(prev => ({ ...prev, image_url: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_alt_text">Texto Alternativo</Label>
                <Input
                  id="edit_alt_text"
                  value={imageForm.alt_text}
                  onChange={(e) => setImageForm(prev => ({ ...prev, alt_text: e.target.value }))}
                  placeholder="Descripción de la imagen"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit_is_primary"
                  checked={imageForm.is_primary}
                  onChange={(e) => setImageForm(prev => ({ ...prev, is_primary: e.target.checked }))}
                />
                <Label htmlFor="edit_is_primary">Imagen principal</Label>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="gaming">
                  Actualizar Imagen
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ProductImageManager;