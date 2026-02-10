import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import SEOHead from '@/components/SEO/SEOHead';
import FAQSection from '@/components/SEO/FAQSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import FeaturedServices from '@/components/FeaturedServices';
import FeaturedStore from '@/components/FeaturedStore';
import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, MapPin, Phone, Clock, ChevronRight, Play, Truck, Package, CreditCard, Youtube, Instagram, ExternalLink } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();

  const homepageFAQs = [
    { question: '¿Qué tipos de consolas reparan?', answer: 'Reparamos todas las consolas gaming: PlayStation (5, 4, 3, 2, 1), Xbox (Series X/S, One, 360, Original), Nintendo (Switch, Wii U, Wii, GameCube), consolas retro y handhelds como 3DS, PSP y Game Boy.' },
    { question: '¿Cuánto tiempo toman las reparaciones?', answer: 'El diagnóstico es gratuito y toma 24 horas. Las reparaciones simples toman 1-2 días, mientras que las complejas pueden tomar 3-5 días hábiles.' },
    { question: '¿Ofrecen garantía en las reparaciones?', answer: 'Sí, todas nuestras reparaciones incluyen garantía: 6 meses para PlayStation y Xbox, 4 meses para Nintendo.' },
    { question: '¿Tienen cursos disponibles?', answer: 'Ofrecemos cursos especializados en reparación de consolas, desde nivel básico hasta avanzado. Incluyen certificación y material de práctica.' },
    { question: '¿Dónde están ubicados?', answer: 'Estamos en Calle 36 Sur #41-36 Local 116, Envigado, Antioquia. Atendemos de lunes a sábado de 9:00 AM a 7:00 PM.' },
    { question: '¿Cómo puedo solicitar un servicio?', answer: 'Puedes contactarnos por WhatsApp al 350 513 85 57, llamarnos, visitarnos directamente o usar nuestro formulario web.' },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "Organization",
      "@id": "https://aventuragamer.com/#organization",
      "name": "Aventura Gamer",
      "url": "https://aventuragamer.com",
      "contactPoint": { "@type": "ContactPoint", "telephone": "+573505138557", "contactType": "customer service", "availableLanguage": "Spanish" },
      "address": { "@type": "PostalAddress", "streetAddress": "Calle 36 Sur #41-36 Local 116", "addressLocality": "Envigado", "addressRegion": "Antioquia", "addressCountry": "CO" },
    }]
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  return (
    <>
      <SEOHead
        title="Aventura Gamer - Reparación de Consolas y Cursos Gaming en Envigado"
        description="Expertos en reparación de PlayStation, Xbox y Nintendo en Envigado. Cursos especializados, repuestos originales y servicio técnico certificado."
        keywords="reparación consolas Envigado, PlayStation Xbox Nintendo, cursos gaming Colombia"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-background">
        <Header />
        <WhatsAppFloat />

        {/* Featured Products - Tienda */}
        <div className="pt-20">
          <FeaturedProducts />
        </div>

        {/* Trust bar */}
        <section className="py-4 border-y border-border bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-5 w-5 text-primary" />
                <span>Envío a toda Colombia</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-5 w-5 text-primary" />
                <span>Garantía incluida</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>Pago seguro</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <FeaturedServices />

        {/* Featured Store */}
        <FeaturedStore />

        {/* Courses Section */}
        {!coursesLoading && !coursesError && courses.length > 0 && (
          <section className="py-8 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">📚 Cursos & Capacitaciones</h2>
                </div>
                <button onClick={() => navigate('/cursos')} className="text-sm text-primary hover:underline flex items-center gap-1">
                  Ver todos <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.slice(0, 3).map(course => (
                  <div
                    key={course.id}
                    className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer flex flex-col"
                    onClick={() => navigate('/cursos')}
                  >
                    {course.cover ? (
                      <div className="relative h-48 overflow-hidden">
                        <img src={course.cover} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        <Badge className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs">Curso</Badge>
                      </div>
                    ) : (
                      <div className="h-48 bg-muted/30 flex items-center justify-center">
                        <GraduationCap className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {course.description || 'Curso especializado en tecnología gaming'}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-lg font-bold text-foreground">{formatPrice(course.price)}</span>
                        <Button variant="default" size="sm" className="text-xs">
                          <Play className="h-3 w-3 mr-1" /> Ver curso
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Social Media Section */}
        <section className="py-8 bg-background border-t border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 text-center">Síguenos en Redes Sociales</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">Tutoriales, tips gaming y novedades de la tienda</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              {/* YouTube */}
              <a
                href="https://www.youtube.com/@aventuragamer777"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 w-full sm:w-auto flex-1 p-4 rounded-xl border border-border bg-card hover:border-destructive/50 hover:shadow-md transition-all duration-200"
              >
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors shrink-0">
                  <img src="/lovable-uploads/cc10dbd8-68ed-412d-9016-15dd833460b9.png" alt="YouTube" className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">YouTube</p>
                  <p className="text-xs text-muted-foreground truncate">@aventuragamer777</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors shrink-0" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/aventuragamer777/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 w-full sm:w-auto flex-1 p-4 rounded-xl border border-border bg-card hover:border-accent/50 hover:shadow-md transition-all duration-200"
              >
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors shrink-0">
                  <Instagram className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">Instagram</p>
                  <p className="text-xs text-muted-foreground truncate">@aventuragamer777</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/573505138557"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 w-full sm:w-auto flex-1 p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">WhatsApp</p>
                  <p className="text-xs text-muted-foreground truncate">350 513 85 57</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </a>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-8 bg-muted/20 border-t border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 text-center">Encuéntranos</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Ubicación</p>
                  <p className="text-xs text-muted-foreground">Calle 36 Sur #41-36 Local 116, Envigado, Antioquia</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Contacto</p>
                  <p className="text-xs text-muted-foreground">350 513 85 57 — WhatsApp & Llamadas</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Horario</p>
                  <p className="text-xs text-muted-foreground">Lun - Sáb: 9:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto rounded-lg overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.9463822928747!2d-75.59047032501901!3d6.168064593822529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4682f7b8b8b8b8%3A0x1234567890abcdef!2sCalle%2036%20Sur%20%2341-36%2C%20Envigado%2C%20Antioquia%2C%20Colombia!5e0!3m2!1ses!2sco!4v1735001234567!5m2!1ses!2sco"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection
          title="Preguntas Frecuentes"
          description="Respuestas a las dudas más comunes"
          faqs={homepageFAQs}
          className="bg-muted/10"
        />

        <Footer />
      </div>
    </>
  );
};

export default Index;
