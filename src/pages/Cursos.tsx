import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import SEOHead from '@/components/SEO/SEOHead';
import { useCourses } from '@/hooks/useCourses';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { generateCourseSchema, getSEOKeywords } from '@/utils/seoUtils';
import { GraduationCap, Star, Clock, Users, Award, PlayCircle, CheckCircle, Target, ShoppingCart } from 'lucide-react';
const Cursos = () => {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const {
    courses,
    loading,
    error
  } = useCourses();
  const {
    addItem
  } = useCart();
  const {
    toast
  } = useToast();
  const benefits = [{
    title: 'Instructores Expertos',
    description: 'Aprende de técnicos con más de 8 años de experiencia',
    icon: <Award className="h-6 w-6" />
  }, {
    title: 'Práctica Real',
    description: 'Trabajarás con equipos reales desde el primer día',
    icon: <Target className="h-6 w-6" />
  }, {
    title: 'Certificación',
    description: 'Recibe un certificado avalado al completar el curso',
    icon: <CheckCircle className="h-6 w-6" />
  }, {
    title: 'Soporte Continuo',
    description: 'Acceso a nuestra comunidad y soporte post-curso',
    icon: <Users className="h-6 w-6" />
  }];
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getFilteredCourses = (category: string) => {
    if (category === 'todos') return courses;
    
    const filters = {
      'reparacion': ['reparación', 'reparar', 'arreglo', 'fix'],
      'mantenimiento': ['mantenimiento', 'limpieza', 'cuidado', 'maintenance'],
      'avanzado': ['avanzado', 'profesional', 'expert', 'master'],
      'basico': ['básico', 'inicio', 'principiante', 'beginner']
    };
    
    const categoryFilters = filters[category as keyof typeof filters] || [];
    return courses.filter(course => 
      categoryFilters.some(filter => 
        course.title.toLowerCase().includes(filter) || 
        course.description?.toLowerCase().includes(filter)
      )
    );
  };

  // SEO data based on category
  const getSEOData = () => {
    const seoCategories = {
      'reparacion': {
        title: 'Cursos de Reparación de Consolas Gaming | Academia Aventura Gamer',
        description: 'Aprende reparación profesional de PlayStation, Xbox y Nintendo. Cursos presenciales con práctica real, certificación incluida en Envigado.',
        keywords: getSEOKeywords('cursos')
      },
      'mantenimiento': {
        title: 'Cursos de Mantenimiento Gaming - Consolas y Controles | Aventura Gamer',
        description: 'Formación en mantenimiento preventivo gaming: limpieza, pasta térmica, ventiladores. Técnicas profesionales en Envigado.',
        keywords: 'curso mantenimiento gaming, limpieza consolas, pasta térmica, ventiladores gaming Envigado'
      },
      'avanzado': {
        title: 'Cursos Avanzados Reparación Gaming - Nivel Profesional | Aventura Gamer',
        description: 'Cursos avanzados para técnicos: microsoldadura, reballing, reparación de placas. Nivel profesional con certificación en Envigado.',
        keywords: 'cursos avanzados gaming, microsoldadura consolas, reballing PlayStation Xbox, técnico profesional Envigado'
      },
      'todos': {
        title: 'Cursos de Reparación Gaming - Academia Técnica | Aventura Gamer',
        description: 'Academia especializada en cursos de reparación de consolas gaming. PlayStation, Xbox, Nintendo. Certificación, práctica real y soporte continuo.',
        keywords: getSEOKeywords('cursos')
      }
    };

    const currentCategory = categoria || 'todos';
    return seoCategories[currentCategory as keyof typeof seoCategories] || seoCategories.todos;
  };

  const seoData = getSEOData();
  const canonicalUrl = `https://aventuragamer.com/cursos${categoria ? `/${categoria}` : ''}`;

  // Generate structured data for courses
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Cursos de Reparación Gaming",
    "description": seoData.description,
    "itemListElement": courses.slice(0, 5).map((course, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": generateCourseSchema(course)
    }))
  };
  return <div className="min-h-screen bg-background">
      <SEOHead 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={canonicalUrl}
        type="website"
        structuredData={structuredData}
      />
      <Header />
      <WhatsAppFloat />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            
            
            <h1 className="text-4xl text-glow font-bold md:text-6xl">Academia Gamer
Cursos Especializados</h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Conviértete en un maestro de la reparación gaming. Aprende con los mejores y domina las técnicas más avanzadas.
            </p>
          </div>
        </div>
      </section>


      
            {/* Courses Section */}
            <section className="py-20">
              <div className="container mx-auto px-4">
                
                {loading ? <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div> : error ? <div className="text-center py-12">
                    <p className="text-red-500">Error al cargar los cursos: {error}</p>
                    <Button variant="gaming" onClick={() => window.location.reload()}>
                      Reintentar
                    </Button>
                  </div> : courses.length === 0 ? <div className="text-center py-12">
                    <p className="text-muted-foreground">No hay cursos disponibles en este momento.</p>
                  </div> : <Tabs value={categoria || "todos"} className="w-full" onValueChange={(value) => {
                    if (value === "todos") {
                      navigate("/cursos");
                    } else {
                      navigate(`/cursos/${value}`);
                    }
                  }}>
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                      <TabsTrigger value="todos">Todos</TabsTrigger>
                      <TabsTrigger value="reparacion">Reparación</TabsTrigger>
                      <TabsTrigger value="mantenimiento">Mantenimiento</TabsTrigger>
                      <TabsTrigger value="avanzado">Avanzado</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="todos" className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {getFilteredCourses("todos").map(course => <Card key={course.id} className="card-gaming border-primary/20 overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/20" onClick={() => navigate(`/curso/${course.id}`)}>
                            {course.cover ? <div className="relative h-48 overflow-hidden">
                                <img src={course.cover} alt={course.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                              </div> : <div className="relative h-48 bg-primary/10 flex items-center justify-center">
                                <GraduationCap className="h-12 w-12 text-primary/30" />
                              </div>}
                            
                            <CardHeader className="space-y-4">
                              <div className="space-y-2">
                                <CardTitle className="text-xl text-neon">{course.title}</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                  {course.description || 'Descripción no disponible'}
                                </CardDescription>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-6">
                              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                <div className="text-right">
                                  <div className="text-sm text-muted-foreground">Precio</div>
                                  <div className="text-2xl font-bold text-primary">{formatPrice(course.price)}</div>
                                </div>
                              </div>
                              
                              <div className="flex gap-3">
                                <Button variant="gaming" className="flex-1" onClick={(e) => {
                                  e.stopPropagation();
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
                                }}>
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  Inscribirse
                                </Button>
                                <Button variant="outline" size="sm" onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/curso/${course.id}`);
                                }}>
                                  <GraduationCap className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>)}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="reparacion" className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {getFilteredCourses("reparacion").map(course => <Card key={course.id} className="card-gaming border-primary/20 overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/20" onClick={() => navigate(`/curso/${course.id}`)}>
                            {course.cover ? <div className="relative h-48 overflow-hidden">
                                <img src={course.cover} alt={course.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                              </div> : <div className="relative h-48 bg-primary/10 flex items-center justify-center">
                                <GraduationCap className="h-12 w-12 text-primary/30" />
                              </div>}
                            
                            <CardHeader className="space-y-4">
                              <div className="space-y-2">
                                <CardTitle className="text-xl text-neon">{course.title}</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                  {course.description || 'Descripción no disponible'}
                                </CardDescription>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-6">
                              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                <div className="text-right">
                                  <div className="text-sm text-muted-foreground">Precio</div>
                                  <div className="text-2xl font-bold text-primary">{formatPrice(course.price)}</div>
                                </div>
                              </div>
                              
                              <div className="flex gap-3">
                                <Button variant="gaming" className="flex-1" onClick={(e) => {
                                  e.stopPropagation();
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
                                }}>
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  Inscribirse
                                </Button>
                                <Button variant="outline" size="sm" onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/curso/${course.id}`);
                                }}>
                                  <GraduationCap className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>)}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="mantenimiento" className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {getFilteredCourses("mantenimiento").map(course => <Card key={course.id} className="card-gaming border-primary/20 overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/20" onClick={() => navigate(`/curso/${course.id}`)}>
                            {course.cover ? <div className="relative h-48 overflow-hidden">
                                <img src={course.cover} alt={course.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                              </div> : <div className="relative h-48 bg-primary/10 flex items-center justify-center">
                                <GraduationCap className="h-12 w-12 text-primary/30" />
                              </div>}
                            
                            <CardHeader className="space-y-4">
                              <div className="space-y-2">
                                <CardTitle className="text-xl text-neon">{course.title}</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                  {course.description || 'Descripción no disponible'}
                                </CardDescription>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-6">
                              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                <div className="text-right">
                                  <div className="text-sm text-muted-foreground">Precio</div>
                                  <div className="text-2xl font-bold text-primary">{formatPrice(course.price)}</div>
                                </div>
                              </div>
                              
                              <div className="flex gap-3">
                                <Button variant="gaming" className="flex-1" onClick={(e) => {
                                  e.stopPropagation();
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
                                }}>
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  Inscribirse
                                </Button>
                                <Button variant="outline" size="sm" onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/curso/${course.id}`);
                                }}>
                                  <GraduationCap className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>)}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="avanzado" className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {getFilteredCourses("avanzado").map(course => <Card key={course.id} className="card-gaming border-primary/20 overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/20" onClick={() => navigate(`/curso/${course.id}`)}>
                            {course.cover ? <div className="relative h-48 overflow-hidden">
                                <img src={course.cover} alt={course.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                              </div> : <div className="relative h-48 bg-primary/10 flex items-center justify-center">
                                <GraduationCap className="h-12 w-12 text-primary/30" />
                              </div>}
                            
                            <CardHeader className="space-y-4">
                              <div className="space-y-2">
                                <CardTitle className="text-xl text-neon">{course.title}</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                  {course.description || 'Descripción no disponible'}
                                </CardDescription>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-6">
                              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                <div className="text-right">
                                  <div className="text-sm text-muted-foreground">Precio</div>
                                  <div className="text-2xl font-bold text-primary">{formatPrice(course.price)}</div>
                                </div>
                              </div>
                              
                              <div className="flex gap-3">
                                <Button variant="gaming" className="flex-1" onClick={(e) => {
                                  e.stopPropagation();
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
                                }}>
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  Inscribirse
                                </Button>
                                <Button variant="outline" size="sm" onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/curso/${course.id}`);
                                }}>
                                  <GraduationCap className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>)}
                      </div>
                    </TabsContent>
                  </Tabs>}
              </div>
            </section>
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-glow">
              ¿Listo para Subir de Nivel?
            </h2>
            <p className="text-lg text-muted-foreground">
              Únete a nuestra comunidad de aventureros y comienza tu viaje hacia la maestría en reparación gaming.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                <GraduationCap className="mr-2 h-5 w-5" />
                Ver Todos los Cursos
              </Button>
              <Button variant="gaming-secondary" size="lg">
                Hablar con un Asesor
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Cursos;