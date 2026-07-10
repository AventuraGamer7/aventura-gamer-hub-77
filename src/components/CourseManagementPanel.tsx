import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCourses } from '@/hooks/useCourses';
import { useProfile } from '@/hooks/useProfile';
import CourseEditor from '@/components/CourseEditor';
import { Edit, Trash2, Plus, Clock, Users, Award, BookOpen } from 'lucide-react';

const formatPrice = (v: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(v);

const CourseManagementPanel = () => {
  const { toast } = useToast();
  const { isSuperadmin, canCreateContent } = useProfile();
  const { courses } = useCourses();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (course: any) => {
    setEditing(course);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!isSuperadmin()) {
      toast({
        title: 'Sin permisos',
        description: 'Solo el superadmin puede eliminar cursos.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Curso eliminado', description: 'El curso se eliminó correctamente.' });
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el curso.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Card className="card-gaming border-primary/20">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Gestión de Cursos
            </CardTitle>
            <CardDescription>
              {courses?.length || 0} cursos ·{' '}
              {isSuperadmin() ? 'Puedes crear, editar y eliminar.' : 'Puedes crear y editar.'}
            </CardDescription>
          </div>
          {canCreateContent() && (
            <Button variant="gaming" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Curso
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {courses?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No hay cursos registrados aún.</p>
              {canCreateContent() && (
                <Button variant="outline" onClick={openCreate} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear primer curso
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-3">
              {courses?.map((course: any) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {course.cover ? (
                      <img
                        src={course.cover}
                        alt=""
                        className="w-14 h-14 rounded object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="h-5 w-5 text-primary/50" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{course.title}</h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.estimated_students || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.duration_weeks || 4} sem
                        </span>
                        <span className="flex items-center gap-1 capitalize">
                          <Award className="h-3 w-3" />
                          {course.level || 'principiante'}
                        </span>
                        <span className="font-semibold text-primary">
                          {formatPrice(course.price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => openEdit(course)}>
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
                            <AlertDialogTitle>¿Eliminar curso?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. El curso "{course.title}" será eliminado permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(course.id)}>
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
        </CardContent>
      </Card>

      <CourseEditor open={open} onOpenChange={setOpen} course={editing} />
    </>
  );
};

export default CourseManagementPanel;
