import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useNavigate } from 'react-router-dom';
import { useServices } from '@/hooks/useServices';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Wrench, Home, Cpu, Shield, Clock, CheckCircle, Star, Target, Gamepad2, Zap, Lock, Settings, Flame, Monitor, HardDrive, Battery, ShoppingCart } from 'lucide-react';
const Servicios = () => {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(false); // Mock authentication state
  const { addItem } = useCart();
  const { toast } = useToast();
  const {
    services,
    loading,
    error
  } = useServices();
  const handleAcceptMission = (serviceTitle: string) => {
    navigate('/cursos', {
      state: {
        missionTitle: serviceTitle
      }
    });
  };
  return <div className="min-h-screen bg-background">
      <Header />
      <WhatsAppFloat />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-0 mx-[63px] my-0 py-[43px]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6 py-0">
            
            
            <h1 className="text-4xl md:text-6xl font-bold text-glow">Servicio Técnico</h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Reparaciones profesionales con garantía, diagnóstico gratuito y servicio a domicilio en Envigado y área metropolitana.
            </p>
          </div>
        </div>
      </section>

      {/* Misiones Disponibles */}
      {isLoggedIn && <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <Badge variant="secondary" className="bg-secondary/30 text-secondary border-secondary/50 mb-4">
                🎯 Solo para Aventureros Registrados
              </Badge>
              <h2 className="text-3xl font-bold text-glow mb-4">Misiones Disponibles</h2>
              <p className="text-muted-foreground">Completa misiones y gana XP reparando tu propio equipo</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-gaming border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Misión: Drift Zero</h3>
                  <p className="text-sm text-muted-foreground mb-4">Instala análogos magnéticos</p>
                  <Badge className="bg-primary/20 text-primary">+500 XP</Badge>
                </CardContent>
              </Card>
              
              <Card className="card-gaming border-secondary/20">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Flame className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-semibold mb-2">Misión: Cool Master</h3>
                  <p className="text-sm text-muted-foreground mb-4">Soluciona sobrecalentamiento</p>
                  <Badge className="bg-secondary/20 text-secondary">+750 XP</Badge>
                </CardContent>
              </Card>
              
              <Card className="card-gaming border-gaming-orange/20">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gaming-orange/20 flex items-center justify-center">
                    <Monitor className="h-8 w-8 text-gaming-orange" />
                  </div>
                  <h3 className="font-semibold mb-2">Misión: Pixel Perfect</h3>
                  <p className="text-sm text-muted-foreground mb-4">Cambia pantalla de Switch</p>
                  <Badge className="bg-gaming-orange/20 text-gaming-orange">+1000 XP</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>}

      {/* Services Categories */}
      <section className="py-[8px]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            
            {loading ? <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div> : error ? <div className="text-center py-12">
                <p className="text-red-500">Error al cargar los servicios: {error}</p>
                <Button variant="gaming" onClick={() => window.location.reload()}>
                  Reintentar
                </Button>
              </div> : services.length === 0 ? <div className="text-center py-12">
                <p className="text-muted-foreground">No hay servicios disponibles en este momento.</p>
              </div> : <Tabs defaultValue="todos" className="w-full py-[8px] px-0 my-px">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="controles">Controles</TabsTrigger>
                  <TabsTrigger value="consolas">Consolas</TabsTrigger>
                  <TabsTrigger value="extras">Extras</TabsTrigger>
                </TabsList>
                
                <TabsContent value="todos" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(service => <Card key={service.id} className="card-gaming border-primary/20 overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/40">
                        <div className="relative">
                          {service.image ? <img src={service.image} alt={service.name} className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110" /> : <div className="h-72 bg-primary/10 flex items-center justify-center">
                              <Wrench className="h-12 w-12 text-primary/30" />
                            </div>}
                        </div>
                        
                        <CardHeader className="space-y-2 transition-all duration-300 group-hover:pb-6">
                          <CardTitle className="text-lg text-neon group-hover:text-xl transition-all duration-300">{service.name}</CardTitle>
                          <CardDescription className="text-sm text-muted-foreground group-hover:text-base transition-all duration-300 group-hover:line-clamp-none line-clamp-2">
                            {service.description || 'Descripción no disponible'}
                          </CardDescription>
                          
                          {/* Expanded content on hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 max-h-0 group-hover:max-h-40 overflow-hidden">
                            <div className="space-y-2 pt-2 border-t border-muted/20">
                              <p className="text-xs text-muted-foreground">✓ Diagnóstico gratuito</p>
                              <p className="text-xs text-muted-foreground">✓ Garantía incluida</p>
                              <p className="text-xs text-muted-foreground">✓ Servicio a domicilio disponible</p>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-primary">${service.price.toFixed(0)}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="gaming" size="sm" className="flex-1">
                              <ShoppingCart className="mr-1 h-3 w-3" />
                              Solicitar
                            </Button>
                            <Button variant="gaming-secondary" size="sm" onClick={() => handleAcceptMission(service.name)}>
                              <Target className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>)}
                  </div>
                </TabsContent>
                
                <TabsContent value="controles" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.filter(service => service.name.toLowerCase().includes('control') || service.name.toLowerCase().includes('joy') || service.name.toLowerCase().includes('boton') || service.name.toLowerCase().includes('analog') || service.name.toLowerCase().includes('carga')).map(service => <Card key={service.id} className="card-gaming border-primary/20 overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/40">
                          <div className="relative">
                            {service.image ? <img src={service.image} alt={service.name} className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110" /> : <div className="h-72 bg-primary/10 flex items-center justify-center">
                                <Gamepad2 className="h-12 w-12 text-primary/30" />
                              </div>}
                          </div>
                          
                          <CardHeader className="space-y-2 transition-all duration-300 group-hover:pb-6">
                            <CardTitle className="text-lg text-neon group-hover:text-xl transition-all duration-300">{service.name}</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground group-hover:text-base transition-all duration-300 group-hover:line-clamp-none line-clamp-2">
                              {service.description || 'Descripción no disponible'}
                            </CardDescription>
                            
                            {/* Expanded content on hover */}
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 max-h-0 group-hover:max-h-40 overflow-hidden">
                              <div className="space-y-2 pt-2 border-t border-muted/20">
                                <p className="text-xs text-muted-foreground">✓ Diagnóstico gratuito</p>
                                <p className="text-xs text-muted-foreground">✓ Garantía incluida</p>
                                <p className="text-xs text-muted-foreground">✓ Servicio a domicilio disponible</p>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-primary">${service.price.toFixed(0)}</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button variant="gaming" size="sm" className="flex-1">
                                <ShoppingCart className="mr-1 h-3 w-3" />
                                Solicitar
                              </Button>
                              <Button variant="gaming-secondary" size="sm" onClick={() => handleAcceptMission(service.name)}>
                                <Target className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>)}
                  </div>
                </TabsContent>
                
                <TabsContent value="consolas" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.filter(service => service.name.toLowerCase().includes('consola') || service.name.toLowerCase().includes('switch') || service.name.toLowerCase().includes('play') || service.name.toLowerCase().includes('xbox') || service.name.toLowerCase().includes('mantenimiento') || service.name.toLowerCase().includes('pasta') || service.name.toLowerCase().includes('fuente') || service.name.toLowerCase().includes('lectura') || service.name.toLowerCase().includes('sobrecalentamiento') || service.name.toLowerCase().includes('pantalla') || service.name.toLowerCase().includes('disco')).map(service => <Card key={service.id} className="card-gaming border-primary/20 overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/40">
                          <div className="relative">
                            {service.image ? <img src={service.image} alt={service.name} className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110" /> : <div className="h-72 bg-primary/10 flex items-center justify-center">
                                <Cpu className="h-12 w-12 text-primary/30" />
                              </div>}
                          </div>
                          
                          <CardHeader className="space-y-2 transition-all duration-300 group-hover:pb-6">
                            <CardTitle className="text-lg text-neon group-hover:text-xl transition-all duration-300">{service.name}</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground group-hover:text-base transition-all duration-300 group-hover:line-clamp-none line-clamp-2">
                              {service.description || 'Descripción no disponible'}
                            </CardDescription>
                            
                            {/* Expanded content on hover */}
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 max-h-0 group-hover:max-h-40 overflow-hidden">
                              <div className="space-y-2 pt-2 border-t border-muted/20">
                                <p className="text-xs text-muted-foreground">✓ Diagnóstico gratuito</p>
                                <p className="text-xs text-muted-foreground">✓ Garantía incluida</p>
                                <p className="text-xs text-muted-foreground">✓ Servicio a domicilio disponible</p>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-primary">${service.price.toFixed(0)}</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                variant="gaming" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => {
                                  addItem({
                                    id: service.id,
                                    name: service.name,
                                    price: service.price,
                                    image: service.image || undefined,
                                    type: 'service'
                                  });
                                  toast({
                                    title: 'Servicio agregado',
                                    description: `${service.name} se agregó al carrito`,
                                  });
                                }}
                              >
                                <ShoppingCart className="mr-1 h-3 w-3" />
                                Solicitar
                              </Button>
                              <Button variant="gaming-secondary" size="sm" onClick={() => handleAcceptMission(service.name)}>
                                <Target className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>)}
                  </div>
                </TabsContent>
                
                <TabsContent value="extras" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.filter(service => service.name.toLowerCase().includes('domicilio') || service.name.toLowerCase().includes('express') || service.name.toLowerCase().includes('urgente') || service.name.toLowerCase().includes('prioridad')).map(service => <Card key={service.id} className="card-gaming border-secondary/20 overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-secondary/40">
                          <div className="relative">
                            {service.image ? <img src={service.image} alt={service.name} className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110" /> : <div className="h-72 bg-secondary/10 flex items-center justify-center">
                                <Home className="h-12 w-12 text-secondary/30" />
                              </div>}
                          </div>
                          
                          <CardHeader className="space-y-2 transition-all duration-300 group-hover:pb-6">
                            <CardTitle className="text-lg text-neon group-hover:text-xl transition-all duration-300">{service.name}</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground group-hover:text-base transition-all duration-300 group-hover:line-clamp-none line-clamp-2">
                              {service.description || 'Descripción no disponible'}
                            </CardDescription>
                            
                            {/* Expanded content on hover */}
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 max-h-0 group-hover:max-h-40 overflow-hidden">
                              <div className="space-y-2 pt-2 border-t border-muted/20">
                                <p className="text-xs text-muted-foreground">✓ Diagnóstico gratuito</p>
                                <p className="text-xs text-muted-foreground">✓ Garantía incluida</p>
                                <p className="text-xs text-muted-foreground">✓ Servicio a domicilio disponible</p>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-secondary">${service.price.toFixed(0)}</span>
                              </div>
                            </div>
                            
                            <Button variant="gaming" className="w-full">
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Solicitar Información
                            </Button>
                          </CardContent>
                        </Card>)}
                  </div>
                </TabsContent>
              </Tabs>}
          </div>
        </div>
      </section>

      {/* Hazlo Tú Mismo Challenge */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="card-gaming border-secondary/30 overflow-hidden">
              <div className="bg-gradient-to-r from-secondary/20 to-primary/20 p-8">
                <div className="text-center space-y-6">
                  <Badge variant="secondary" className="bg-secondary/30 text-secondary border-secondary/50">
                    🎯 Misión Especial
                  </Badge>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-glow">
                    Desafío: Hazlo Tú Mismo
                  </h2>
                  
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    ¿Quieres aprender a reparar tus propias consolas? Acepta el desafío y conviértete en un maestro de la reparación con nuestros cursos especializados.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                        <Target className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold">Misión 1</h3>
                      <p className="text-sm text-muted-foreground">Reparación de Joystick Drift</p>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-secondary/20 flex items-center justify-center">
                        <Cpu className="h-6 w-6 text-secondary" />
                      </div>
                      <h3 className="font-semibold">Misión 2</h3>
                      <p className="text-sm text-muted-foreground">Consolas que no Encienden</p>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-gaming-orange/20 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-gaming-orange" />
                      </div>
                      <h3 className="font-semibold">Misión 3</h3>
                      <p className="text-sm text-muted-foreground">Cambio de Pantalla Switch</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                    <Button variant="gaming" size="lg">
                      <Target className="mr-2 h-5 w-5" />
                      Acepto el Desafío
                    </Button>
                    <Button variant="gaming-secondary" size="lg">
                      Ver Todas las Misiones
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-glow">
                Nuestra Garantía Aventurera
              </h2>
              <p className="text-lg text-muted-foreground">
                Respaldamos cada reparación con garantía completa y servicio post-venta
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="card-gaming border-primary/20 text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Reparaciones garantizadas.</h3>
                  <p className="text-sm text-muted-foreground">Garantía completa en todas nuestras reparaciones.</p>
                </CardContent>
              </Card>

              <Card className="card-gaming border-primary/20 text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Star className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-semibold mb-2">Diagnóstico Gratuito</h3>
                  <p className="text-sm text-muted-foreground">
                    Evaluación completa sin costo y presupuesto transparente
                  </p>
                </CardContent>
              </Card>

              <Card className="card-gaming border-primary/20 text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gaming-orange/20 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-gaming-orange" />
                  </div>
                  <h3 className="font-semibold mb-2">Servicio Rápido</h3>
                  <p className="text-sm text-muted-foreground">
                    Tiempos de respuesta rápidos y comunicación constante
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
export default Servicios;