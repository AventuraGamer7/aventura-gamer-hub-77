import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import SEOHead from '@/components/SEO/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, MessageCircle, Wrench, Shield, Clock, Star, ClipboardList, Smartphone } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image: string | null;
  platform: string[] | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchService(id);
    }
  }, [id]);

  const fetchService = async (serviceId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) {
        throw error;
      }

      setService(data as Service);
    } catch (err: any) {
      console.error('Error fetching service:', err);
      setError('Servicio no encontrado o hubo un error al cargar.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRequest = () => {
    if (!service) return;
    const message = `Hola, quiero solicitar el servicio: ${service.name}`;
    window.open(`https://wa.me/573505138557?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center pt-24 max-w-md mx-auto text-center space-y-4 px-4">
          <Wrench className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-bold">Servicio no encontrado</h2>
          <p className="text-muted-foreground mb-6">{error || 'No se pudo cargar la información del servicio.'}</p>
          <Button onClick={() => navigate('/servicios')} variant="gaming">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Servicios
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const seoData = {
    title: `${service.name} - Aventura Gamer`,
    description: service.description || `Servicio técnico garantizado: ${service.name} en Aventura Gamer Envigado.`,
    image: service.image || '/api/placeholder/400/400',
    type: 'website' as const,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <SEOHead {...seoData} />
      
      <Header />
      <WhatsAppFloat />
      
      <main className="flex-1 container mx-auto px-4 py-24 z-10">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/servicios')}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Servicios
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Service Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden border-border/50">
              <CardContent className="p-0">
                <div className="relative h-[28rem] md:h-[32rem] bg-muted/20 flex flex-col items-center justify-center p-6 group">
                  {service.image ? (
                    <img
                      key={service.id}
                      src={service.image}
                      alt={service.name}
                      className="max-w-full max-h-full object-contain rounded-md animate-scale-in transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center animate-fade-in">
                      <Wrench className="h-24 w-24 text-primary/20 transition-transform duration-500 group-hover:scale-110" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Info */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="w-fit bg-secondary/20 text-secondary hover:bg-secondary/30 transition-colors">
                  Servicio Técnico
                </Badge>
                {service.platform && service.platform.length > 0 && service.platform.map(p => (
                  <Badge key={p} variant="outline" className="w-fit border-primary/30 text-primary/80">
                    {p.toUpperCase()}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-3xl font-bold text-glow mb-4">{service.name}</h1>
              
              <div className="text-3xl font-bold text-primary mb-6">
                {service.price ? `$ ${service.price.toLocaleString('es-CO')} COP` : (
                  <span className="text-2xl text-secondary">Precio según diagnóstico</span>
                )}
              </div>
            </div>

            {service.description && (
              <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  Descripción del Servicio
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 space-y-4">
              <Button
                onClick={handleWhatsAppRequest}
                className="w-full relative overflow-hidden group animate-fade-in hover:scale-105 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] bg-green-600 hover:bg-green-700 text-white font-bold h-14"
                size="lg"
              >
                <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-gradient-to-r from-green-500/0 via-green-400/30 to-green-500/0 group-hover:animate-[slide-in-right_0.6s_ease-in-out_infinite]"></div>
                <MessageCircle className="mr-3 h-6 w-6 group-hover:animate-pulse relative z-10" />
                <span className="relative z-10 text-lg uppercase tracking-wider">Solicitar por WhatsApp</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/solicitar-servicio', {
                  state: {
                    servicio_nombre: service.name,
                    servicio_id: service.id,
                    descripcion_sugerida: `Solicitud de servicio: ${service.name}`
                  }
                })}
                className="w-full relative overflow-hidden border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300 h-14"
                size="lg"
              >
                <Smartphone className="mr-3 h-6 w-6" />
                <span className="text-lg uppercase tracking-wider">Solicitar orden de servicio</span>
              </Button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetails;
