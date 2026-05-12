import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '@/hooks/useServices';
import { Wrench, ChevronRight } from 'lucide-react';
import GamingSectionTitle from '@/components/GamingSectionTitle';
import OptimizedImage from '@/components/OptimizedImage';
import { Button } from '@/components/ui/button';

const FeaturedServices = () => {
  const { services, loading } = useServices();
  const navigate = useNavigate();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  if (loading) {
    return (
      <section className="py-6 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) return null;

  return (
    <section className="py-6 bg-muted/20">
      <div className="container mx-auto px-4">
        <GamingSectionTitle title="Servicio Técnico" subtitle="Reparación especializada de consolas" />
        <div className="flex justify-end mb-4 -mt-2">
          <button onClick={() => navigate('/servicios')} className="text-sm text-primary hover:underline flex items-center gap-1">
            Ver todos <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {services.slice(0, 10).map((service) => (
            <div
              key={service.id}
              onClick={() => navigate(`/servicio/${service.id}`)}
              className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-square bg-muted/10 overflow-hidden">
                {service.image ? (
                  <OptimizedImage
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    width={400}
                    height={400}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-accent/5">
                    <Wrench className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              <div className="p-3 flex flex-col flex-1">
                <h3 className="text-xs md:text-sm font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors leading-snug">
                  {service.name}
                </h3>
                {service.description && (
                  <p className="text-[11px] text-muted-foreground hidden sm:block overflow-hidden max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 group-hover:mb-2 line-clamp-3 transition-all duration-300 ease-out">
                    {service.description}
                  </p>
                )}
                <div className="mt-auto">
                  <span className="text-base md:text-lg font-bold text-foreground block">
                    {service.price ? formatPrice(service.price) : 'Precio según diagnóstico'}
                  </span>
                  <span className="text-[11px] text-primary font-medium">Garantía incluida</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
