import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

// Mercado Pago Public Key
const MP_PUBLIC_KEY = 'APP_USR-6a5148ca-9696-4958-8ec6-69681b0b4e91';

export default function Carrito() {
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

  // useEffect para inicializar el Payment Brick cuando el componente esté montado
  useEffect(() => {
    if (paymentFormInitialized && state.items.length > 0) {
      const initializeBrick = async () => {
        try {
          // Verificar que el SDK esté cargado
          if (!(window as any).MercadoPago) {
            throw new Error('Mercado Pago SDK no está cargado');
          }

          console.log('Iniciando llamada a create-payment con items:', state.items);

          // Obtener datos de pago del backend
          const { data, error } = await supabase.functions.invoke('create-payment', {
            body: { items: state.items }
          });

          console.log('Respuesta de create-payment:', { data, error });

          if (error) {
            console.error('Error en create-payment:', error);
            throw error;
          }

          if (!data) {
            throw new Error('No se recibieron datos del servidor');
          }

          // Inicializar Mercado Pago
          const mp = new (window as any).MercadoPago(MP_PUBLIC_KEY, {
            locale: 'es-CO'
          });

          console.log('MercadoPago inicializado con public key:', MP_PUBLIC_KEY);

          // Verificar que el contenedor existe
          const container = document.getElementById('mercadopago-checkout');
          if (!container) {
            throw new Error('Contenedor mercadopago-checkout no encontrado');
          }

          // Limpiar container anterior
          container.innerHTML = '';

          // Crear Card Payment Brick
          const bricks = mp.bricks();
          console.log('Creando cardPayment Brick con amount:', data.amount);
          
          await bricks.create('cardPayment', 'mercadopago-checkout', {
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
                console.log('Card Payment Brick está listo');
              },
              onSubmit: async (cardFormData: any) => {
                console.log('Enviando pago con cardFormData:', cardFormData);
                return await processPayment(cardFormData, data);
              },
              onError: (error: any) => {
                console.error('Error en Card Payment Brick:', error);
                toast({
                  title: 'Error',
                  description: 'Error en el formulario de pago',
                  variant: 'destructive'
                });
              }
            }
          });

          console.log('Card Payment Brick inicializado correctamente');
        } catch (error: any) {
          console.error('Error inicializando formulario de pago:', error);
          toast({
            title: 'Error',
            description: error.message || 'No se pudo cargar el formulario de pago',
            variant: 'destructive'
          });
          // Reset para permitir reintentar
          setPaymentFormInitialized(false);
        }
      };

      // Pequeño delay para asegurar que el DOM esté completamente renderizado
      setTimeout(initializeBrick, 100);
    }
  }, [paymentFormInitialized, state.items]);

  const processPayment = async (cardFormData: any, paymentData: any) => {
    setLoading(true);
    try {
      console.log('Procesando pago con:', { cardFormData, paymentData });

      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          ...cardFormData,
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

  const handleCheckout = () => {
    if (state.items.length === 0) return;
    setPaymentFormInitialized(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <WhatsAppFloat />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/tienda">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Mi Carrito</h1>
          </div>

          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <ShoppingBag className="h-24 w-24 text-muted-foreground mb-8" />
              <h2 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h2>
              <p className="text-muted-foreground mb-8">Explora nuestra tienda y encuentra productos increíbles</p>
              <Link to="/tienda">
                <Button variant="default" size="lg">
                  Ir a la Tienda
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Items del carrito */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold mb-4">Productos en tu carrito</h2>
                {state.items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize mb-2">{item.type}</p>
                          <p className="font-bold text-xl text-primary">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-9 w-9"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-9 w-9"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Resumen y pago */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Resumen del pedido</h3>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatPrice(state.total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Envío:</span>
                        <span>Gratis</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total:</span>
                          <span className="text-2xl font-bold text-primary">{formatPrice(state.total)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {!paymentFormInitialized ? (
                        <Button 
                          onClick={handleCheckout} 
                          disabled={loading || state.items.length === 0}
                          className="w-full"
                          size="lg"
                        >
                          {loading ? 'Cargando...' : 'Proceder al Pago'}
                        </Button>
                      ) : null}
                      
                      <Button 
                        onClick={clearCart} 
                        variant="outline" 
                        className="w-full"
                      >
                        Vaciar Carrito
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Formulario de pago */}
                {paymentFormInitialized && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Información de pago</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Completa los datos de tu tarjeta para finalizar la compra
                      </p>
                      <div 
                        id="mercadopago-checkout" 
                        className="min-h-[400px]"
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}