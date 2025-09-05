import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCourses } from '@/hooks/useCourses';
import { useProfile } from '@/hooks/useProfile';
import { Edit, Trash2, Plus, X, Clock, Users, Award, BookOpen } from 'lucide-react';

interface Module {
  module: string;
  lessons: {
    title: string;
    duration: number;
    description: string;
  }[];
}

const CourseManagementPanel = () => {
  const { toast } = useToast();
  const { isSuperadmin } = useProfile();
  const { courses } = useCourses();
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para campos estructurados
  const [curriculum, setCurriculum] = useState<Module[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [includes, setIncludes] = useState<string[]>([]);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([]);

  const handleEdit = (course: any) => {
    setEditingCourse({
      ...course,
      duration_weeks: course.duration_weeks || 4,
      level: course.level || 'principiante',
      estimated_students: course.estimated_students || 0,
      has_certification: course.has_certification || false
    });
    
    // Cargar datos estructurados
    setCurriculum(course.curriculum || []);
    setRequirements(course.requirements || []);
    setIncludes(course.includes || []);
    setLearningOutcomes(course.learning_outcomes || []);
    
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!isSuperadmin()) {
      toast({
        title: "Sin permisos",
        description: "Solo el superadmin puede eliminar cursos.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Curso eliminado",
        description: "El curso se ha eliminado exitosamente.",
      });
    } catch (error: any) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el curso.",
        variant: "destructive"
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          ...editingCourse,
          curriculum,
          requirements,
          includes,
          learning_outcomes: learningOutcomes,
          price: parseFloat(editingCourse.price)
        })
        .eq('id', editingCourse.id);

      if (error) throw error;

      toast({
        title: "Curso actualizado",
        description: "El curso se ha actualizado exitosamente.",
      });

      setIsEditOpen(false);
      setEditingCourse(null);
    } catch (error: any) {
      console.error('Error updating course:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el curso.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingCourse((prev: any) => ({ ...prev, [name]: value }));
  };

  // Funciones para manejar módulos del curriculum
  const addModule = () => {
    setCurriculum([...curriculum, { module: '', lessons: [] }]);
  };

  const updateModule = (index: number, field: string, value: string) => {
    const updated = [...curriculum];
    updated[index] = { ...updated[index], [field]: value };
    setCurriculum(updated);
  };

  const removeModule = (index: number) => {
    setCurriculum(curriculum.filter((_, i) => i !== index));
  };

  const addLesson = (moduleIndex: number) => {
    const updated = [...curriculum];
    updated[moduleIndex].lessons.push({ title: '', duration: 60, description: '' });
    setCurriculum(updated);
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: any) => {
    const updated = [...curriculum];
    updated[moduleIndex].lessons[lessonIndex] = {
      ...updated[moduleIndex].lessons[lessonIndex],
      [field]: field === 'duration' ? parseInt(value) || 0 : value
    };
    setCurriculum(updated);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...curriculum];
    updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
    setCurriculum(updated);
  };

  // Funciones para manejar arrays de strings
  const addStringToArray = (setter: React.Dispatch<React.SetStateAction<string[]>>, array: string[]) => {
    setter([...array, '']);
  };

  const updateStringInArray = (setter: React.Dispatch<React.SetStateAction<string[]>>, array: string[], index: number, value: string) => {
    const updated = [...array];
    updated[index] = value;
    setter(updated);
  };

  const removeStringFromArray = (setter: React.Dispatch<React.SetStateAction<string[]>>, array: string[], index: number) => {
    setter(array.filter((_, i) => i !== index));
  };

  return (
    <Card className="card-gaming border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Gestión de Cursos
        </CardTitle>
        <CardDescription>
          Gestiona todos los aspectos de los cursos. {isSuperadmin() ? 'Puedes editar y eliminar.' : 'Solo puedes editar.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No hay cursos registrados aún.
            </p>
          ) : (
            <div className="grid gap-4">
              {courses?.map((course: any) => (
                <div key={course.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">{course.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.estimated_students || 0} estudiantes
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration_weeks || 4} semanas
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {course.level || 'principiante'}
                      </span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          minimumFractionDigits: 0
                        }).format(course.price)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(course)}
                    >
                      <Edit className="h-4 w-4" />
                      Editar
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
                              Esta acción no se puede deshacer. El curso será eliminado permanentemente.
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
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Editar Curso Completo</DialogTitle>
              <DialogDescription>
                Modifica todos los aspectos del curso de manera integral
              </DialogDescription>
            </DialogHeader>

            {editingCourse && (
              <form onSubmit={handleUpdate} className="space-y-6">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="curriculum">Temario</TabsTrigger>
                    <TabsTrigger value="requirements">Requisitos</TabsTrigger>
                    <TabsTrigger value="includes">Incluye</TabsTrigger>
                    <TabsTrigger value="outcomes">Aprenderás</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                          id="title"
                          name="title"
                          value={editingCourse.title || ''}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price">Precio (COP) *</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={editingCourse.price || ''}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration_weeks">Duración (semanas)</Label>
                        <Input
                          id="duration_weeks"
                          name="duration_weeks"
                          type="number"
                          value={editingCourse.duration_weeks || ''}
                          onChange={handleInputChange}
                          min="1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="level">Nivel</Label>
                        <Select 
                          value={editingCourse.level || 'principiante'} 
                          onValueChange={(value) => setEditingCourse(prev => ({ ...prev, level: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="principiante">Principiante</SelectItem>
                            <SelectItem value="intermedio">Intermedio</SelectItem>
                            <SelectItem value="avanzado">Avanzado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="estimated_students">Estudiantes Estimados</Label>
                        <Input
                          id="estimated_students"
                          name="estimated_students"
                          type="number"
                          value={editingCourse.estimated_students || ''}
                          onChange={handleInputChange}
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cover">URL Imagen de Portada</Label>
                        <Input
                          id="cover"
                          name="cover"
                          value={editingCourse.cover || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={editingCourse.description || ''}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="has_certification"
                        checked={editingCourse.has_certification || false}
                        onCheckedChange={(checked) => 
                          setEditingCourse(prev => ({ ...prev, has_certification: checked }))
                        }
                      />
                      <Label htmlFor="has_certification">Incluye certificación</Label>
                    </div>
                  </TabsContent>

                  <TabsContent value="curriculum" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Temario del Curso</h3>
                      <Button type="button" onClick={addModule} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Módulo
                      </Button>
                    </div>
                    
                    {curriculum.map((module, moduleIndex) => (
                      <Card key={moduleIndex} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Nombre del módulo"
                              value={module.module}
                              onChange={(e) => updateModule(moduleIndex, 'module', e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeModule(moduleIndex)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="ml-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Lecciones</h4>
                              <Button
                                type="button"
                                onClick={() => addLesson(moduleIndex)}
                                variant="outline"
                                size="sm"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Lección
                              </Button>
                            </div>
                            
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="grid grid-cols-12 gap-2 items-start">
                                <Input
                                  className="col-span-5"
                                  placeholder="Título de la lección"
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                                />
                                <Input
                                  className="col-span-2"
                                  type="number"
                                  placeholder="Minutos"
                                  value={lesson.duration}
                                  onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'duration', e.target.value)}
                                />
                                <Input
                                  className="col-span-4"
                                  placeholder="Descripción"
                                  value={lesson.description}
                                  onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'description', e.target.value)}
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="col-span-1"
                                  onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="requirements" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Requisitos del Curso</h3>
                      <Button 
                        type="button" 
                        onClick={() => addStringToArray(setRequirements, requirements)} 
                        variant="outline" 
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Requisito
                      </Button>
                    </div>
                    
                    {requirements.map((requirement, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Requisito del curso"
                          value={requirement}
                          onChange={(e) => updateStringInArray(setRequirements, requirements, index, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeStringFromArray(setRequirements, requirements, index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="includes" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">¿Qué Incluye el Curso?</h3>
                      <Button 
                        type="button" 
                        onClick={() => addStringToArray(setIncludes, includes)} 
                        variant="outline" 
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Elemento
                      </Button>
                    </div>
                    
                    {includes.map((include, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Qué incluye (ej: Videos, Material descargable, Soporte)"
                          value={include}
                          onChange={(e) => updateStringInArray(setIncludes, includes, index, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeStringFromArray(setIncludes, includes, index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="outcomes" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">¿Qué Aprenderás?</h3>
                      <Button 
                        type="button" 
                        onClick={() => addStringToArray(setLearningOutcomes, learningOutcomes)} 
                        variant="outline" 
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Aprendizaje
                      </Button>
                    </div>
                    
                    {learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Competencia o aprendizaje adquirido"
                          value={outcome}
                          onChange={(e) => updateStringInArray(setLearningOutcomes, learningOutcomes, index, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeStringFromArray(setLearningOutcomes, learningOutcomes, index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3 pt-4 border-t">
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

export default CourseManagementPanel;