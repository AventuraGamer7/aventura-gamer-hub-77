import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { ShoppingCart, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FeaturedProducts = () => {
  const { products, loading } = useProducts();

  // Get first 10 active products
  const featuredProducts = products.filter(p => p.active).slice(0, 10);

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary shadow-glow"></div>
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-background via-primary/10 to-background relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-4 animate-pulse">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Productos Destacados
            </span>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bungee text-glow mb-2">
            ¡OFERTAS ÉPICAS!
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Los mejores artículos gaming al mejor precio
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
          {featuredProducts.map((product, index) => (
            <Link
              key={product.id}
              to={`/producto/${product.id}`}
              className="group relative block"
            >
              <div 
                className="relative bg-card/80 backdrop-blur-sm border-2 border-primary/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-neon hover:-translate-y-2 hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Badge */}
                {product.badge_text && (
                  <Badge 
                    className="absolute top-2 left-2 z-10 bg-secondary text-secondary-foreground text-xs font-bold animate-pulse"
                    style={{ backgroundColor: product.badge_color || undefined }}
                  >
                    {product.badge_text}
                  </Badge>
                )}

                {/* Stock indicator */}
                {product.stock <= 5 && product.stock > 0 && (
                  <Badge className="absolute top-2 right-2 z-10 bg-destructive/80 text-destructive-foreground text-xs">
                    ¡Últimas {product.stock}!
                  </Badge>
                )}

                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="text-xs font-bold text-primary flex items-center gap-1 bg-background/80 px-3 py-1 rounded-full">
                      Ver Producto <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 className="text-xs md:text-sm font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors min-h-[2.5rem]">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base font-bold text-primary">
                      ${product.price.toLocaleString('es-CO')}
                    </span>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>

                {/* Gaming Border Animation */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/50 transition-all duration-300 pointer-events-none">
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 animate-pulse" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link to="/tienda">
            <Button 
              variant="gaming" 
              size="lg" 
              className="px-8 py-4 text-lg font-bold group animate-pulse hover:animate-none"
            >
              <ShoppingCart className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              Explorar Tienda Completa
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
