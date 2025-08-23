import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, MapPin, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { CartIcon } from './CartIcon';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { profile } = useProfile();

  const getNavItems = () => {
    const baseItems = [
      { name: 'Inicio', path: '/' },
    ];
    
    if (user) {
      baseItems.push({ 
        name: profile?.username || user.email?.split('@')[0] || 'Usuario', 
        path: '/dashboard' 
      });
    } else {
      baseItems.push({ name: 'Iniciar Sesión', path: '/dashboard' });
    }
    
    baseItems.push(
      { name: 'Servicios Técnicos', path: '/servicios' },
      { name: 'Cursos', path: '/cursos' },
      { name: 'Tienda', path: '/tienda' },
      { name: 'Blog', path: '/blog' },
      { name: 'Contacto', path: '/contacto' },
    );
    
    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-neon">Aventura Gamer</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>350 513 85 57</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>Envigado</span>
            </div>
            <CartIcon />
            <Button 
              variant="gaming" 
              size="sm"
              onClick={() => window.open('https://wa.me/573505138557?text=¡Hola! Soy un aventurero y quiero más información sobre un servicio.', '_blank')}
            >
              WhatsApp
            </Button>
          </div>

          {/* Mobile Cart & Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <CartIcon />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border">
            <nav className="flex flex-col p-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                <div className="flex flex-col gap-2 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>350 513 85 57</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>Calle 36 Sur #41-36 Local 116, Envigado</span>
                  </div>
                </div>
                <Button 
                  variant="gaming" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    window.open('https://wa.me/573505138557?text=¡Hola! Soy un aventurero y quiero más información sobre un servicio.', '_blank');
                    setIsMenuOpen(false);
                  }}
                >
                  Contactar por WhatsApp
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
