import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Package,
  Eye,
  Clock,
  Wrench,
  CheckCircle,
  Truck,
  FileText
} from 'lucide-react';

interface OrdenServicio {
  id: string;
  usuario_id: string;
  estado: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
}

const getStatusColor = (estado: string) => {
  switch (estado.toLowerCase()) {
    case 'recibido':
      return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
    case 'en_diagnostico':
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

const getStatusIcon = (estado: string) => {
  switch (estado.toLowerCase()) {
    case 'recibido':
      return <Package className="h-4 w-4" />;
    case 'en_diagnostico':
    case 'diagnostico':
      return <Eye className="h-4 w-4" />;
    case 'esperando_aprobacion':
      return <Clock className="h-4 w-4" />;
    case 'reparando':
      return <Wrench className="h-4 w-4" />;
    case 'completado':
      return <CheckCircle className="h-4 w-4" />;
    case 'entregado':
      return <Truck className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const OrdenesCliente = () => {
  const { user } = useAuth();
  const [ordenes, setOrdenes] = useState<OrdenServicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdenes = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('ordenes_servicio')
          .select('*')
          .eq('usuario_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrdenes(data || []);
      } catch (error) {
        console.error('Error al cargar órdenes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, [user]);

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-glow mb-4">Mis Órdenes de Servicio</h2>
            <p className="text-muted-foreground">Inicia sesión para ver tus órdenes de servicio</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-glow mb-4">Mis Órdenes de Servicio</h2>
            <p className="text-muted-foreground">
              Seguimiento del estado de tus equipos en reparación
            </p>
          </div>

          {ordenes.length === 0 ? (
            <Card className="card-gaming border-primary/20">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-4">No tienes órdenes de servicio</h3>
                <p className="text-muted-foreground mb-6">
                  Aún no has registrado ningún equipo para reparación.
                </p>
                <p className="text-sm text-muted-foreground">
                  Contacta con nuestro equipo para crear tu primera orden de servicio.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ordenes.map((orden) => (
                <Card key={orden.id} className="card-gaming border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          {getStatusIcon(orden.estado)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">Orden #{orden.id.slice(-8)}</CardTitle>
                          <CardDescription>
                            Creada: {format(new Date(orden.created_at), 'dd MMM yyyy', { locale: es })}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(orden.estado)}>
                        {orden.estado}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Descripción:</h4>
                      <p className="text-sm">{orden.descripcion}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Creado:</span>
                        <p>{format(new Date(orden.created_at), 'dd/MM/yyyy', { locale: es })}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Actualizado:</span>
                        <p>{format(new Date(orden.updated_at), 'dd/MM/yyyy', { locale: es })}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Estado actual:</span>
                        <span className="font-medium">{orden.estado}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OrdenesCliente;