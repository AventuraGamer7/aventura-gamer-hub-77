import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useGamificationContext } from '@/components/GamificationProvider';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import PowerUpAnimation from '@/components/PowerUpAnimation';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const { toast } = useToast();
  const { profile } = useGamificationContext();
  const { user } = useAuth();
  const [showAnimation, setShowAnimation] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);

  useEffect(() => {
    const checkPointsEarned = async () => {
      if (!user) return;

      try {
        // Get the most recent order for this user
        const { data: recentOrder, error } = await supabase
          .from('orders')
          .select('total_price, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error || !recentOrder) return;

        // Calculate points earned (1 point per $1000 COP)
        const points = Math.floor(recentOrder.total_price / 1000);
        setPointsEarned(points);

        // Check if user leveled up
        if (profile) {
          const oldPoints = profile.points - points;
          const oldLevel = Math.floor(oldPoints / 100) + 1;
          const newLevelCalc = Math.floor(profile.points / 100) + 1;
          
          if (newLevelCalc > oldLevel) {
            setLeveledUp(true);
            setNewLevel(newLevelCalc);
          }
        }

        // Show animation after a short delay
        setTimeout(() => {
          setShowAnimation(true);
        }, 500);
      } catch (error) {
        console.error('Error checking points:', error);
      }
    };

    // Limpiar el carrito cuando el pago sea exitoso
    clearCart();
    
    toast({
      title: '¡Pago exitoso!',
      description: 'Tu compra se ha procesado correctamente.',
    });

    checkPointsEarned();
  }, [clearCart, toast, user, profile]);

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Show power-up animation */}
      {showAnimation && pointsEarned > 0 && !leveledUp && (
        <PowerUpAnimation
          type="points"
          value={pointsEarned}
          onComplete={() => {
            setShowAnimation(false);
          }}
        />
      )}
      
      {showAnimation && leveledUp && (
        <PowerUpAnimation
          type="levelUp"
          value={newLevel}
          onComplete={() => {
            setShowAnimation(false);
          }}
        />
      )}

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

          {pointsEarned > 0 && (
            <div className="bg-gradient-to-r from-led-cyan/20 to-led-violet/20 border border-primary/30 p-4 rounded-lg">
              <p className="text-lg font-semibold text-primary mb-1">
                🎮 ¡Ganaste {pointsEarned} XP!
              </p>
              <p className="text-sm text-muted-foreground">
                Sigue comprando para subir de nivel
              </p>
            </div>
          )}
          
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