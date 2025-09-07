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
import { Separator } from '@/components/ui/separator';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { user, signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo conectar con Google. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setGoogleLoading(false);
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
              <div className="relative">
                <Separator className="my-4" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-background px-3 text-xs text-muted-foreground">
                    O continúa con
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-border/50 hover:bg-background/80"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continuar con Google
                  </>
                )}
              </Button>
            </>
          )}

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