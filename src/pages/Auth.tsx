import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, LogIn, Loader2 } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isForgotPassword) {
        result = await resetPassword(email);
        if (result.error) {
          toast({
            title: "Error",
            description: result.error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "¡Email enviado!",
            description: "Revisa tu correo para restablecer tu contraseña.",
          });
          setIsForgotPassword(false);
          setEmail('');
        }
      } else if (isLogin) {
        result = await signIn(email, password);
        if (result.error) {
          toast({
            title: "Error",
            description: result.error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "¡Bienvenido Aventurero!",
            description: "Has iniciado sesión exitosamente.",
          });
        }
      } else {
        result = await signUp(email, password);
        if (result.error) {
          toast({
            title: "Error",
            description: result.error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "¡Cuenta creada!",
            description: "Revisa tu email para confirmar tu cuenta.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Algo salió mal. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      
      <Card className="w-full max-w-md card-gaming border-primary/20 relative">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-2">
            <img 
              src="/lovable-uploads/8d12c7f6-549e-4ee6-b31b-3ef2838c9bb8.png" 
              alt="Aventura Gamer Logo" 
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          
          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
            🎮 Aventura Gamer
          </Badge>
          
          <CardTitle className="text-2xl font-bold text-glow">
            {isForgotPassword 
              ? 'Recuperar Contraseña' 
              : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
            }
          </CardTitle>
          
          <CardDescription>
            {isForgotPassword
              ? 'Te enviaremos un enlace para restablecer tu contraseña'
              : isLogin 
                ? 'Continúa tu aventura gaming' 
                : 'Únete a la comunidad de aventureros'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="aventurero@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50 border-border/50 focus:border-primary"
              />
            </div>

            {!isForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
                {!isLogin && (
                  <p className="text-xs text-muted-foreground">
                    Mínimo 6 caracteres
                  </p>
                )}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full btn-gaming" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  {isForgotPassword 
                    ? 'Enviar Enlace de Recuperación'
                    : isLogin ? <><LogIn className="mr-2 h-4 w-4" />Iniciar Sesión</> : <><UserPlus className="mr-2 h-4 w-4" />Crear Cuenta</>
                  }
                </>
              )}
            </Button>
          </form>

          {!isForgotPassword && (
            <>
              {isLogin && (
                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
              )}
              
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:bg-primary/10"
                >
                  {isLogin 
                    ? '¿No tienes cuenta? Crear una' 
                    : '¿Ya tienes cuenta? Iniciar sesión'
                  }
                </Button>
              </div>
            </>
          )}

          {isForgotPassword && (
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsForgotPassword(false);
                  setEmail('');
                }}
                className="text-primary hover:bg-primary/10"
              >
                Volver al inicio de sesión
              </Button>
            </div>
          )}

          <div className="text-center pt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="text-muted-foreground border-border/50"
            >
              Volver al Inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;