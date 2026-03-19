import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Gamepad2, 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter,
  Clock,
  Wrench,
  GraduationCap,
  ShoppingCart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { name: 'Reparación de Consolas', path: '/servicios', icon: <Wrench className="h-4 w-4" /> },
    { name: 'Cursos Online', path: '/cursos', icon: <GraduationCap className="h-4 w-4" /> },
    { name: 'Tienda de Repuestos', path: '/tienda', icon: <ShoppingCart className="h-4 w-4" /> },
  ];

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center p-1">
                <img 
                  src="/lovable-uploads/8d12c7f6-549e-4ee6-b31b-3ef2838c9bb8.png" 
                  alt="Aventura Gamer Logo" 
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <span className="text-xl font-bold text-neon">Aventura Gamer</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Farmeando experiencia para tu mejor versión. Tu centro de confianza para reparaciones, cursos y repuestos gaming.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-secondary">Servicios Destacados</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-secondary">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Teléfono</p>
                  <p className="font-medium">350 513 85 57</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Dirección</p>
                  <p className="font-medium">Calle 36 Sur #41-36<br/>Local 116, Envigado</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Horarios</p>
                  <p className="font-medium">Lun - Sáb: 9:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-secondary">¿Necesitas Ayuda?</h3>
            <p className="text-sm text-muted-foreground">
              Contacta directamente con nuestros expertos aventureros
            </p>
            <div className="space-y-2">
              <Button 
                variant="gaming" 
                size="sm" 
                className="w-full"
                onClick={() => window.open('https://wa.me/3505138557', '_blank')}
              >
                <Phone className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button variant="gaming-secondary" size="sm" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Aventura Gamer. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/privacidad" className="hover:text-primary transition-colors">
              Política de Privacidad
            </Link>
            <Link to="/terminos" className="hover:text-primary transition-colors">
              Términos de Servicio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;