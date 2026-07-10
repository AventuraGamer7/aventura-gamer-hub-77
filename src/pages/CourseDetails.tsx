import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useCourses } from '@/hooks/useCourses';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import {
  GraduationCap, Clock, Users, Award, CheckCircle,
  ShoppingCart, ArrowLeft, BookOpen, Target, TrendingUp, Package,
} from 'lucide-react';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, loading, error } = useCourses();
  const { addItem } = useCart();
  const { toast } = useToast();

  const course = courses.find((c) => c.id === id);

  const handleAddToCart = () => {
    if (!course) return;
    addItem({
      id: course.id,
      name: course.title,
      price: course.price,
      image: course.cover || undefined,
      type: 'course',
    });
    toast({ title: 'Curso agregado', description: `${course.title} se agregó al carrito` });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center h-64 pt-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center py-12">
            <p className="text-destructive">Curso no encontrado</p>
            <Button variant="gaming" onClick={() => navigate('/cursos')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Cursos
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const hasCurriculum = Array.isArray(course.curriculum) && course.curriculum.length > 0;
  const hasOutcomes = Array.isArray(course.learning_outcomes) && course.learning_outcomes.length > 0;
  const hasRequirements = Array.isArray(course.requirements) && course.requirements.length > 0;
  const hasIncludes = Array.isArray(course.includes) && course.includes.length > 0;

  const totalLessons = hasCurriculum
    ? course.curriculum.reduce((acc: number, m: any) => acc + (Array.isArray(m.lessons) ? m.lessons.length : 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WhatsAppFloat />

      {/* Hero */}
      <section className="relative pt-24 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="relative container mx-auto px-4">
          <Button variant="outline" onClick={() => navigate('/cursos')} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Cursos
          </Button>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl bg-muted">
              {course.cover ? (
                <>
                  <img src={course.cover} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                    {course.level && (
                      <Badge className="capitalize" variant="secondary">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        {course.level}
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      <Clock className="mr-1 h-3 w-3" />
                      {course.duration_weeks || 4} semanas
                    </Badge>
                    {course.has_certification && (
                      <Badge className="bg-primary text-primary-foreground">
                        <Award className="mr-1 h-3 w-3" />
                        Certificado
                      </Badge>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <GraduationCap className="h-24 w-24 text-primary/30" />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-glow mb-3">{course.title}</h1>
                <p className="text-lg text-muted-foreground">
                  {course.description || 'Conviértete en un experto en reparación gaming con nuestro curso especializado.'}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Stat icon={Clock} label="Duración" value={`${course.duration_weeks || 4} sem`} />
                <Stat icon={TrendingUp} label="Nivel" value={course.level || 'Principiante'} />
                <Stat icon={Users} label="Estudiantes" value={`${course.estimated_students || 0}+`} />
                <Stat icon={Award} label="Certificado" value={course.has_certification ? 'Sí' : 'No'} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content + sticky sidebar */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main */}
            <div className="lg:col-span-2 space-y-10">
              {hasCurriculum ? (
                <div>
                  <h2 className="text-2xl font-bold text-neon mb-2 flex items-center">
                    <BookOpen className="mr-3 h-6 w-6" />
                    Temario del Curso
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {course.curriculum.length} módulos
                    {totalLessons > 0 && ` · ${totalLessons} lecciones`}
                  </p>
                  <Accordion type="multiple" className="space-y-2">
                    {course.curriculum.map((module: any, idx: number) => {
                      const lessons = Array.isArray(module.lessons) ? module.lessons : [];
                      return (
                        <AccordionItem
                          key={idx}
                          value={`module-${idx}`}
                          className="border border-border/50 rounded-lg px-4 bg-card/30"
                        >
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex-1 flex items-center justify-between pr-3">
                              <span className="text-left font-semibold">
                                Módulo {idx + 1}: {module.module}
                              </span>
                              {lessons.length > 0 && (
                                <Badge variant="outline" className="ml-3 shrink-0">
                                  {lessons.length} lecciones
                                </Badge>
                              )}
                            </div>
                          </AccordionTrigger>
                          {lessons.length > 0 && (
                            <AccordionContent>
                              <ul className="space-y-2">
                                {lessons.map((lesson: any, li: number) => (
                                  <li
                                    key={li}
                                    className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm"
                                  >
                                    <div>
                                      <div className="font-medium">{lesson.title}</div>
                                      {lesson.description && (
                                        <div className="text-xs text-muted-foreground">{lesson.description}</div>
                                      )}
                                    </div>
                                    {lesson.duration ? (
                                      <Badge variant="outline" className="text-xs shrink-0">
                                        <Clock className="mr-1 h-3 w-3" />
                                        {lesson.duration} min
                                      </Badge>
                                    ) : null}
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          )}
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              ) : course.content ? (
                <div>
                  <h2 className="text-2xl font-bold text-neon mb-4 flex items-center">
                    <BookOpen className="mr-3 h-6 w-6" />
                    Contenido del Curso
                  </h2>
                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <div className="whitespace-pre-wrap text-muted-foreground">{course.content}</div>
                    </CardContent>
                  </Card>
                </div>
              ) : null}

              {hasOutcomes && (
                <div>
                  <h2 className="text-2xl font-bold text-neon mb-6 flex items-center">
                    <Target className="mr-3 h-6 w-6" />
                    Lo que aprenderás
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {course.learning_outcomes.map((outcome: string, i: number) => (
                      <div key={i} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <Card className="border-primary/30">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Precio del curso</div>
                    <div className="text-3xl font-bold text-primary">{formatPrice(course.price)}</div>
                  </div>
                  <Button variant="gaming" size="lg" className="w-full" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Inscribirse Ahora
                  </Button>
                  {course.has_certification && (
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      Certificación incluida al finalizar
                    </div>
                  )}
                </CardContent>
              </Card>

              {hasRequirements && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Requisitos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {course.requirements.map((req: string, i: number) => (
                      <div key={i} className="flex items-start space-x-3">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{req}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {hasIncludes && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">¿Qué Incluye?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {course.includes.map((inc: string, i: number) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-sm">{inc}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="text-center p-3 bg-card/50 rounded-lg border border-border/50">
    <Icon className="h-5 w-5 text-primary mx-auto mb-1.5" />
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="font-semibold text-sm capitalize">{value}</div>
  </div>
);

export default CourseDetails;
