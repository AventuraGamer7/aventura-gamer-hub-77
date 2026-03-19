import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTechnicalServices } from '@/hooks/useTechnicalServices';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Wrench, 
  Clock, 
  MessageCircle, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Eye,
  Package,
  Truck
} from 'lucide-react';
import { useState } from 'react';

const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'recibido':
      return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
    case 'diagnostico':
      return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
    case 'esperando_aprobacion':
      return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
    case 'reparando':
      return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
    case 'completado':
      return 'bg-green-500/20 text-green-600 border-green-500/30';
    case 'entregado':
      return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    default:
      return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
  }
};

const getStatusText = (estado: string) => {
  switch (estado) {
    case 'recibido':
      return 'Recibido';
    case 'diagnostico':
      return 'En Diagnóstico';
    case 'esperando_aprobacion':
      return 'Esperando Aprobación';
    case 'reparando':
      return 'Reparando';
    case 'completado':
      return 'Completado';
    case 'entregado':
      return 'Entregado';
    default:
      return 'Desconocido';
  }
};

const getStatusIcon = (estado: string) => {
  switch (estado) {
    case 'recibido':
      return <Package className="h-4 w-4" />;
    case 'diagnostico':
      return <Eye className="h-4 w-4" />;
    case 'esperando_aprobacion':
      return <AlertCircle className="h-4 w-4" />;
    case 'reparando':
      return <Settings className="h-4 w-4" />;
    case 'completado':
      return <CheckCircle className="h-4 w-4" />;
    case 'entregado':
      return <Truck className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const TechnicalServicesDashboard = () => {
  const { user } = useAuth();
  const { getServicesByClient, addComment } = useTechnicalServices();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  // Para demo, usamos user-1 como cliente
  const clientServices = getServicesByClient('user-1');

  const handleAddComment = (serviceId: string) => {
    if (newComment.trim()) {
      addComment(serviceId, newComment, 'cliente');
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-glow">Mis Servicios Técnicos</h2>
        <p className="text-muted-foreground">Seguimiento de reparaciones y mantenimiento</p>
      </div>

      {clientServices.length === 0 ? (
        <Card className="card-gaming border-primary/20">
          <CardContent className="p-8 text-center">
            <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No tienes servicios técnicos</h3>
            <p className="text-muted-foreground">
              Cuando tengas equipos en reparación aparecerán aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {clientServices.map((service) => (
            <Card key={service.id} className="card-gaming border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Wrench className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Servicio #{service.id.slice(-6)}</CardTitle>
                      <CardDescription>{service.descripcion}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(service.estado)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(service.estado)}
                      {getStatusText(service.estado)}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Fecha de ingreso:</span>
                    <p className="font-medium">
                      {format(new Date(service.fechaCreacion), 'dd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Última actualización:</span>
                    <p className="font-medium">
                      {format(new Date(service.fechaActualizacion), 'dd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                </div>

                {service.cotizacion && (
                  <div className="p-3 rounded-lg bg-muted/30 border border-dashed border-primary/30">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Cotización:</span>
                      <span className="font-bold text-primary">
                        ${service.cotizacion.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Comentarios ({service.comentarios.length})
                    </h4>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                    >
                      {selectedService === service.id ? 'Ocultar' : 'Ver'}
                    </Button>
                  </div>

                  {selectedService === service.id && (
                    <div className="space-y-3">
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {service.comentarios.map((comment) => (
                          <div 
                            key={comment.id} 
                            className={`p-3 rounded-lg text-sm ${
                              comment.autor === 'admin' 
                                ? 'bg-blue-500/10 border-l-2 border-blue-500' 
                                : 'bg-green-500/10 border-l-2 border-green-500'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium capitalize">{comment.autor}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(comment.fecha), 'dd MMM HH:mm', { locale: es })}
                              </span>
                            </div>
                            <p>{comment.texto}</p>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Textarea
                          placeholder="Escribe tu comentario..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="bg-background/50"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => handleAddComment(service.id)}
                          disabled={!newComment.trim()}
                          className="btn-gaming"
                        >
                          Agregar Comentario
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnicalServicesDashboard;