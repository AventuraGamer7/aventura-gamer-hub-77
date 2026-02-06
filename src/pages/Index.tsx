import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import GamificationPanel from '@/components/GamificationPanel';
import SEOHead from '@/components/SEO/SEOHead';
import FAQSection from '@/components/SEO/FAQSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import { useAuth } from '@/hooks/useAuth';
import { useServices } from '@/hooks/useServices';
import { useProducts } from '@/hooks/useProducts';
import { useCourses } from '@/hooks/useCourses';
import { generateServiceSchema, generateProductSchema, generateCourseSchema } from '@/utils/seoUtils';
import { Wrench, GraduationCap, ShoppingCart, Star, Award, Zap, ChevronRight, MapPin, Phone, Clock, Users, Trophy, Target, Play, GamepadIcon, Instagram } from 'lucide-react';
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
    products,
    loading: productsLoading,
    error: productsError
  } = useProducts();
  const {
    courses,
    loading: coursesLoading,
    error: coursesError
  } = useCourses();

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

  // FAQ data for homepage
  const homepageFAQs = [{
    question: '¿Qué tipos de consolas reparan?',
    answer: 'Reparamos todas las consolas gaming: PlayStation (5, 4, 3, 2, 1), Xbox (Series X/S, One, 360, Original), Nintendo (Switch, Wii U, Wii, GameCube), consolas retro y handhelds como 3DS, PSP y Game Boy.'
  }, {
    question: '¿Cuánto tiempo toman las reparaciones?',
    answer: 'El diagnóstico es gratuito y toma 24 horas. Las reparaciones simples toman 1-2 días, mientras que las complejas pueden tomar 3-5 días hábiles. Te mantenemos informado del progreso constantemente.'
  }, {
    question: '¿Ofrecen garantía en las reparaciones?',
    answer: 'Sí, todas nuestras reparaciones incluyen garantía: 6 meses para PlayStation y Xbox, 4 meses para Nintendo. Además, ofrecemos soporte técnico post-reparación gratuito.'
  }, {
    question: '¿Tienen cursos disponibles?',
    answer: 'Ofrecemos cursos especializados en reparación de consolas, desde nivel básico hasta avanzado. Incluyen certificación, material de práctica y acceso a nuestro laboratorio técnico.'
  }, {
    question: '¿Dónde están ubicados?',
    answer: 'Estamos en Calle 36 Sur #41-36 Local 116, Envigado, Antioquia. Atendemos de lunes a sábado de 9:00 AM a 7:00 PM. También ofrecemos servicio de domicilio en el área metropolitana.'
  }, {
    question: '¿Cómo puedo solicitar un servicio?',
    answer: 'Puedes contactarnos por WhatsApp al 350 513 85 57, llamarnos, visitarnos directamente o usar nuestro formulario web. El diagnóstico es gratuito y sin compromiso.'
  }];

  // Generate structured data for services, products, and courses
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "Organization",
      "@id": "https://aventuragamer.com/#organization",
      "name": "Aventura Gamer",
      "url": "https://aventuragamer.com",
      "logo": "https://aventuragamer.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+573505138557",
        "contactType": "customer service",
        "availableLanguage": "Spanish"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Calle 36 Sur #41-36 Local 116",
        "addressLocality": "Envigado",
        "addressRegion": "Antioquia",
        "addressCountry": "CO"
      },
      "sameAs": ["https://www.instagram.com/aventuragamer777/", "https://www.youtube.com/@aventuragamer777"]
    }, {
      "@type": "WebSite",
      "@id": "https://aventuragamer.com/#website",
      "url": "https://aventuragamer.com",
      "name": "Aventura Gamer",
      "description": "Centro especializado en reparación de consolas gaming y cursos técnicos en Envigado",
      "publisher": {
        "@id": "https://aventuragamer.com/#organization"
      }
    }]
  };
  return <>
      <SEOHead title="Aventura Gamer - Reparación de Consolas y Cursos Gaming en Envigado" description="Expertos en reparación de PlayStation, Xbox y Nintendo en Envigado. Cursos especializados en tecnología gaming, repuestos originales y servicio técnico certificado con garantía completa." keywords="reparación consolas Envigado, PlayStation Xbox Nintendo, cursos gaming Colombia, repuestos originales Antioquia, servicio técnico gaming certificado" image="/og-aventura-gamer.jpg" structuredData={structuredData} />
      
      <div className="min-h-screen bg-gaming-vibrant">
        <div className="bg-gaming-overlay min-h-screen">
          <Header />
          <WhatsAppFloat />

          {/* Featured Products Showcase - Top Section */}
          <div className="mt-20">
            <FeaturedProducts />
          </div>

      {/* Featured Services Section - Modular */}
      <section className="py-24 relative overflow-hidden mt-20">{" "}
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            
            <h2 className="text-4xl md:text-6xl font-bungee mb-6 text-glow">servicio elite!</h2>
            
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
            </Card> : <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
              {services.slice(0, 1).map(service => <Card key={service.id} className="card-gaming border-primary/20 overflow-hidden group bg-gradient-to-br from-card to-card/80">
                  {service.image ? <div className="relative h-96 overflow-hidden">
                      <img src={service.image} alt={service.name} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                    </div> : <div className="relative h-96 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Wrench className="h-20 w-20 text-primary/40" />
                    </div>}
                  
                  <CardHeader className="pb-2 px-4">
                    <CardTitle className="text-lg text-neon group-hover:text-primary transition-colors line-clamp-1">
                      {service.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground line-clamp-1 text-sm">
                      {service.description || 'Servicio profesional gaming especializado'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0 px-4 pb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-secondary">
                          ${service.price.toLocaleString('es-CO')} COP
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Precio base
                        </span>
                      </div>
                      <Button variant="gaming" size="sm" className="px-4" onClick={() => navigate('/servicios')}>
                        <Play className="mr-1 h-4 w-4" />
                        Solicitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>)}
            </div>}
          
          {/* Social Media Buttons */}
          <div className="flex justify-center gap-4 mt-12 mb-8">
            <Button variant="outline" size="lg" className="px-6 py-3 bg-red-600/20 border-red-500/30 hover:bg-red-600/30 text-red-400" onClick={() => window.open('https://www.youtube.com/@aventuragamer777', '_blank')}>
              <img src="/lovable-uploads/cc10dbd8-68ed-412d-9016-15dd833460b9.png" alt="YouTube" className="mr-2 h-5 w-5" />
              Canal YouTube
            </Button>
            <Button variant="outline" size="lg" className="px-6 py-3 bg-pink-600/20 border-pink-500/30 hover:bg-pink-600/30 text-pink-400" onClick={() => window.open('https://www.instagram.com/aventuragamer777/', '_blank')}>
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
            
            
            <h2 className="text-4xl md:text-6xl font-bungee mb-6 text-glow">Tienda Gamer</h2>
            
          </div>
      
          {productsLoading ? <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary shadow-glow"></div>
            </div> : productsError ? <Card className="card-gaming border-destructive/30 max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-destructive" />
                </div>
                <p className="text-destructive mb-4">Error al cargar los productos: {productsError}</p>
                <Button variant="gaming" onClick={() => window.location.reload()}>
                  Reintentar Carga
                </Button>
              </CardContent>
            </Card> : products.length === 0 ? <Card className="card-gaming max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No hay productos disponibles en este momento.</p>
              </CardContent>
            </Card> : <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
              {products.slice(0, 1).map(product => <Card key={product.id} className="card-gaming border-secondary/20 overflow-hidden group bg-gradient-to-br from-card to-card/80">
                  {product.image ? <div className="relative h-96 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                      {product.badge_text && <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="bg-secondary/90 text-secondary-foreground border-secondary/50">
                            {product.badge_text}
                          </Badge>
                        </div>}
                    </div> : <div className="relative h-96 bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                      <ShoppingCart className="h-20 w-20 text-secondary/40" />
                    </div>}
                  
                  <CardHeader className="pb-2 px-4">
                    <CardTitle className="text-lg text-neon group-hover:text-secondary transition-colors line-clamp-1">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground line-clamp-1 text-sm">
                      {product.description || 'Producto gaming premium de alta calidad'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0 px-4 pb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-primary">
                          ${product.price.toLocaleString('es-CO')} COP
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Stock: {product.stock}
                        </span>
                      </div>
                      <Button variant="gaming" size="sm" className="px-4" onClick={() => navigate(`/producto/${product.id}`)}>
                        <ShoppingCart className="mr-1 h-4 w-4" />
                        Comprar
                      </Button>
                    </div>
                  </CardContent>
                </Card>)}
            </div>}
          
          {/* View All Products CTA */}
          <div className="text-center mt-16">
            <Button variant="gaming-secondary" size="lg" className="px-8 py-4 text-lg" onClick={() => navigate('/tienda')}>
              Ver Todos los Productos
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Courses Section - Modular */}
      <section className="py-24 relative overflow-hidden">
        {/* Gaming Background */}
        <div className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-60" style={{
            backgroundImage: `url('/lovable-uploads/9cbb1996-c02c-4b63-b7bd-45e2ca06d3eb.png')`
          }} />
        <div className="absolute inset-0 bg-background/85" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            
            
            <h2 className="text-4xl md:text-6xl font-bungee mb-6 text-glow">
              sube de nivel Con aventura gamer
            </h2>
            
            
            {/* Progress Bar */}
            
          </div>
      
          {coursesLoading ? <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gaming-blue shadow-glow"></div>
            </div> : coursesError ? <Card className="card-gaming border-destructive/30 max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-destructive" />
                </div>
                <p className="text-destructive mb-4">Error al cargar los cursos: {coursesError}</p>
                <Button variant="gaming" onClick={() => window.location.reload()}>
                  Reintentar Carga
                </Button>
              </CardContent>
            </Card> : courses.length === 0 ? <Card className="card-gaming max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No hay cursos disponibles en este momento.</p>
              </CardContent>
            </Card> : <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
              {courses.slice(0, 1).map(course => <Card key={course.id} className="card-gaming border-gaming-blue/20 overflow-hidden group bg-gradient-to-br from-card to-card/80">
                  {course.cover ? <div className="relative h-96 overflow-hidden">
                      <img src={course.cover} alt={course.title} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-gaming-blue/90 text-white border-gaming-blue/50">
                          Curso Elite
                        </Badge>
                      </div>
                    </div> : <div className="relative h-96 bg-gradient-to-br from-gaming-blue/20 to-primary/20 flex items-center justify-center">
                      <GraduationCap className="h-20 w-20 text-gaming-blue/40" />
                    </div>}
                  
                  <CardHeader className="pb-2 px-4">
                    <CardTitle className="text-lg text-neon group-hover:text-gaming-blue transition-colors line-clamp-1">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground line-clamp-1 text-sm">
                      {course.description || 'Curso especializado en tecnología gaming avanzada'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0 px-4 pb-4">
                    {/* Course Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">Progreso del Curso</span>
                        <span className="text-xs font-bold text-gaming-blue">Nivel {Math.floor(Math.random() * 5) + 1}</span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <div className="bg-gradient-to-r from-gaming-blue to-primary h-full rounded-full transition-all duration-500" style={{
                        width: `${Math.floor(Math.random() * 80) + 20}%`
                      }}></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-gaming-orange">
                          ${course.price.toLocaleString('es-CO')} COP
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Certificación incluida
                        </span>
                      </div>
                      <Button variant="gaming" size="sm" className="px-4" onClick={() => navigate('/cursos')}>
                        <Play className="mr-1 h-4 w-4" />
                        Iniciar
                      </Button>
                    </div>
                  </CardContent>
                </Card>)}
            </div>}
          
          {/* View All Courses CTA */}
          <div className="text-center mt-16">
            <Button variant="gaming-secondary" size="lg" className="px-8 py-4 text-lg" onClick={() => navigate('/cursos')}>
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
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.9463822928747!2d-75.59047032501901!3d6.168064593822529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4682f7b8b8b8b8%3A0x1234567890abcdef!2sCalle%2036%20Sur%20%2341-36%2C%20Envigado%2C%20Antioquia%2C%20Colombia!5e0!3m2!1ses!2sco!4v1735001234567!5m2!1ses!2sco" width="100%" height="300" style={{
                        border: 0
                      }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="card-gaming border-[hsl(180,100%,50%)]/30 text-center group animate-fade-in hover:scale-105 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(180,100%,50%)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(180,100%,50%)]/10 rounded-full blur-3xl group-hover:bg-[hsl(180,100%,50%)]/25 transition-colors duration-500"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[hsl(180,100%,50%)]/20 to-[hsl(180,100%,50%)]/10 flex items-center justify-center group-hover:from-[hsl(180,100%,50%)]/40 group-hover:to-[hsl(180,100%,50%)]/30 transition-all group-hover:rotate-12 group-hover:scale-110 duration-300 shadow-lg group-hover:shadow-[hsl(180,100%,50%)]/60">
                    <MapPin className="h-8 w-8 text-[hsl(180,100%,50%)] group-hover:animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-neon group-hover:text-[hsl(180,100%,50%)] transition-colors">Ubicación Central</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="font-medium">Calle 36 Sur #41-36</p>
                    <p>Local 116, Envigado</p>
                    <p>Antioquia, Colombia</p>
                  </div>
                  <Button variant="gaming" size="sm" className="mt-4 relative overflow-hidden group/btn bg-gradient-to-r from-[hsl(180,100%,50%)]/90 to-[hsl(180,100%,40%)]/80 hover:shadow-[0_0_20px_rgba(0,255,255,0.6)]" onClick={() => window.open('https://maps.google.com/?q=Aventura+Gamer+Envigado', '_blank')}>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover/btn:animate-[slide-in-right_0.6s_ease-in-out_infinite]"></span>
                    <span className="relative z-10">Ver en Google Maps</span>
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-gaming border-primary/40 text-center group animate-fade-in [animation-delay:0.1s] hover:scale-105 transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,123,255,0.6)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/15 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-500"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/25 to-primary/15 flex items-center justify-center group-hover:from-primary/50 group-hover:to-primary/35 transition-all group-hover:-rotate-12 group-hover:scale-110 duration-300 shadow-lg group-hover:shadow-primary/70">
                    <Phone className="h-8 w-8 text-primary group-hover:animate-[pulse_1s_ease-in-out_infinite]" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-neon group-hover:text-primary transition-colors">Contacto Directo</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">350 513 85 57</p>
                    <p>WhatsApp & Llamadas</p>
                    <p>Respuesta inmediata</p>
                  </div>
                  <Badge variant="secondary" className="mt-4 bg-primary/15 text-primary border-primary/30 group-hover:bg-primary/25 group-hover:shadow-lg group-hover:shadow-primary/40 transition-all">
                    24/7 WhatsApp
                  </Badge>
                </CardContent>
              </Card>

              <Card className="card-gaming border-accent/40 text-center group animate-fade-in [animation-delay:0.2s] hover:scale-105 transition-all duration-300 hover:shadow-[0_0_35px_rgba(106,13,173,0.6)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-accent/15 rounded-full blur-3xl group-hover:bg-accent/30 transition-colors duration-500"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent/25 to-accent/15 flex items-center justify-center group-hover:from-accent/50 group-hover:to-accent/35 transition-all group-hover:rotate-[360deg] group-hover:scale-110 duration-500 shadow-lg group-hover:shadow-accent/70">
                    <Clock className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-neon group-hover:text-accent transition-colors">Horarios Pro</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="font-medium">Lunes - Sábado</p>
                    <p className="text-xl font-bold text-accent group-hover:scale-110 transition-transform">9:00 AM - 7:00 PM</p>
                    <p>Domingos: Cerrado</p>
                  </div>
                  <Badge variant="secondary" className="mt-4 bg-accent/15 text-accent border-accent/30 group-hover:bg-accent/25 group-hover:shadow-lg group-hover:shadow-accent/40 transition-all animate-pulse">
                    Citas Disponibles
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button variant="gaming" size="lg" className="px-8 py-4 text-lg" onClick={() => window.open('https://wa.me/573505138557', '_blank')}>
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

      {/* FAQ Section */}
      <FAQSection title="Preguntas Frecuentes" description="Encuentra respuestas a las dudas más comunes sobre nuestros servicios gaming" faqs={homepageFAQs} className="bg-muted/10" />

      <Footer />
      </div>
    </div>
  </>;
};
export default Index;