import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { 
  MapPin, 
  Phone, 
  Clock,
  Mail,
  MessageCircle,
  Send,
  Navigation,
  Calendar,
  Headphones
} from 'lucide-react';

const Contacto = () => {
  const contactMethods = [
    {
      title: 'Visítanos',
      description: 'Ven a nuestro local en Envigado',
      icon: <MapPin className="h-6 w-6" />,
      info: 'Calle 36 Sur #41-36, Local 116',
      subInfo: 'Envigado, Colombia',
      action: 'Ver en Mapa',
      color: 'primary'
    },
    {
      title: 'Llámanos',
      description: 'Atención directa y personalizada',
      icon: <Phone className="h-6 w-6" />,
      info: '350 513 85 57',
      subInfo: 'Lun - Sáb: 9:00 AM - 7:00 PM',
      action: 'Llamar Ahora',
      color: 'secondary'
    },
    {
      title: 'WhatsApp',
      description: 'Respuesta inmediata',
      icon: <MessageCircle className="h-6 w-6" />,
      info: '350 513 85 57',
      subInfo: 'Disponible 24/7',
      action: 'Chatear',
      color: 'gaming-orange'
    }
  ];

  const services = [
    {
      title: 'Consulta Gratuita',
      description: 'Diagnóstico inicial sin costo',
      icon: <Headphones className="h-5 w-5" />
    },
    {
      title: 'Cita a Domicilio',
      description: 'Servicio técnico en tu casa',
      icon: <Navigation className="h-5 w-5" />
    },
    {
      title: 'Reserva de Cursos',
      description: 'Asegura tu cupo en nuestros cursos',
      icon: <Calendar className="h-5 w-5" />
    }
  ];

  const faqs = [
    {
      question: '¿Cuánto tiempo toma una reparación?',
      answer: 'Dependiendo del tipo de reparación, puede tomar entre 24 horas y 5 días hábiles. Hacemos diagnóstico gratuito en menos de 24 horas.'
    },
    {
      question: '¿Tienen garantía las reparaciones?',
      answer: 'Sí, todas nuestras reparaciones incluyen garantía de 3 meses. Para instalación de chips ofrecemos 6 meses de garantía.'
    },
    {
      question: '¿Realizan servicios a domicilio?',
      answer: 'Sí, ofrecemos servicio a domicilio en Medellín y área metropolitana. El costo adicional depende de la ubicación.'
    },
    {
      question: '¿Los cursos incluyen materiales?',
      answer: 'Sí, todos nuestros cursos incluyen materiales, herramientas durante la clase y certificado de participación.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WhatsAppFloat />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-orange/10 via-background to-secondary/10" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="bg-gaming-orange/20 text-gaming-orange border-gaming-orange/30">
              📞 Contáctanos
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-glow">
              Estamos Aquí Para Ti
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              ¿Tienes dudas sobre nuestros servicios? ¿Necesitas asesoría técnica? Contáctanos y recibe atención personalizada de nuestros expertos.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="card-gaming border-primary/20 text-center group">
                <CardContent className="p-8 space-y-6">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-${method.color}/20 flex items-center justify-center text-${method.color}`}>
                    {method.icon}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{method.title}</h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">{method.info}</p>
                    <p className="text-sm text-muted-foreground">{method.subInfo}</p>
                  </div>
                  
                  <Button variant="gaming" className="w-full">
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-glow">Envíanos un Mensaje</h2>
                <p className="text-muted-foreground">
                  Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas.
                </p>
              </div>

              <Card className="card-gaming border-primary/20">
                <CardHeader>
                  <CardTitle>Formulario de Contacto</CardTitle>
                  <CardDescription>
                    Cuéntanos cómo podemos ayudarte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input id="nombre" placeholder="Tu nombre completo" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input id="telefono" placeholder="Tu número de teléfono" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="tu@email.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="servicio">Servicio de Interés</Label>
                    <select className="w-full p-2 rounded-md border border-input bg-background">
                      <option>Selecciona un servicio</option>
                      <option>Reparación de Consolas</option>
                      <option>Reparación de Controles</option>
                      <option>Cursos de Reparación</option>
                      <option>Compra de Repuestos</option>
                      <option>Suscripción Mayorista</option>
                      <option>Otro</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Mensaje *</Label>
                    <Textarea 
                      id="mensaje" 
                      placeholder="Describe tu consulta o el problema que tienes con tu consola/control..."
                      rows={4}
                    />
                  </div>
                  
                  <Button variant="hero" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Mensaje
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Map & Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-glow">Nuestra Ubicación</h2>
                <p className="text-muted-foreground">
                  Encuentranos en el corazón de Envigado, fácil acceso en transporte público.
                </p>
              </div>

              {/* Map Placeholder */}
              <Card className="card-gaming border-primary/20 overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <MapPin className="h-12 w-12 mx-auto text-primary" />
                    <div>
                      <p className="font-semibold">Calle 36 Sur #41-36, Local 116</p>
                      <p className="text-sm text-muted-foreground">Envigado, Colombia</p>
                    </div>
                    <Button variant="gaming">
                      <Navigation className="mr-2 h-4 w-4" />
                      Ver en Google Maps
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Quick Services */}
              <Card className="card-gaming border-secondary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Servicios Rápidos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="text-primary mt-1">
                        {service.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{service.title}</h4>
                        <p className="text-xs text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-glow">Preguntas Frecuentes</h2>
              <p className="text-muted-foreground">
                Encuentra respuestas a las dudas más comunes sobre nuestros servicios.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="card-gaming border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                ¿No encontraste la respuesta que buscabas?
              </p>
              <Button variant="gaming-secondary" size="lg">
                <MessageCircle className="mr-2 h-5 w-5" />
                Hacer una Pregunta
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contacto;