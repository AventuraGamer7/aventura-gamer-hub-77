import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

// Mercado Pago Public Key
const MP_PUBLIC_KEY = 'APP_USR-6a5148ca-9696-4958-8ec6-69681b0b4e91';

export const CartContents = () => {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentFormInitialized, setPaymentFormInitialized] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const initializePaymentForm = async () => {
    if (paymentFormInitialized || state.items.length === 0) return;

    try {
      // Verificar que el SDK esté cargado
      if (!(window as any).MercadoPago) {
        throw new Error('Mercado Pago SDK no está cargado');
      }

      // Obtener datos de pago del backend
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { items: state.items }
      });

      if (error) throw error;

      // Inicializar Mercado Pago
      const mp = new (window as any).MercadoPago(MP_PUBLIC_KEY, {
        locale: 'es-CO'
      });

      // Limpiar container anterior
      const container = document.getElementById('mercadopago-checkout');
      if (container) {
        container.innerHTML = '';
      }

      // Crear Payment Brick
      const bricks = mp.bricks();
      await bricks.create('payment', 'mercadopago-checkout', {
        initialization: {
          amount: data.amount,
          payer: {
            email: data.payer_email
          }
        },
        customization: {
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all'
          }
        },
        callbacks: {
          onReady: () => {
            console.log('Payment Brick está listo');
          },
          onSubmit: async ({ selectedPaymentMethod, formData }: any) => {
            return await processPayment(formData, selectedPaymentMethod, data);
          },
          onError: (error: any) => {
            console.error('Error en Payment Brick:', error);
            toast({
              title: 'Error',
              description: 'Error en el formulario de pago',
              variant: 'destructive'
            });
          }
        }
      });

      setPaymentFormInitialized(true);
    } catch (error: any) {
      console.error('Error inicializando formulario de pago:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el formulario de pago',
        variant: 'destructive'
      });
    }
  };

  const processPayment = async (formData: any, selectedPaymentMethod: any, paymentData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          ...formData,
          payment_method_id: selectedPaymentMethod,
          transaction_amount: paymentData.amount,
          description: paymentData.description,
          external_reference: paymentData.external_reference,
          items: state.items
        }
      });

      if (error) throw error;

      if (data.status === 'approved') {
        clearCart();
        toast({
          title: 'Pago exitoso',
          description: 'Tu pago ha sido procesado correctamente.'
        });
        // Redirigir a página de éxito
        window.location.href = `/payment/success?payment_id=${data.id}&status=${data.status}`;
      } else if (data.status === 'pending') {
        toast({
          title: 'Pago pendiente',
          description: 'Tu pago está siendo procesado. Te notificaremos cuando esté listo.'
        });
      } else {
        throw new Error(data.status_detail || 'Pago rechazado');
      }

      return { status: 'success' };
    } catch (error: any) {
      console.error('Error procesando pago:', error);
      toast({
        title: 'Error en el pago',
        description: error.message || 'No se pudo procesar el pago',
        variant: 'destructive'
      });
      return { status: 'error', message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (state.items.length === 0) return;
    await initializePaymentForm();
  };

  if (state.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-8">
        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Tu carrito está vacío</h3>
        <p className="text-muted-foreground">Agrega productos, servicios o cursos para continuar</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 py-4">
        {state.items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
                  <p className="font-semibold text-primary">{formatPrice(item.price)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="border-t pt-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-xl font-bold text-primary">{formatPrice(state.total)}</span>
        </div>
        
        <div className="space-y-2">
          {!paymentFormInitialized ? (
            <Button 
              onClick={handleCheckout} 
              disabled={loading || state.items.length === 0}
              className="w-full"
            >
              {loading ? 'Cargando...' : 'Proceder al Pago'}
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Completa los datos de tu tarjeta para finalizar la compra
              </p>
              <div 
                id="mercadopago-checkout" 
                className="min-h-[300px] p-4 border rounded-lg"
              />
            </div>
          )}
          <Button 
            onClick={clearCart} 
            variant="outline" 
            className="w-full"
          >
            Vaciar Carrito
          </Button>
        </div>
      </div>
    </div>
  );
};