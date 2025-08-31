import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from URL if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);
    
    const breadcrumbs: BreadcrumbItem[] = [
      { title: 'Inicio', href: '/' }
    ];
    
    const routeMap: Record<string, string> = {
      'servicios': 'Servicios',
      'tienda': 'Tienda',
      'cursos': 'Cursos',
      'contacto': 'Contacto',
      'blog': 'Blog',
      'dashboard': 'Dashboard',
      'carrito': 'Carrito',
      'reparacion-playstation': 'Reparación PlayStation',
      'reparacion-xbox': 'Reparación Xbox',
      'reparacion-nintendo': 'Reparación Nintendo',
      'cursos-gaming': 'Cursos Gaming',
      'repuestos': 'Repuestos',
      'envigado': 'Envigado'
    };
    
    pathnames.forEach((pathname, index) => {
      const href = `/${pathnames.slice(0, index + 1).join('/')}`;
      const title = routeMap[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
      
      breadcrumbs.push({
        title,
        href: index === pathnames.length - 1 ? undefined : href
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = items || generateBreadcrumbs();
  
  if (breadcrumbItems.length <= 1) return null;
  
  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.title,
      "item": item.href ? `${window.location.origin}${item.href}` : undefined
    }))
  };

  return (
    <>
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Breadcrumb Component */}
      <nav className={`py-4 ${className}`} aria-label="Navegación de migas de pan">
        <Breadcrumb>
          <BreadcrumbList className="flex items-center space-x-2 text-sm text-muted-foreground">
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link 
                        to={item.href} 
                        className="flex items-center hover:text-primary transition-colors"
                      >
                        {index === 0 && <Home className="w-4 h-4 mr-1" />}
                        {item.title}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-foreground font-medium">
                      {item.title}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
    </>
  );
};

export default Breadcrumbs;