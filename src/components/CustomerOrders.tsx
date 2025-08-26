import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  Home,
  CircleX,
  Loader2
} from 'lucide-react';

interface Order {
  id: string;
  user_id: string;
  item_id: string;
  item_type: string; // Changed from union type to string to match database
  quantity: number;
  total_price: number;
  created_at: string;
  shipping_status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';
  shipping_address?: string;
  tracking_number?: string;
  estimated_delivery?: string;
  shipped_at?: string;
  delivered_at?: string;
}

interface CustomerOrdersProps {
  orders: Order[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'processing':
      return <Loader2 className="h-4 w-4 animate-spin" />;
    case 'shipped':
      return <Package className="h-4 w-4" />;
    case 'in_transit':
      return <Truck className="h-4 w-4" />;
    case 'out_for_delivery':
      return <Truck className="h-4 w-4 animate-pulse" />;
    case 'delivered':
      return <CheckCircle className="h-4 w-4" />;
    case 'cancelled':
      return <CircleX className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
    case 'processing':
      return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
    case 'shipped':
      return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
    case 'in_transit':
      return 'bg-indigo-500/20 text-indigo-600 border-indigo-500/30';
    case 'out_for_delivery':
      return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
    case 'delivered':
      return 'bg-green-500/20 text-green-600 border-green-500/30';
    case 'cancelled':
      return 'bg-red-500/20 text-red-600 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'processing':
      return 'Procesando';
    case 'shipped':
      return 'Enviado';
    case 'in_transit':
      return 'En tránsito';
    case 'out_for_delivery':
      return 'En reparto';
    case 'delivered':
      return 'Entregado';
    case 'cancelled':
      return 'Cancelado';
    default:
      return 'Desconocido';
  }
};

const ShippingTracker: React.FC<{ order: Order }> = ({ order }) => {
  const steps = [
    { key: 'pending', label: 'Pedido recibido', completed: true },
    { key: 'processing', label: 'Procesando', completed: ['processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'].includes(order.shipping_status) },
    { key: 'shipped', label: 'Enviado', completed: ['shipped', 'in_transit', 'out_for_delivery', 'delivered'].includes(order.shipping_status) },
    { key: 'in_transit', label: 'En tránsito', completed: ['in_transit', 'out_for_delivery', 'delivered'].includes(order.shipping_status) },
    { key: 'out_for_delivery', label: 'En reparto', completed: ['out_for_delivery', 'delivered'].includes(order.shipping_status) },
    { key: 'delivered', label: 'Entregado', completed: order.shipping_status === 'delivered' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === order.shipping_status);

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold mb-3 text-secondary">Seguimiento del envío</h4>
      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border"></div>
        <div 
          className="absolute left-4 top-4 w-0.5 bg-primary transition-all duration-1000 ease-out"
          style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isActive = step.key === order.shipping_status;
            const isCompleted = step.completed;
            
            return (
              <div key={step.key} className="flex items-center relative">
                <div 
                  className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'bg-background border-muted-foreground'
                    }
                    ${isActive ? 'animate-pulse scale-110' : ''}
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                  )}
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </p>
                  {isActive && order.tracking_number && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Código de seguimiento: {order.tracking_number}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const CustomerOrders: React.FC<CustomerOrdersProps> = ({ orders }) => {
  const activeOrders = orders.filter(order => 
    !['delivered', 'cancelled'].includes(order.shipping_status)
  );
  
  const completedOrders = orders.filter(order => 
    ['delivered', 'cancelled'].includes(order.shipping_status)
  );

  return (
    <div className="space-y-6">
      {/* Envíos en curso */}
      {activeOrders.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-neon flex items-center gap-2">
            <Truck className="h-5 w-5 animate-bounce" />
            Envíos en curso
          </h3>
          <div className="grid gap-4">
            {activeOrders.map((order) => (
              <Card key={order.id} className="card-gaming border-primary/20 animate-fade-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Pedido #{order.id.slice(0, 8)}
                    </CardTitle>
                    <Badge className={getStatusColor(order.shipping_status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.shipping_status)}
                        {getStatusText(order.shipping_status)}
                      </div>
                    </Badge>
                  </div>
                  <CardDescription>
                    Realizado el {format(new Date(order.created_at), 'dd MMMM yyyy', { locale: es })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Detalles del pedido</p>
                      <p className="font-medium">Cantidad: {order.quantity}</p>
                      <p className="font-medium">Total: ${order.total_price}</p>
                      {order.shipping_address && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Dirección: {order.shipping_address}
                        </p>
                      )}
                      {order.estimated_delivery && (
                        <p className="text-sm text-muted-foreground">
                          Entrega estimada: {format(new Date(order.estimated_delivery), 'dd MMMM yyyy', { locale: es })}
                        </p>
                      )}
                    </div>
                    <div>
                      <ShippingTracker order={order} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Historial completo */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-secondary flex items-center gap-2">
          <Package className="h-5 w-5" />
          Historial de pedidos
        </h3>
        {completedOrders.length > 0 ? (
          <div className="grid gap-4">
            {completedOrders.map((order) => (
              <Card key={order.id} className="card-gaming border-secondary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Pedido #{order.id.slice(0, 8)}
                    </CardTitle>
                    <Badge className={getStatusColor(order.shipping_status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.shipping_status)}
                        {getStatusText(order.shipping_status)}
                      </div>
                    </Badge>
                  </div>
                  <CardDescription>
                    Realizado el {format(new Date(order.created_at), 'dd MMMM yyyy', { locale: es })}
                    {order.delivered_at && (
                      <span className="ml-2">
                        • Entregado el {format(new Date(order.delivered_at), 'dd MMMM yyyy', { locale: es })}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Cantidad: {order.quantity}</p>
                      <p className="font-medium">Total: ${order.total_price}</p>
                    </div>
                    {order.tracking_number && (
                      <p className="text-xs text-muted-foreground">
                        Código: {order.tracking_number}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-gaming border-muted/20">
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No tienes pedidos completados aún</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};