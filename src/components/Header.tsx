import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, MapPin } from 'lucide-react';
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
            <img 
              src="/lovable-uploads/9cbb1996-c02c-4b63-b7bd-45e2ca06d3eb.png" 
              alt="Aventura Gamer Logo" 
              className="h-10 w-auto rounded-lg"
            />
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
              onClick={() => window.open('https://wa.me/3505138557', '_blank')}
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
              className="relative bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/30 hover:from-primary/30 hover:to-secondary/30 hover:border-primary/50 animate-pulse-neon"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-md animate-pulse"></div>
              {isMenuOpen ? <X className="h-5 w-5 relative z-10 text-primary" /> : <Menu className="h-5 w-5 relative z-10 text-primary" />}
            </Button>
          </div>
        </div>

        {/* Mobile Quick Access Links */}
        <div className="md:hidden bg-gradient-to-r from-primary/10 to-secondary/10 border-y border-primary/20">
          <nav className="flex justify-center items-center py-3 px-4">
            <div className="flex gap-6">
              <Link
                to="/tienda"
                className="text-sm font-bold text-primary hover:text-neon transition-all duration-1000 animate-pulse hover:scale-105"
              >
                Tienda
              </Link>
              <Link
                to="/cursos"
                className="text-sm font-bold text-primary hover:text-neon transition-all duration-1000 animate-pulse hover:scale-105"
              >
                Cursos
              </Link>
              <Link
                to="/servicios"
                className="text-sm font-bold text-primary hover:text-neon transition-all duration-1000 animate-pulse hover:scale-105"
              >
                Servicios
              </Link>
            </div>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-24 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border">
            <nav className="flex flex-col p-4 space-y-4">
              {navItems.filter(item => !['Tienda', 'Cursos', 'Servicios Técnicos'].includes(item.name)).map((item) => (
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
                    window.open('https://wa.me/3505138557', '_blank');
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
