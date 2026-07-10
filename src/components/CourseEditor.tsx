import React, { useState, useEffect, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProductImageUploader from '@/components/ProductImageUploader';
import {
  Plus, X, ChevronDown, GraduationCap, Save, Loader2, BookOpen,
  Target, ListChecks, Package,
} from 'lucide-react';

interface Lesson {
  title: string;
  duration: number;
  description: string;
}
interface Module {
  module: string;
  lessons: Lesson[];
}

interface CourseEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: any | null; // null/undefined => create mode
  onSaved?: () => void;
}

const emptyCourse = {
  title: '',
  description: '',
  price: 0,
  cover: '',
  content: '',
  duration_weeks: 4,
  level: 'principiante',
  estimated_students: 0,
  has_certification: false,
};

const CourseEditor = ({ open, onOpenChange, course, onSaved }: CourseEditorProps) => {
  const { toast } = useToast();
  const isEdit = Boolean(course?.id);

  const [data, setData] = useState<any>(emptyCourse);
  const [curriculum, setCurriculum] = useState<Module[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [includes, setIncludes] = useState<string[]>([]);
  const [outcomes, setOutcomes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (course) {
      setData({
        ...emptyCourse,
        ...course,
        duration_weeks: course.duration_weeks || 4,
        level: course.level || 'principiante',
        estimated_students: course.estimated_students || 0,
        has_certification: course.has_certification || false,
      });
      setCurriculum(Array.isArray(course.curriculum) ? course.curriculum : []);
      setRequirements(Array.isArray(course.requirements) ? course.requirements : []);
      setIncludes(Array.isArray(course.includes) ? course.includes : []);
      setOutcomes(Array.isArray(course.learning_outcomes) ? course.learning_outcomes : []);
    } else {
      setData(emptyCourse);
      setCurriculum([]);
      setRequirements([]);
      setIncludes([]);
      setOutcomes([]);
    }
  }, [open, course]);

  const handleChange = (field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.title || !data.price) {
      toast({
        title: 'Faltan datos',
        description: 'Título y precio son obligatorios',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.description || null,
        price: parseFloat(data.price),
        cover: data.cover || null,
        content: data.content || null,
        duration_weeks: parseInt(data.duration_weeks) || 4,
        level: data.level,
        estimated_students: parseInt(data.estimated_students) || 0,
        has_certification: data.has_certification,
        curriculum: curriculum.filter((m) => m.module?.trim()) as any,
        requirements: requirements.filter((r) => r.trim()),
        includes: includes.filter((i) => i.trim()),
        learning_outcomes: outcomes.filter((o) => o.trim()),
      };

      const { error } = isEdit
        ? await supabase.from('courses').update(payload as any).eq('id', course.id)
        : await supabase.from('courses').insert([payload as any]);

      if (error) throw error;

      toast({
        title: isEdit ? 'Curso actualizado' : 'Curso creado',
        description: `${data.title} se guardó correctamente.`,
      });
      onOpenChange(false);
      onSaved?.();
    } catch (err: any) {
      console.error('Error saving course:', err);
      toast({
        title: 'Error',
        description: err.message || 'No se pudo guardar el curso',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            {isEdit ? 'Editar Curso' : 'Nuevo Curso'}
          </DialogTitle>
          <DialogDescription>
            Completa la información principal. Los detalles avanzados son opcionales.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: Info básica */}
          <section className="space-y-4">
            <SectionHeader icon={GraduationCap} title="Información básica" />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Título del curso *</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Ej: Reparación de Consolas PlayStation"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descripción corta</Label>
                <Textarea
                  id="description"
                  value={data.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={2}
                  placeholder="Una línea que describa el curso"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio (COP) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1000"
                  value={data.price || ''}
                  onChange={(e) => handleChange('price', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duración (semanas)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={data.duration_weeks || ''}
                  onChange={(e) => handleChange('duration_weeks', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Nivel</Label>
                <Select value={data.level} onValueChange={(v) => handleChange('level', v)}>
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
                <Label htmlFor="students">Estudiantes estimados</Label>
                <Input
                  id="students"
                  type="number"
                  min="0"
                  value={data.estimated_students || ''}
                  onChange={(e) => handleChange('estimated_students', e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 md:col-span-2 pt-2">
                <Checkbox
                  id="cert"
                  checked={data.has_certification}
                  onCheckedChange={(c) => handleChange('has_certification', !!c)}
                />
                <Label htmlFor="cert" className="cursor-pointer">
                  Incluye certificación
                </Label>
              </div>
            </div>
          </section>

          {/* SECTION 2: Portada */}
          <section className="space-y-3">
            <SectionHeader icon={Package} title="Imagen de portada" />
            <ProductImageUploader
              images={data.cover ? [data.cover] : []}
              onChange={(imgs) => handleChange('cover', imgs[0] || '')}
            />
          </section>

          {/* SECTION 3: Temario simple */}
          <section className="space-y-3">
            <SectionHeader
              icon={BookOpen}
              title="Temario"
              action={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurriculum([...curriculum, { module: '', lessons: [] }])}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Módulo
                </Button>
              }
            />
            {curriculum.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                Sin módulos. Agrega los temas principales del curso.
              </p>
            ) : (
              <div className="space-y-2">
                {curriculum.map((mod, idx) => (
                  <ModuleRow
                    key={idx}
                    index={idx}
                    module={mod}
                    onChange={(next) => {
                      const arr = [...curriculum];
                      arr[idx] = next;
                      setCurriculum(arr);
                    }}
                    onRemove={() => setCurriculum(curriculum.filter((_, i) => i !== idx))}
                  />
                ))}
              </div>
            )}
          </section>

          {/* SECTION 4: Chips */}
          <div className="grid md:grid-cols-3 gap-4">
            <ChipList
              icon={Target}
              title="Lo que aprenderás"
              items={outcomes}
              onChange={setOutcomes}
              placeholder="Ej: Diagnóstico profesional"
            />
            <ChipList
              icon={ListChecks}
              title="Requisitos"
              items={requirements}
              onChange={setRequirements}
              placeholder="Ej: Conocimientos básicos de electrónica"
            />
            <ChipList
              icon={Package}
              title="Qué incluye"
              items={includes}
              onChange={setIncludes}
              placeholder="Ej: Material descargable"
            />
          </div>

          {/* Sticky footer */}
          <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-background pb-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="gaming" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isEdit ? 'Guardar cambios' : 'Crear curso'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const SectionHeader = ({ icon: Icon, title, action }: any) => (
  <div className="flex items-center justify-between border-b border-border/40 pb-2">
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary" />
      <h3 className="font-semibold">{title}</h3>
    </div>
    {action}
  </div>
);

const ModuleRow = ({
  index,
  module,
  onChange,
  onRemove,
}: {
  index: number;
  module: Module;
  onChange: (m: Module) => void;
  onRemove: () => void;
}) => {
  const [openLessons, setOpenLessons] = useState(false);

  return (
    <Card className="p-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground font-mono w-8">#{index + 1}</span>
        <Input
          placeholder="Nombre del módulo"
          value={module.module}
          onChange={(e) => onChange({ ...module, module: e.target.value })}
          className="flex-1"
        />
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Collapsible open={openLessons} onOpenChange={setOpenLessons}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <ChevronDown
              className={`h-3 w-3 transition-transform ${openLessons ? 'rotate-180' : ''}`}
            />
            Detallar lecciones ({module.lessons.length})
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {module.lessons.map((lesson, li) => (
            <div key={li} className="flex gap-2">
              <Input
                placeholder="Título de la lección"
                value={lesson.title}
                onChange={(e) => {
                  const lessons = [...module.lessons];
                  lessons[li] = { ...lesson, title: e.target.value };
                  onChange({ ...module, lessons });
                }}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="min"
                value={lesson.duration || ''}
                onChange={(e) => {
                  const lessons = [...module.lessons];
                  lessons[li] = { ...lesson, duration: parseInt(e.target.value) || 0 };
                  onChange({ ...module, lessons });
                }}
                className="w-20"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange({ ...module, lessons: module.lessons.filter((_, i) => i !== li) })}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({
                ...module,
                lessons: [...module.lessons, { title: '', duration: 0, description: '' }],
              })
            }
          >
            <Plus className="h-3 w-3 mr-1" />
            Lección
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

const ChipList = ({
  icon: Icon,
  title,
  items,
  onChange,
  placeholder,
}: {
  icon: any;
  title: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) => {
  const [draft, setDraft] = useState('');
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft('');
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    }
  };

  return (
    <div className="space-y-2 p-3 border border-border/40 rounded-lg bg-card/30">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      <div className="flex gap-1">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          placeholder={placeholder}
          className="h-8 text-xs"
        />
        <Button type="button" size="sm" variant="outline" onClick={add} className="h-8 px-2">
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((it, i) => (
          <Badge key={i} variant="secondary" className="pl-2 pr-1 py-1 gap-1">
            <span className="text-xs">{it}</span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="hover:bg-destructive/20 rounded p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CourseEditor;
