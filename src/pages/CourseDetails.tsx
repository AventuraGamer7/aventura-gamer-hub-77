import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useCourses } from '@/hooks/useCourses';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { 
  GraduationCap, 
  Clock, 
  Users, 
  Award, 
  PlayCircle, 
  CheckCircle, 
  ShoppingCart,
  ArrowLeft,
  Star,
  BookOpen,
  Target,
  TrendingUp,
  Check,
  Package
} from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, loading, error } = useCourses();
  const { addItem } = useCart();
  const { toast } = useToast();

  const course = courses.find(c => c.id === id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!course) return;
    
    addItem({
      id: course.id,
      name: course.title,
      price: course.price,
      image: course.cover || undefined,
      type: 'course'
    });
    
    toast({
      title: 'Curso agregado',
      description: `${course.title} se agregó al carrito`
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center h-64 pt-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
            <p className="text-red-500">Curso no encontrado</p>
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

  // Mock data for course details (in a real app, this would come from the database)
  const courseDetails = {
    duration: "6 semanas",
    level: "Intermedio",
    students: "150+",
    rating: 4.8,
    modules: [
      {
        title: "Introducción a la Reparación Gaming",
        lessons: 4,
        duration: "2 horas"
      },
      {
        title: "Diagnóstico de Problemas Comunes",
        lessons: 6,
        duration: "3 horas"
      },
      {
        title: "Técnicas de Soldadura Avanzada",
        lessons: 8,
        duration: "4 horas"
      },
      {
        title: "Reparación de Componentes",
        lessons: 5,
        duration: "2.5 horas"
      },
      {
        title: "Pruebas y Validación",
        lessons: 3,
        duration: "1.5 horas"
      },
      {
        title: "Proyecto Final",
        lessons: 2,
        duration: "3 horas"
      }
    ],
    skills: [
      "Diagnóstico profesional de hardware gaming",
      "Técnicas de soldadura y microsoldadura",
      "Reparación de tarjetas gráficas",
      "Mantenimiento preventivo",
      "Uso de herramientas especializadas"
    ],
    requirements: [
      "Conocimientos básicos de electrónica",
      "Ganas de aprender",
      "Herramientas básicas (incluidas en el kit)"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WhatsAppFloat />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        
        <div className="relative container mx-auto px-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/cursos')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Cursos
          </Button>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Course Image */}
            <div className="relative">
              {course.cover ? (
                <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
                  <img 
                    src={course.cover} 
                    alt={course.title}
                    className="w-full h-full object-scale-down bg-muted"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="mr-1 h-3 w-3" />
                      {courseDetails.rating}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="relative h-96 bg-primary/10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-24 w-24 text-primary/30" />
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-glow mb-4">{course.title}</h1>
                <p className="text-xl text-muted-foreground">
                  {course.description || 'Conviértete en un experto en reparación gaming con nuestro curso especializado.'}
                </p>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
                  <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Duración</div>
                  <div className="font-semibold">{course.duration_weeks || 4} semanas</div>
                </div>
                <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
                  <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Nivel</div>
                  <div className="font-semibold">{course.level || 'Principiante'}</div>
                </div>
                <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
                  <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Estudiantes</div>
                  <div className="font-semibold">{course.estimated_students || 0}+</div>
                </div>
                <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
                  <Award className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Certificado</div>
                  <div className="font-semibold">{course.has_certification ? 'Incluido' : 'No incluido'}</div>
                </div>
              </div>

              {/* Price and CTA */}
              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Precio del curso</div>
                      <div className="text-3xl font-bold text-primary">{formatPrice(course.price)}</div>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      <Star className="mr-1 h-3 w-3" />
                      Certificación incluida
                    </Badge>
                  </div>
                  
                  <Button 
                    variant="gaming" 
                    size="lg" 
                    className="w-full"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Inscribirse Ahora
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Curriculum from Database */}
              {course.curriculum && course.curriculum.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold text-neon mb-6 flex items-center">
                    <BookOpen className="mr-3 h-6 w-6" />
                    Temario del Curso
                  </h2>
                  <div className="space-y-4">
                    {course.curriculum.map((module: any, moduleIndex: number) => (
                      <Card key={moduleIndex} className="border-border/50 hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">
                            Módulo {moduleIndex + 1}: {module.module}
                          </CardTitle>
                          {module.lessons && module.lessons.length > 0 && (
                            <div className="space-y-2 mt-3">
                              {module.lessons.map((lesson: any, lessonIndex: number) => (
                                <div key={lessonIndex} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                                  <div>
                                    <div className="font-medium">{lesson.title}</div>
                                    {lesson.description && (
                                      <div className="text-xs text-muted-foreground">{lesson.description}</div>
                                    )}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {lesson.duration} min
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                // Fallback to traditional content or mock data
                course.content ? (
                  <div>
                    <h2 className="text-2xl font-bold text-neon mb-6 flex items-center">
                      <BookOpen className="mr-3 h-6 w-6" />
                      Contenido del Curso
                    </h2>
                    <Card className="border-border/50">
                      <CardContent className="p-6">
                        <div className="whitespace-pre-wrap text-muted-foreground">
                          {course.content}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-neon mb-6 flex items-center">
                      <BookOpen className="mr-3 h-6 w-6" />
                      Contenido del Curso
                    </h2>
                    <div className="space-y-4">
                      {courseDetails.modules.map((module, index) => (
                        <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">
                                Módulo {index + 1}: {module.title}
                              </CardTitle>
                              <Badge variant="outline">
                                {module.lessons} lecciones
                              </Badge>
                            </div>
                            <CardDescription className="flex items-center text-sm">
                              <Clock className="mr-2 h-4 w-4" />
                              {module.duration}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              )}

              {/* Learning Outcomes from Database */}
              {course.learning_outcomes && course.learning_outcomes.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold text-neon mb-6 flex items-center">
                    <Target className="mr-3 h-6 w-6" />
                    Lo que aprenderás
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.learning_outcomes.map((outcome: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Fallback to mock data
                <div>
                  <h2 className="text-2xl font-bold text-neon mb-6 flex items-center">
                    <Target className="mr-3 h-6 w-6" />
                    Lo que aprenderás
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {courseDetails.skills.map((skill, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Requirements */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Requisitos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {course.requirements && course.requirements.length > 0 ? (
                    course.requirements.map((req: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{req}</span>
                      </div>
                    ))
                  ) : (
                    courseDetails.requirements.map((req, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{req}</span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Course Features */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">¿Qué Incluye?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {course.includes && course.includes.length > 0 ? (
                    course.includes.map((include: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-primary" />
                        <span className="text-sm">{include}</span>
                      </div>
                    ))
                  ) : (
                    // Fallback to default features
                    <>
                      <div className="flex items-center space-x-3">
                        <PlayCircle className="h-5 w-5 text-primary" />
                        <span className="text-sm">Videos explicativos HD</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <span className="text-sm">Material descargable</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-primary" />
                        <span className="text-sm">Soporte de instructor</span>
                      </div>
                      {course.has_certification && (
                        <div className="flex items-center space-x-3">
                          <Award className="h-5 w-5 text-primary" />
                          <span className="text-sm">Certificado de finalización</span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CourseDetails;