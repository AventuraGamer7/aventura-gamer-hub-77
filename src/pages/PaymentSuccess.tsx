import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    // Limpiar el carrito cuando el pago sea exitoso
    clearCart();
    
    toast({
      title: '¡Pago exitoso!',
      description: 'Tu compra se ha procesado correctamente.',
    });
  }, [clearCart, toast]);

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">¡Pago Exitoso!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Tu pago se ha procesado correctamente. Recibirás un email de confirmación pronto.
          </p>
          
          {paymentId && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm">
                <strong>ID de Pago:</strong> {paymentId}
              </p>
              {status && (
                <p className="text-sm">
                  <strong>Estado:</strong> {status}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Inicio
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="flex-1"
            >
              <Receipt className="w-4 h-4 mr-2" />
              Mis Compras
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;