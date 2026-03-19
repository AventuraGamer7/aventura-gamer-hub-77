import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import SEOHead from '@/components/SEO/SEOHead';
import Breadcrumbs from '@/components/SEO/Breadcrumbs';
import FAQSection from '@/components/SEO/FAQSection';
import { generateServiceSchema, getSEOKeywords } from '@/utils/seoUtils';
import { Gamepad2, Wrench, Shield, Clock, Star, Phone, MessageCircle } from 'lucide-react';

const ServiciosSpecific: React.FC = () => {
  const { servicio } = useParams<{ servicio: string }>();
  
  // Service configurations
  const serviceConfigs: Record<string, {
    title: string;
    description: string;
    price: string;
    image: string;
    features: string[];
    faqs: Array<{question: string; answer: string}>;
    keywords: string;
    icon: React.ReactNode;
    warranty: string;
    duration: string;
  }> = {
    'reparacion-playstation': {
      title: 'Reparación Profesional PlayStation',
      description: 'Servicio técnico especializado para PlayStation 5, PS4, PS3 y modelos anteriores. Diagnóstico gratuito, repuestos originales y garantía de 6 meses.',
      price: 'Desde $80.000 COP',
      image: '/assets/repair-playstation.jpg',
      features: [
        'Diagnóstico gratuito en 24 horas',
        'Repuestos originales garantizados',
        'Limpieza profunda incluida',
        'Pruebas de rendimiento completas',
        'Garantía de 6 meses',
        'Soporte técnico post-reparación'
      ],
      keywords: 'reparación PlayStation 5 Envigado, arreglo PS4 Antioquia, servicio técnico PlayStation, diagnóstico PS5 gratuito',
      icon: <Gamepad2 className="h-8 w-8" />,
      warranty: '6 meses',
      duration: '24-48 horas',
      faqs: [
        {
          question: '¿Cuánto cuesta la reparación de PlayStation?',
          answer: 'El diagnóstico es gratuito. Los precios varían según el modelo y problema: PlayStation 5 desde $120.000, PS4 desde $80.000, PS3 desde $60.000. Incluye garantía de 6 meses.'
        },
        {
          question: '¿Qué problemas comunes reparan en PlayStation?',
          answer: 'Reparamos: sobrecalentamiento, no enciende, problemas de video/audio, lectora de discos, conectores USB, controles defectuosos, ventiladores ruidosos y actualizaciones de software.'
        },
        {
          question: '¿Cuánto demora la reparación?',
          answer: 'Diagnóstico: 24 horas. Reparaciones simples: 24-48 horas. Reparaciones complejas: 3-5 días hábiles. Te mantenemos informado del progreso.'
        },
        {
          question: '¿Usan repuestos originales?',
          answer: 'Sí, solo utilizamos repuestos originales Sony o compatibles de alta calidad. Todos los repuestos tienen garantía individual de 6 meses.'
        }
      ]
    },
    'reparacion-xbox': {
      title: 'Reparación Especializada Xbox',
      description: 'Técnicos certificados en Xbox Series X/S, Xbox One, Xbox 360. Soluciones para Red Ring of Death, problemas de disco y sobrecalentamiento.',
      price: 'Desde $75.000 COP',
      image: '/assets/repair-xbox.jpg',
      features: [
        'Especialistas en Red Ring of Death',
        'Reparación de lectoras DVD/Blu-ray',
        'Solución a sobrecalentamiento',
        'Cambio de pasta térmica premium',
        'Reparación conectores HDMI',
        'Actualizaciones de firmware'
      ],
      keywords: 'reparación Xbox Series X Envigado, arreglo Xbox One Antioquia, Red Ring of Death, servicio técnico Microsoft',
      icon: <Gamepad2 className="h-8 w-8" />,
      warranty: '6 meses',
      duration: '24-72 horas',
      faqs: [
        {
          question: '¿Pueden reparar el Red Ring of Death?',
          answer: 'Sí, somos especialistas en RRoD. Tenemos tasa de éxito del 95% en Xbox 360. Incluye reballing del procesador, cambio de pasta térmica y modificaciones de ventilación.'
        },
        {
          question: '¿Reparan Xbox Series X/S?',
          answer: 'Absolutamente. Reparamos todos los modelos: Series X, Series S, Xbox One X/S, Xbox 360. Problemas comunes: no enciende, sobrecalentamiento, lectora, HDMI.'
        },
        {
          question: '¿Qué incluye el servicio de reparación?',
          answer: 'Diagnóstico gratuito, limpieza profunda, cambio de pasta térmica, pruebas completas, garantía 6 meses y soporte técnico continuo.'
        },
        {
          question: '¿Tienen repuestos para Xbox clásico?',
          answer: 'Sí, manejamos repuestos para Xbox, Xbox 360, Xbox One y Series X/S. Desde lectoras hasta procesadores y fuentes de poder.'
        }
      ]
    },
    'reparacion-nintendo': {
      title: 'Reparación Nintendo Switch y Retro',
      description: 'Expertos en Nintendo Switch, Joy-Con drift, pantallas rotas. También reparamos consolas retro: GameCube, Wii, 3DS y Game Boy.',
      price: 'Desde $60.000 COP',
      image: '/assets/repair-nintendo.jpg',
      features: [
        'Reparación Joy-Con drift',
        'Cambio de pantallas Switch',
        'Reparación consolas retro',
        'Modificaciones homebrew',
        'Limpieza de contactos',
        'Calibración de controles'
      ],
      keywords: 'reparación Nintendo Switch Envigado, Joy-Con drift Antioquia, arreglo pantalla Switch, consolas retro Nintendo',
      icon: <Gamepad2 className="h-8 w-8" />,
      warranty: '4 meses',
      duration: '24-48 horas',
      faqs: [
        {
          question: '¿Pueden arreglar el Joy-Con drift?',
          answer: 'Sí, es nuestra especialidad. Reparamos drift mediante limpieza profunda o cambio de joysticks. Garantía de 4 meses en reparación de controles.'
        },
        {
          question: '¿Cambian pantallas de Nintendo Switch?',
          answer: 'Sí, cambiamos pantallas de Switch original y Lite. Usamos pantallas OEM de alta calidad. El servicio incluye calibración táctil y pruebas completas.'
        },
        {
          question: '¿Reparan consolas Nintendo antiguas?',
          answer: 'Sí, reparamos: Game Boy, Game Boy Color/Advance, Nintendo DS/3DS, GameCube, Wii, Wii U. Tenemos experiencia en sistemas retro.'
        },
        {
          question: '¿Ofrecen modificaciones homebrew?',
          answer: 'Ofrecemos información sobre homebrew legal. No realizamos modificaciones que violen términos de servicio de Nintendo. Consulta casos específicos.'
        }
      ]
    }
  };
  
  const config = serviceConfigs[servicio || ''];
  
  if (!config) {
    return <Navigate to="/servicios" replace />;
  }
  
  const structuredData = generateServiceSchema({
    name: config.title,
    description: config.description,
    price: 80000, // Base price
    image: config.image
  });
  
  const breadcrumbItems = [
    { title: 'Inicio', href: '/' },
    { title: 'Servicios', href: '/servicios' },
    { title: config.title }
  ];

  return (
    <>
      <SEOHead
        title={`${config.title} en Envigado`}
        description={config.description}
        keywords={config.keywords}
        type="service"
        structuredData={structuredData}
        canonicalUrl={`https://aventuragamer.com/servicios/${servicio}`}
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-8">
          <div className="container mx-auto px-4">
            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} />
            
            {/* Hero Section */}
            <section className="py-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <Badge variant="secondary" className="mb-4">
                    <Wrench className="w-4 h-4 mr-2" />
                    Servicio Especializado
                  </Badge>
                  
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
                    {config.title}
                  </h1>
                  
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                    {config.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="text-sm">Garantía {config.warranty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-secondary" />
                      <span className="text-sm">{config.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-gaming-orange" />
                      <span className="text-sm">5.0 estrellas</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="px-8">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Solicitar Diagnóstico
                    </Button>
                    <Button variant="gaming-secondary" size="lg" className="px-8">
                      <Phone className="w-5 h-5 mr-2" />
                      Llamar Ahora
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <Card className="card-gaming border-primary/30">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        {config.icon}
                      </div>
                      <CardTitle className="text-2xl mb-2">Precio Base</CardTitle>
                      <div className="text-3xl font-bold text-primary">{config.price}</div>
                      <p className="text-sm text-muted-foreground">Diagnóstico gratuito incluido</p>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </section>
            
            {/* Features Section */}
            <section className="py-16">
              <h2 className="text-3xl font-bold text-center mb-12 text-glow">
                ¿Qué Incluye Nuestro Servicio?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {config.features.map((feature, index) => (
                  <Card key={index} className="card-gaming border-secondary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <p className="text-muted-foreground">{feature}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
          
          {/* FAQ Section */}
          <FAQSection
            title={`Preguntas Frecuentes - ${config.title}`}
            description="Resuelve todas tus dudas sobre nuestro servicio especializado"
            faqs={config.faqs}
            className="bg-muted/20"
          />
          
          {/* CTA Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <Card className="card-gaming border-primary/30 text-center">
                <CardContent className="p-12">
                  <h3 className="text-3xl font-bold mb-6 text-glow">
                    ¿Listo para Reparar tu Consola?
                  </h3>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Diagnóstico gratuito en 24 horas. Técnicos certificados con garantía completa.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="px-8">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      WhatsApp: 350 513 85 57
                    </Button>
                    <Button variant="gaming-secondary" size="lg" className="px-8">
                      <Phone className="w-5 h-5 mr-2" />
                      Llamar Ahora
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
        
        <WhatsAppFloat />
        <Footer />
      </div>
    </>
  );
};

export default ServiciosSpecific;