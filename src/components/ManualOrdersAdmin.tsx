import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useManualOrders } from '@/hooks/useManualOrders';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ManualOrdersAdmin = () => {
  const { orders, loading, updateStatus } = useManualOrders(true);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">Pendiente</Badge>;
      case 'pagada':
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Pagada ✓</Badge>;
      case 'rechazada':
        return <Badge className="bg-red-500/20 text-red-600 border-red-500/30">Rechazada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="card-gaming border-border/50">
        <CardContent className="p-8 text-center text-muted-foreground">
          No hay órdenes manuales registradas.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const username = (order as any).profiles?.username || 'Usuario';
        return (
          <Card key={order.id} className="card-gaming border-border/50">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-primary">{username}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm">{order.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(order.created_at), "dd MMM yyyy, HH:mm", { locale: es })} • {order.payment_method === 'contra_entrega' ? 'Contra entrega' : order.payment_method === 'transferencia' ? 'Transferencia' : 'Otro'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm whitespace-nowrap">{formatPrice(order.total_value)}</span>
                  <Select
                    value={order.status}
                    onValueChange={(v) => updateStatus(order.id, v)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="pagada">Pagada</SelectItem>
                      <SelectItem value="rechazada">Rechazada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ManualOrdersAdmin;
