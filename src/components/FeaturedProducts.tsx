import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { ShoppingCart, Sparkles, ArrowRight, Zap, Flame } from 'lucide-react';
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
      <div className="absolute top-0 left-1/4 w-48 md:w-72 h-48 md:h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-48 md:w-72 h-48 md:h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-bounce hidden md:block"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + i * 0.5}s`
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-4">
            <Flame className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Productos Destacados
            </span>
            <Flame className="h-4 w-4 text-primary animate-pulse" />
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
              className="group relative block animate-fade-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="relative bg-card/90 backdrop-blur-sm border-2 border-primary/20 rounded-xl overflow-hidden transition-all duration-500 ease-out group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] group-hover:-translate-y-3 md:group-hover:-translate-y-4 group-hover:scale-[1.02] md:group-hover:scale-105">
                
                {/* Animated corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/0 group-hover:border-primary transition-all duration-300 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/0 group-hover:border-primary transition-all duration-300 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/0 group-hover:border-primary transition-all duration-300 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/0 group-hover:border-primary transition-all duration-300 rounded-br-xl" />

                {/* Badge */}
                {product.badge_text && (
                  <Badge 
                    className="absolute top-2 left-2 z-10 bg-secondary text-secondary-foreground text-xs font-bold shadow-lg"
                    style={{ backgroundColor: product.badge_color || undefined }}
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    {product.badge_text}
                  </Badge>
                )}

                {/* Stock indicator */}
                {product.stock <= 5 && product.stock > 0 && (
                  <Badge className="absolute top-2 right-2 z-10 bg-destructive/90 text-destructive-foreground text-xs animate-pulse">
                    ¡Últimas {product.stock}!
                  </Badge>
                )}

                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="h-12 w-12 text-primary/40 group-hover:text-primary/60 transition-colors duration-300" />
                    </div>
                  )}
                  
                  {/* Glowing overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Hover action button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-4">
                    <span className="text-xs font-bold text-primary-foreground flex items-center gap-1 bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transform transition-transform duration-300 group-hover:scale-100 scale-90">
                      <ShoppingCart className="h-3 w-3" />
                      Ver Ahora
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                    <div className="absolute -inset-full w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:animate-[shimmer_1.5s_ease-in-out]" />
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 relative">
                  {/* Subtle gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <h3 className="relative text-xs md:text-sm font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors duration-300 min-h-[2.5rem]">
                    {product.name}
                  </h3>
                  <div className="relative flex items-center justify-between">
                    <span className="text-sm md:text-base font-bold text-primary group-hover:scale-110 transition-transform duration-300 origin-left">
                      ${product.price.toLocaleString('es-CO')}
                    </span>
                    <div className="relative">
                      <ShoppingCart className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                      <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />
                    </div>
                  </div>
                </div>

                {/* Pulsing border effect */}
                <div className="absolute inset-0 rounded-xl border-2 border-primary/0 group-hover:border-primary/50 transition-all duration-300 pointer-events-none group-hover:animate-pulse" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '500ms' }}>
          <Link to="/tienda">
            <Button 
              variant="gaming" 
              size="lg" 
              className="px-8 py-4 text-lg font-bold group relative overflow-hidden"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <ShoppingCart className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative">Explorar Tienda Completa</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
