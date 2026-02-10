import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { ShoppingCart, ChevronRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

const FeaturedStore = () => {
  const { products, loading } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();

  const activeProducts = products.filter(p => p.active).slice(0, 10);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  if (loading) {
    return (
      <section className="py-6 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
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

  if (activeProducts.length === 0) return null;

  return (
    <section className="py-6 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            🎮 Más Productos Gaming
          </h2>
          <Link to="/tienda" className="text-sm text-primary hover:underline flex items-center gap-1">
            Ver tienda completa <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {activeProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-200 flex flex-col"
            >
              <Link to={`/producto/${product.id}`} className="block">
                <div className="relative aspect-square bg-muted/10 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                  )}
                  {product.badge_text && (
                    <Badge
                      className="absolute top-2 left-2 text-xs font-semibold"
                      style={{ backgroundColor: product.badge_color || undefined }}
                    >
                      {product.badge_text}
                    </Badge>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                      <Badge variant="destructive">Agotado</Badge>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-3 flex flex-col flex-1">
                <Link to={`/producto/${product.id}`} className="block flex-1">
                  <h3 className="text-xs md:text-sm font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors leading-snug">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mb-2 hidden sm:block">
                      {product.description}
                    </p>
                  )}
                </Link>
                <div className="mt-auto space-y-2">
                  <span className="text-base md:text-lg font-bold text-foreground block">
                    {formatPrice(product.price)}
                  </span>
                  {product.stock > 0 && (
                    <span className="text-[11px] text-primary font-medium">En stock</span>
                  )}
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full text-xs h-8"
                    disabled={product.stock === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem({ id: product.id, name: product.name, price: product.price, image: product.image || undefined, type: 'product' });
                      toast({ title: 'Agregado al carrito', description: product.name });
                    }}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    {product.stock > 0 ? 'Agregar' : 'Agotado'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStore;
