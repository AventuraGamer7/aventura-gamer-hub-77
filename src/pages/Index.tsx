import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import GamificationPanel from '@/components/GamificationPanel';
import { useAuth } from '@/hooks/useAuth';
import { useServices } from '@/hooks/useServices';
import { Wrench, GraduationCap, ShoppingCart, Star, Award, Zap, ChevronRight, MapPin, Phone, Clock, Users, Trophy, Target } from 'lucide-react';

// Import images
import heroImage from '@/assets/gaming-hero.jpg';
import repairImage from '@/assets/repair-services.jpg';
import coursesImage from '@/assets/gaming-courses.jpg';
import storeImage from '@/assets/gaming-store.jpg';
const Index = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    services,
    loading,
    error
  } = useServices();
  const stats = [{
    label: 'Aventureros Activos',
    value: '2,500+',
    icon: <Users className="h-5 w-5" />
  }, {
    label: 'Reparaciones Completadas',
    value: '10,000+',
    icon: <Wrench className="h-5 w-5" />
  }, {
    label: 'Cursos Impartidos',
    value: '150+',
    icon: <GraduationCap className="h-5 w-5" />
  }, {
    label: 'Años de Experiencia',
    value: '8+',
    icon: <Star className="h-5 w-5" />
  }];
  const achievements = [{
    title: 'Expertos Certificados',
    description: 'Técnicos especializados con años de experiencia',
    icon: <Award className="h-6 w-6" />
  }, {
    title: 'Garantía Completa',
    description: 'Garantía en todas nuestras reparaciones y servicios',
    icon: <Trophy className="h-6 w-6" />
  }, {
    title: 'Respuesta Rápida',
    description: 'Diagnóstico en menos de 24 horas',
    icon: <Zap className="h-6 w-6" />
  }, {
    title: 'Precios Justos',
    description: 'Tarifas competitivas y transparentes',
    icon: <Target className="h-6 w-6" />
  }];
  return <div className="min-h-screen bg-background">
      <Header />
      <WhatsAppFloat />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: `url(${heroImage})`,
        filter: 'brightness(0.3)'
      }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            
            
            <h1 className="text-4xl lg:text-7xl text-glow text-center md:text-6xl font-bold">
              Aventura Gamer
            </h1>
            
            <p className="text-xl md:text-2xl text-secondary font-medium animate-pulse-neon">
              Farmeando experiencia para tu mejor versión
            </p>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tu centro de confianza para reparaciones gaming, cursos especializados y repuestos originales en Envigado, Colombia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button variant="hero" size="xl" className="text-lg" onClick={() => navigate('/servicios')}>
                <Wrench className="mr-2 h-5 w-5" />
                Ver Servicios
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="neon" size="xl" className="text-lg" onClick={() => navigate('/dashboard')}>
                <GraduationCap className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>

      </section>

      
            {/* Services Section */}
            <section className="py-20">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30 mb-4">
                    Nuestros Servicios
                  </Badge>
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 text-glow">
                    Servicios Técnicos Disponibles
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Reparaciones profesionales con garantía y servicio post-venta
                  </p>
                </div>
      
                {loading ? <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div> : error ? <div className="text-center py-12">
                    <p className="text-red-500">Error al cargar los servicios: {error}</p>
                    <Button variant="gaming" onClick={() => window.location.reload()}>
                      Reintentar
                    </Button>
                  </div> : services.length === 0 ? <div className="text-center py-12">
                    <p className="text-muted-foreground">No hay servicios disponibles en este momento.</p>
                  </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {services.map(service => <Card key={service.id} className="card-gaming border-primary/20 overflow-hidden glow-hover group">
                        {service.image ? <div className="relative h-48 overflow-hidden">
                            <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                          </div> : <div className="relative h-48 bg-primary/10 flex items-center justify-center">
                            <Wrench className="h-12 w-12 text-primary/30" />
                          </div>}
                        
                        <CardHeader>
                          <CardTitle className="text-xl text-neon">{service.name}</CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {service.description || 'Descripción no disponible'}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-secondary">
                              ${service.price.toFixed(2)}
                            </span>
                            <Button variant="gaming" size="sm">
                              Solicitar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>)}
                  </div>}
              </div>
            </section>
      {/* Gamification Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                Sistema Gamificado
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-glow">De APRENDIZ a  AVENTURERO PROFESIONAL</h2>
              <p className="text-lg text-muted-foreground">
                Gana puntos, desbloquea logros y sube de nivel mientras utilizas nuestros servicios. 
                Cada reparación, curso completado o compra te acerca más a recompensas exclusivas.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
                    <div className="text-primary">{achievement.icon}</div>
                    <div>
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>)}
              </div>
            </div>
            
            <div className="lg:pl-8">
              <GamificationPanel />
            </div>
          </div>
        </div>
      </section>

      {/* Hazlo Tú Mismo Challenge */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="card-gaming border-secondary/30 overflow-hidden">
              <div className="bg-gradient-to-r from-secondary/20 to-primary/20 p-8">
                <div className="text-center space-y-6">
                  <Badge variant="secondary" className="bg-secondary/30 text-secondary border-secondary/50">
                    🎯 Desafío Especial
                  </Badge>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-glow">
                    Misión: Hazlo Tú Mismo
                  </h2>
                  
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    ¿Te atreves a convertirte en un maestro de la reparación? Acepta el desafío y aprende 
                    a reparar tus propias consolas y controles con nuestros cursos especializados.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button variant="gaming" size="lg">
                      <Target className="mr-2 h-5 w-5" />
                      Acepto el Desafío
                    </Button>
                    <Button variant="gaming-secondary" size="lg">
                      Ver Misiones Disponibles
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 mb-4">
                Visítanos
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-glow">
                Encuentra Tu Base de Operaciones
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="card-gaming border-primary/20 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Ubicación</h3>
                  <p className="text-sm text-muted-foreground">
                    Calle 36 Sur #41-36<br />
                    Local 116, Envigado<br />
                    Colombia
                  </p>
                </CardContent>
              </Card>

              <Card className="card-gaming border-primary/20 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold mb-2">Teléfono</h3>
                  <p className="text-sm text-muted-foreground">
                    350 513 85 57<br />
                    Disponible para<br />
                    consultas y citas
                  </p>
                </CardContent>
              </Card>

              <Card className="card-gaming border-primary/20 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gaming-orange/20 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-gaming-orange" />
                  </div>
                  <h3 className="font-semibold mb-2">Horarios</h3>
                  <p className="text-sm text-muted-foreground">
                    Lun - Sáb<br />
                    9:00 AM - 7:00 PM<br />
                    Dom: Cerrado
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;