import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import GamificationPanel from '@/components/GamificationPanel';
import { useAuth } from '@/hooks/useAuth';
import { useServices } from '@/hooks/useServices';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { Wrench, GraduationCap, ShoppingCart, Star, Award, Zap, ChevronRight, MapPin, Phone, Clock, Users, Trophy, Target, Play, GamepadIcon } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

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
  const {
    slides: heroSlides,
    loading: heroLoading
  } = useHeroSlides();

  // Fallback hero slides if no slides from database
  const fallbackHeroSlides = [{
    id: '1',
    title: "Aventura Gamer",
    subtitle: "Farmeando experiencia para tu mejor versión",
    description: "Tu centro de confianza para reparaciones gaming, cursos especializados y repuestos originales",
    image_url: heroImage,
    button_text: "Ver Servicios",
    button_url: "/servicios",
    is_active: true,
    display_order: 1
  }, {
    id: '2',
    title: "Reparaciones Profesionales",
    subtitle: "Expertos en consolas y periféricos",
    description: "Técnicos certificados con garantía completa en todas las reparaciones",
    image_url: repairImage,
    button_text: "Solicitar Reparación",
    button_url: "/servicios",
    is_active: true,
    display_order: 2
  }, {
    id: '3',
    title: "Cursos Especializados",
    subtitle: "Aprende de los mejores",
    description: "Conviértete en un maestro de la reparación con nuestros cursos hands-on",
    image_url: coursesImage,
    button_text: "Ver Cursos",
    button_url: "/cursos",
    is_active: true,
    display_order: 3
  }];

  // Use database slides if available, otherwise use fallback
  const activeHeroSlides = heroLoading ? fallbackHeroSlides : heroSlides.filter(slide => slide.is_active).length > 0 ? heroSlides.filter(slide => slide.is_active) : fallbackHeroSlides;
  const handleSlideNavigation = (url: string) => {
    if (url.startsWith('/')) {
      navigate(url);
    } else {
      window.open(url, '_blank');
    }
  };
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
      
      {/* Dynamic Hero Section with Carousel */}
      <section className="relative h-[75vh] overflow-hidden">
        <Carousel opts={{
        align: "start",
        loop: true
      }} plugins={[Autoplay({
        delay: 6000,
        stopOnInteraction: false
      })]} className="w-full h-full mx-0 py-[57px]">
          <CarouselContent className="h-full">
            {activeHeroSlides.map((slide, index) => <CarouselItem key={slide.id} className="h-full">
                <div className="relative h-full w-full">
                  {/* Background Image */}
                  <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000" style={{
                backgroundImage: `url(${slide.image_url})`,
                filter: 'brightness(0.3)'
              }} />
                  
                  {/* Gradient Overlay */}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                  
                  {/* Content */}
                  <div className="relative h-full flex items-center justify-center">
                    <div className="container mx-auto px-4">
                      <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
                        
                        {/* Gaming Badge */}
                        <div className="flex justify-center">
                          
                        </div>
                        
                        {/* Main Title */}
                        <h1 className="text-glow leading-tight font-bungee lg:text-6xl text-4xl">
                          {slide.title}
                        </h1>
                        
                        {/* Subtitle */}
                        <p className="text-2xl text-secondary animate-pulse-neon font-medium md:text-xl">
                          {slide.subtitle}
                        </p>
                        
                        {/* Description */}
                        <p className="max-w-3xl mx-auto leading-relaxed text-slate-50 font-extralight text-xl">
                          {slide.description}
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                          <Button variant="gaming" size="xl" className="text-lg px-8 py-4" onClick={() => handleSlideNavigation(slide.button_url)}>
                            <Play className="mr-2 h-6 w-6" />
                            {slide.button_text}
                            <ChevronRight className="ml-2 h-6 w-6" />
                          </Button>
                          {user && <Button variant="gaming-secondary" size="xl" className="text-lg px-8 py-4" onClick={() => navigate('/dashboard')}>
                              <Star className="mr-2 h-6 w-6" />
                              Dashboard
                            </Button>}
                        </div>
                        
                        {/* Progress Indicators */}
                        <div className="flex justify-center gap-3 pt-8">
                          {activeHeroSlides.map((_, indicatorIndex) => <div key={indicatorIndex} className={`w-3 h-3 rounded-full transition-all duration-300 ${indicatorIndex === index ? 'bg-primary shadow-glow' : 'bg-muted-foreground/30'}`} />)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>)}
          </CarouselContent>
          
          {/* Navigation */}
          <CarouselPrevious className="left-8 bg-background/20 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground" />
          <CarouselNext className="right-8 bg-background/20 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground" />
        </Carousel>
      </section>

      
      {/* Featured Services Section - Modular */}
      <section className="py-24 relative overflow-hidden">
        {/* Cyberpunk Background */}
        <div 
          className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-80"
          style={{
            backgroundImage: `url('/lovable-uploads/3c2896db-3cf4-4e76-9ec3-47702dba466d.png')`
          }}
        />
        <div className="absolute inset-0 bg-background/80" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            
            <h2 className="text-4xl md:text-6xl font-bungee mb-6 text-glow">
              Experiencia Técnica de Elite
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">Servicios profesionales y garantía completa para maximizar tu experiencia gaming</p>
          </div>
      
          {loading ? <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary shadow-glow"></div>
            </div> : error ? <Card className="card-gaming border-destructive/30 max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
                  <Wrench className="h-8 w-8 text-destructive" />
                </div>
                <p className="text-destructive mb-4">Error al cargar los servicios: {error}</p>
                <Button variant="gaming" onClick={() => window.location.reload()}>
                  Reintentar Carga
                </Button>
              </CardContent>
            </Card> : services.length === 0 ? <Card className="card-gaming max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                  <Wrench className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No hay servicios disponibles en este momento.</p>
              </CardContent>
            </Card> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 6).map(service => <Card key={service.id} className="card-gaming border-primary/20 overflow-hidden group bg-gradient-to-br from-card to-card/80">
                  {service.image ? <div className="relative h-56 overflow-hidden">
                      <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
                    </div> : <div className="relative h-56 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Wrench className="h-16 w-16 text-primary/40" />
                    </div>}
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl text-neon group-hover:text-primary transition-colors">
                      {service.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground line-clamp-2">
                      {service.description || 'Servicio profesional gaming especializado'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-secondary">
                          ${service.price.toLocaleString('es-CO')} COP
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Precio base
                        </span>
                      </div>
                      <Button variant="gaming" size="sm" className="px-6">
                        <Play className="mr-2 h-4 w-4" />
                        Solicitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>)}
            </div>}
          
          {/* View All Services CTA */}
          <div className="text-center mt-16">
            <Button variant="gaming-secondary" size="lg" className="px-8 py-4 text-lg" onClick={() => navigate('/servicios')}>
              Ver Todos los Servicios
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
              </div>
            </section>
      {/* Gaming Experience Section - Modular */}
      <section className="py-24 bg-muted/20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 px-6 py-3 text-base">
                <Trophy className="mr-2 h-5 w-5" />
                Sistema de Progresión Gaming
              </Badge>
              
              <h2 className="text-4xl md:text-5xl font-bungee text-glow leading-tight">
                De <span className="text-secondary">APRENDIZ</span> a<br />
                <span className="text-primary">AVENTURERO PRO</span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Experimenta un sistema de recompensas único. Gana XP, desbloquea logros épicos y accede a 
                beneficios exclusivos mientras dominas el arte de la tecnología gaming.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => <Card key={index} className="card-gaming border-primary/20 p-6 group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-2">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{achievement.description}</p>
                      </div>
                    </div>
                  </Card>)}
              </div>
              
              <div className="flex gap-4">
                <Button variant="gaming" size="lg" className="px-8">
                  <Target className="mr-2 h-5 w-5" />
                  Comenzar Aventura
                </Button>
                <Button variant="gaming-secondary" size="lg" className="px-8">
                  Ver Logros
                </Button>
              </div>
            </div>
            
            <div className="lg:pl-8 animate-fade-in">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl" />
                <div className="relative bg-card/80 rounded-2xl border border-border/50 p-8">
                  <GamificationPanel />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content Modules - PlayStation Style */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* DIY Challenge Module */}
            <Card className="card-gaming border-secondary/30 overflow-hidden group">
              <div className="relative h-64 bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('/api/placeholder/600/300')] bg-cover bg-center opacity-20" />
                <div className="relative z-10 text-center space-y-4 p-8">
                  <Badge variant="secondary" className="bg-secondary/30 text-secondary border-secondary/50 px-6 py-2">
                    <Target className="mr-2 h-4 w-4" />
                    Desafío Épico
                  </Badge>
                  <h3 className="text-2xl font-bold text-glow">Misión: Hazlo Tú Mismo</h3>
                  <p className="text-muted-foreground">Conviértete en maestro de la reparación</p>
                </div>
              </div>
              
              <CardContent className="p-8">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Acepta el desafío definitivo: domina las técnicas profesionales de reparación gaming. 
                  Cursos hands-on con certificación incluida.
                </p>
                
                <div className="flex gap-4">
                  <Button variant="gaming" className="flex-1">
                    <Play className="mr-2 h-4 w-4" />
                    Acepto el Desafío
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Latest Courses Module */}
            <Card className="card-gaming border-primary/30 overflow-hidden group">
              <div className="relative h-64 bg-gradient-to-br from-primary/20 to-gaming-blue/20 flex items-center justify-center">
                <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{
                backgroundImage: `url(${coursesImage})`
              }} />
                <div className="relative z-10 text-center space-y-4 p-8">
                  <Badge variant="secondary" className="bg-primary/30 text-primary border-primary/50 px-6 py-2">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Nuevo Contenido
                  </Badge>
                  <h3 className="text-2xl font-bold text-glow">Cursos Avanzados</h3>
                  <p className="text-muted-foreground">Técnicas de última generación</p>
                </div>
              </div>
              
              <CardContent className="p-8">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Accede a contenido exclusivo creado por expertos. Aprende técnicas avanzadas de 
                  reparación para consolas next-gen.
                </p>
                
                <div className="flex gap-4">
                  <Button variant="gaming" className="flex-1" onClick={() => navigate('/cursos')}>
                    <Star className="mr-2 h-4 w-4" />
                    Explorar Cursos
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Contact & Location Section - PlayStation Style */}
      <section className="py-24 bg-gradient-to-br from-muted/30 via-background to-muted/20 relative overflow-hidden">
        {/* Background Gaming Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-16 animate-fade-in">
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
                Tu Base de Operaciones Gaming
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Ubicación estratégica en el corazón de Envigado con acceso directo a toda el área metropolitana
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="card-gaming border-primary/30 text-center group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-neon">Ubicación Central</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="font-medium">Calle 36 Sur #41-36</p>
                    <p>Local 116, Envigado</p>
                    <p>Antioquia, Colombia</p>
                  </div>
                  <Badge variant="secondary" className="mt-4 bg-primary/10 text-primary border-primary/20">
                    Fácil Acceso Metro
                  </Badge>
                </CardContent>
              </Card>

              <Card className="card-gaming border-secondary/30 text-center group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center group-hover:from-secondary/30 group-hover:to-secondary/20 transition-all">
                    <Phone className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-neon">Contacto Directo</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="text-2xl font-bold text-secondary">350 513 85 57</p>
                    <p>WhatsApp & Llamadas</p>
                    <p>Respuesta inmediata</p>
                  </div>
                  <Badge variant="secondary" className="mt-4 bg-secondary/10 text-secondary border-secondary/20">
                    24/7 WhatsApp
                  </Badge>
                </CardContent>
              </Card>

              <Card className="card-gaming border-gaming-orange/30 text-center group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-gaming-orange/20 to-gaming-orange/10 flex items-center justify-center group-hover:from-gaming-orange/30 group-hover:to-gaming-orange/20 transition-all">
                    <Clock className="h-8 w-8 text-gaming-orange" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-neon">Horarios Pro</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="font-medium">Lunes - Sábado</p>
                    <p className="text-xl font-bold text-gaming-orange">9:00 AM - 7:00 PM</p>
                    <p>Domingos: Cerrado</p>
                  </div>
                  <Badge variant="secondary" className="mt-4 bg-gaming-orange/10 text-gaming-orange border-gaming-orange/20">
                    Citas Disponibles
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button variant="gaming" size="lg" className="px-8 py-4 text-lg">
                  <Phone className="mr-2 h-6 w-6" />
                  Contactar Ahora
                </Button>
                <Button variant="gaming-secondary" size="lg" className="px-8 py-4 text-lg" onClick={() => navigate('/contacto')}>
                  <MapPin className="mr-2 h-6 w-6" />
                  Ver Ubicación
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;