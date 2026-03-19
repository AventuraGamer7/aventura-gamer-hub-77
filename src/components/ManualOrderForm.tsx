import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star, Gift, Loader2 } from 'lucide-react';
import { useManualOrders } from '@/hooks/useManualOrders';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ManualOrderForm = () => {
  const { orders, loading, createOrder } = useManualOrders();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    description: '',
    total_value: '',
    payment_method: 'transferencia',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.total_value) return;
    setSubmitting(true);
    const result = await createOrder({
      description: form.description,
      total_value: Number(form.total_value),
      payment_method: form.payment_method,
    });
    setSubmitting(false);
    if (!result.error) {
      setForm({ description: '', total_value: '', payment_method: 'transferencia' });
      setOpen(false);
    }
  };

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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="space-y-6">
      {/* CTA Button */}
      <Card className="card-gaming border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6 text-center space-y-3">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="text-base gap-2">
                <Star className="h-5 w-5" />
                Registrar compra y ganar puntos
                <Gift className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Registrar Compra Manual
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Producto o descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Ej: Control PS5 DualSense blanco"
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    required
                    maxLength={500}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_value">Valor total (COP)</Label>
                  <Input
                    id="total_value"
                    type="number"
                    min="1000"
                    step="100"
                    placeholder="150000"
                    value={form.total_value}
                    onChange={(e) => setForm(f => ({ ...f, total_value: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Método de pago</Label>
                  <Select value={form.payment_method} onValueChange={(v) => setForm(f => ({ ...f, payment_method: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="contra_entrega">Contra entrega</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Star className="h-4 w-4 mr-2" />}
                  Enviar orden
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <p className="text-sm text-muted-foreground">
            ¿Compraste por transferencia o contra entrega? Regístrala y gana puntos.
          </p>
        </CardContent>
      </Card>

      {/* Order History */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Mis Compras Registradas</h3>
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <Card className="card-gaming border-border/50">
            <CardContent className="p-8 text-center text-muted-foreground">
              Aún no has registrado compras manuales.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id} className="card-gaming border-border/50">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{order.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.created_at), "dd MMM yyyy, HH:mm", { locale: es })} • {order.payment_method === 'contra_entrega' ? 'Contra entrega' : order.payment_method === 'transferencia' ? 'Transferencia' : 'Otro'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm">{formatPrice(order.total_value)}</span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualOrderForm;
