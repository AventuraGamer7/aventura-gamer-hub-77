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
import { useProducts } from '@/hooks/useProducts';
import { useCourses } from '@/hooks/useCourses';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { Wrench, GraduationCap, ShoppingCart, Star, Award, Zap, ChevronRight, MapPin, Phone, Clock, Users, Trophy, Target, Play, GamepadIcon, Instagram } from 'lucide-react';
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
  const {
    products,
    loading: productsLoading,
    error: productsError
  } = useProducts();
  const {
    courses,
    loading: coursesLoading,
    error: coursesError
  } = useCourses();

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
          
          {/* Social Media Buttons */}
          <div className="flex justify-center gap-4 mt-12 mb-8">
            <Button
              variant="gaming"
              size="lg"
              className="px-6 py-3 bg-red-600/20 border-red-500/30 hover:bg-red-600/30 text-red-400"
              onClick={() => window.open('https://www.youtube.com/@aventuragamer777', '_blank')}
            >
              <img src="/lovable-uploads/cc10dbd8-68ed-412d-9016-15dd833460b9.png" alt="YouTube" className="mr-2 h-5 w-5" />
              Canal YouTube
            </Button>
            <Button
              variant="gaming"
              size="lg"
              className="px-6 py-3 bg-pink-600/20 border-pink-500/30 hover:bg-pink-600/30 text-pink-400"
              onClick={() => window.open('https://www.instagram.com/aventuragamer777/', '_blank')}
            >
              <Instagram className="mr-2 h-5 w-5" />
              Instagram
            </Button>
          </div>

          {/* View All Services CTA */}
          <div className="text-center mt-8">
            <Button variant="gaming-secondary" size="lg" className="px-8 py-4 text-lg" onClick={() => navigate('/servicios')}>
              Ver Todos los Servicios
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
              </div>
            </section>
      {/* Featured Products Section - Modular */}
      <section className="py-24 bg-muted/20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30 px-6 py-3 text-base mb-6">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Tienda Elite Gaming
            </Badge>
            
            <h2 className="text-4xl md:text-6xl font-bungee mb-6 text-glow">
              Descubre la Élite en Aventura Gamer
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Productos premium y accesorios gaming de la más alta calidad para elevar tu experiencia
            </p>
          </div>
      
          {productsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary shadow-glow"></div>
            </div>
          ) : productsError ? (
            <Card className="card-gaming border-destructive/30 max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-destructive" />
                </div>
                <p className="text-destructive mb-4">Error al cargar los productos: {productsError}</p>
                <Button variant="gaming" onClick={() => window.location.reload()}>
                  Reintentar Carga
                </Button>
              </CardContent>
            </Card>
          ) : products.length === 0 ? (
            <Card className="card-gaming max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No hay productos disponibles en este momento.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 3).map(product => (
                <Card key={product.id} className="card-gaming border-secondary/20 overflow-hidden group bg-gradient-to-br from-card to-card/80">
                  {product.image ? (
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
                      {product.badge_text && (
                        <div className="absolute top-4 right-4">
                          <Badge 
                            variant="secondary" 
                            className="bg-secondary/90 text-secondary-foreground border-secondary/50"
                          >
                            {product.badge_text}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-56 bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                      <ShoppingCart className="h-16 w-16 text-secondary/40" />
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl text-neon group-hover:text-secondary transition-colors">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground line-clamp-2">
                      {product.description || 'Producto gaming premium de alta calidad'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-primary">
                          ${product.price.toLocaleString('es-CO')} COP
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Stock: {product.stock}
                        </span>
                      </div>
                      <Button variant="gaming" size="sm" className="px-6">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Comprar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* View All Products CTA */}
          <div className="text-center mt-16">
            <Button 
              variant="gaming-secondary" 
              size="lg" 
              className="px-8 py-4 text-lg" 
              onClick={() => navigate('/tienda')}
            >
              Ver Todos los Productos
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Courses Section - Modular */}
      <section className="py-24 relative overflow-hidden">
        {/* Gaming Background */}
        <div 
          className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: `url('/lovable-uploads/9cbb1996-c02c-4b63-b7bd-45e2ca06d3eb.png')`
          }}
        />
        <div className="absolute inset-0 bg-background/85" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <Badge variant="secondary" className="bg-gaming-blue/20 text-gaming-blue border-gaming-blue/30 px-6 py-3 text-base mb-6">
              <GraduationCap className="mr-2 h-5 w-5" />
              Academia Elite Gaming
            </Badge>
            
            <h2 className="text-4xl md:text-6xl font-bungee mb-6 text-glow">
              Sube de Nivel<br />
              <span className="text-gaming-blue">Aventura Gamer</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Domina las habilidades técnicas más avanzadas con nuestros cursos especializados y certificaciones profesionales
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Progreso de la Comunidad</span>
                <span className="text-sm font-bold text-gaming-blue">75% Completado</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-gaming-blue to-primary h-full rounded-full animate-pulse shadow-glow transition-all duration-1000" style={{width: '75%'}}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">+2,500 aventureros mejorando sus habilidades</p>
            </div>
          </div>
      
          {coursesLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gaming-blue shadow-glow"></div>
            </div>
          ) : coursesError ? (
            <Card className="card-gaming border-destructive/30 max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-destructive" />
                </div>
                <p className="text-destructive mb-4">Error al cargar los cursos: {coursesError}</p>
                <Button variant="gaming" onClick={() => window.location.reload()}>
                  Reintentar Carga
                </Button>
              </CardContent>
            </Card>
          ) : courses.length === 0 ? (
            <Card className="card-gaming max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No hay cursos disponibles en este momento.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.slice(0, 3).map(course => (
                <Card key={course.id} className="card-gaming border-gaming-blue/20 overflow-hidden group bg-gradient-to-br from-card to-card/80">
                  {course.cover ? (
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={course.cover}
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <Badge 
                          variant="secondary" 
                          className="bg-gaming-blue/90 text-white border-gaming-blue/50"
                        >
                          Curso Elite
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-56 bg-gradient-to-br from-gaming-blue/20 to-primary/20 flex items-center justify-center">
                      <GraduationCap className="h-16 w-16 text-gaming-blue/40" />
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl text-neon group-hover:text-gaming-blue transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground line-clamp-2">
                      {course.description || 'Curso especializado en tecnología gaming avanzada'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Course Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted-foreground">Progreso del Curso</span>
                        <span className="text-xs font-bold text-gaming-blue">Nivel {Math.floor(Math.random() * 5) + 1}</span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-gaming-blue to-primary h-full rounded-full transition-all duration-500"
                          style={{width: `${Math.floor(Math.random() * 80) + 20}%`}}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-gaming-orange">
                          ${course.price.toLocaleString('es-CO')} COP
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Certificación incluida
                        </span>
                      </div>
                      <Button variant="gaming" size="sm" className="px-6">
                        <Play className="mr-2 h-4 w-4" />
                        Iniciar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* View All Courses CTA */}
          <div className="text-center mt-16">
            <Button 
              variant="gaming-secondary" 
              size="lg" 
              className="px-8 py-4 text-lg" 
              onClick={() => navigate('/cursos')}
            >
              Ver Todos los Cursos
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
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

            {/* Interactive Map */}
            <div className="mb-16">
              <Card className="card-gaming border-primary/30 overflow-hidden">
                <CardHeader className="text-center">
                  <h3 className="text-2xl font-bold text-neon mb-2">Nuestra Ubicación</h3>
                  <p className="text-muted-foreground">Encuéntranos en el corazón de Envigado</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.9463822928747!2d-75.59047032501901!3d6.168064593822529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4682f7b8b8b8b8%3A0x1234567890abcdef!2sCalle%2036%20Sur%20%2341-36%2C%20Envigado%2C%20Antioquia%2C%20Colombia!5e0!3m2!1ses!2sco!4v1735001234567!5m2!1ses!2sco"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                  </div>
                </CardContent>
              </Card>
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
                  <Button 
                    variant="gaming" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => window.open('https://maps.google.com/?q=Aventura+Gamer+Envigado', '_blank')}
                  >
                    Ver en Google Maps
                  </Button>
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