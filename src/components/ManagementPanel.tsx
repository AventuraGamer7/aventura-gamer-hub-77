import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProducts } from '@/hooks/useProducts';
import { useCourses } from '@/hooks/useCourses';
import { useServices } from '@/hooks/useServices';
import { useProfile } from '@/hooks/useProfile';
import { Edit, Trash2, ShoppingCart, GraduationCap, Wrench, Package } from 'lucide-react';

interface ManagementPanelProps {
  type: 'products' | 'courses' | 'services';
}

const ManagementPanel = ({ type }: ManagementPanelProps) => {
  const { toast } = useToast();
  const { isSuperadmin } = useProfile();
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get data based on type
  const { products } = useProducts();
  const { courses } = useCourses();  
  const { services } = useServices();

  const data = type === 'products' ? products : type === 'courses' ? courses : services;
  
  const getIcon = () => {
    switch (type) {
      case 'products': return <Package className="h-5 w-5" />;
      case 'courses': return <GraduationCap className="h-5 w-5" />;
      case 'services': return <Wrench className="h-5 w-5" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'products': return 'Gestión de Productos';
      case 'courses': return 'Gestión de Cursos';
      case 'services': return 'Gestión de Servicios';
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!isSuperadmin()) {
      toast({
        title: "Sin permisos",
        description: "Solo el superadmin puede eliminar elementos.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from(type)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Elemento eliminado",
        description: `El ${type.slice(0, -1)} se ha eliminado exitosamente.`,
      });
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el elemento.",
        variant: "destructive"
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from(type)
        .update(editingItem)
        .eq('id', editingItem.id);

      if (error) throw error;

      toast({
        title: "Elemento actualizado",
        description: `El ${type.slice(0, -1)} se ha actualizado exitosamente.`,
      });

      setIsEditOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el elemento.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingItem((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="card-gaming border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getIcon()}
          {getTitle()}
        </CardTitle>
        <CardDescription>
          Gestiona los {type} existentes. {isSuperadmin() ? 'Puedes editar y eliminar.' : 'Solo puedes editar.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No hay {type} registrados aún.
            </p>
          ) : (
            <div className="grid gap-4">
              {data?.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name || item.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0
                      }).format(item.price)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {isSuperadmin() && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar elemento?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. El elemento será eliminado permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.id)}>
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
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar {type.slice(0, -1)}</DialogTitle>
              <DialogDescription>
                Modifica la información del elemento seleccionado
              </DialogDescription>
            </DialogHeader>

            {editingItem && (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {type === 'courses' ? 'Título' : 'Nombre'} *
                  </Label>
                  <Input
                    id="name"
                    name={type === 'courses' ? 'title' : 'name'}
                    value={editingItem.title || editingItem.name || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={editingItem.description || ''}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Precio *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={editingItem.price || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {type === 'products' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={editingItem.stock || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría</Label>
                      <Input
                        id="category"
                        name="category"
                        value={editingItem.category || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                {type === 'courses' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="content">Contenido del Curso</Label>
                      <Textarea
                        id="content"
                        name="content"
                        value={editingItem.content || ''}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cover">URL de la Imagen</Label>
                      <Input
                        id="cover"
                        name="cover"
                        value={editingItem.cover || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                {type === 'services' && (
                  <div className="space-y-2">
                    <Label htmlFor="image">URL de la Imagen</Label>
                    <Input
                      id="image"
                      name="image"
                      value={editingItem.image || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

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
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ManagementPanel;