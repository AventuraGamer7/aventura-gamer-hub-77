import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, GraduationCap } from 'lucide-react';

const AddCourseForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    content: '',
    cover: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price) {
      toast({
        title: "Error",
        description: "Título y precio son campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('courses')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            content: formData.content,
            cover: formData.cover
          }
        ]);

      if (error) throw error;

      toast({
        title: "¡Curso agregado!",
        description: "El curso se ha agregado exitosamente.",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        content: '',
        cover: ''
      });
      
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error adding course:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el curso. Inténtalo nuevamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="gaming-secondary" size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Agregar Curso
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-glow flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Agregar Nuevo Curso
          </DialogTitle>
          <DialogDescription>
            Completa la información del curso para agregarlo a la plataforma
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título del Curso *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ej: Reparación de Consolas PlayStation"
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
                placeholder="150000"
                min="0"
                step="1000"
                required
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
              placeholder="Descripción breve del curso..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido del Curso</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Temario detallado y contenido del curso..."
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">URL de la Imagen de Portada</Label>
            <Input
              id="cover"
              name="cover"
              type="url"
              value={formData.cover}
              onChange={handleInputChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
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
              variant="gaming-secondary"
              disabled={loading}
            >
              {loading ? 'Agregando...' : 'Agregar Curso'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseForm;