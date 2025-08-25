import React from 'react';
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
  Star,
  Clock,
  Users,
  Award,
  PlayCircle,
  CheckCircle,
  Target,
  ShoppingCart
} from 'lucide-react';

const Cursos = () => {
  const { courses, loading, error } = useCourses();
  const { addItem } = useCart();
  const { toast } = useToast();

  const benefits = [
    {
      title: 'Instructores Expertos',
      description: 'Aprende de técnicos con más de 8 años de experiencia',
      icon: <Award className="h-6 w-6" />
    },
    {
      title: 'Práctica Real',
      description: 'Trabajarás con equipos reales desde el primer día',
      icon: <Target className="h-6 w-6" />
    },
    {
      title: 'Certificación',
      description: 'Recibe un certificado avalado al completar el curso',
      icon: <CheckCircle className="h-6 w-6" />
    },
    {
      title: 'Soporte Continuo',
      description: 'Acceso a nuestra comunidad y soporte post-curso',
      icon: <Users className="h-6 w-6" />
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WhatsAppFloat />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
              🎓 Academia Aventura Gamer
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-glow">
              Cursos Especializados
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Conviértete en un maestro de la reparación gaming. Aprende con los mejores y domina las técnicas más avanzadas.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="card-gaming border-primary/20 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      
            {/* Courses Section */}
            <section className="py-20">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-glow">
                    Elige Tu Especialización
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Cada curso está diseñado para llevarte del nivel básico al profesional en tu área de interés.
                  </p>
                </div>
      
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-500">Error al cargar los cursos: {error}</p>
                    <Button variant="gaming" onClick={() => window.location.reload()}>
                      Reintentar
                    </Button>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No hay cursos disponibles en este momento.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {courses.map((course) => (
                      <Card key={course.id} className="card-gaming border-primary/20 overflow-hidden group">
                        {course.cover ? (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={course.cover}
                              alt={course.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                          </div>
                        ) : (
                          <div className="relative h-48 bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="h-12 w-12 text-primary/30" />
                          </div>
                        )}
                        
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
                            <Button 
                              variant="gaming" 
                              className="flex-1"
                              onClick={() => {
                                addItem({
                                  id: course.id,
                                  name: course.title,
                                  price: course.price,
                                  image: course.cover || undefined,
                                  type: 'course'
                                });
                                toast({
                                  title: 'Curso agregado',
                                  description: `${course.title} se agregó al carrito`,
                                });
                              }}
                            >
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Inscribirse
                            </Button>
                            <Button variant="outline" size="sm">
                              <GraduationCap className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
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
    </div>
  );
};

export default Cursos;