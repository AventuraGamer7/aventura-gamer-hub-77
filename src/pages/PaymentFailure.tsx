import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, Home, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Pago Fallido</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Hubo un problema al procesar tu pago. No se realizó ningún cargo a tu cuenta.
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

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              Si el problema persiste, contacta a nuestro servicio al cliente.
            </p>
          </div>

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
              onClick={() => navigate('/tienda')} 
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailure;