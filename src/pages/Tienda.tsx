import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import Header from '@/components/Header';
import OptimizedImage from '@/components/OptimizedImage';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Search, Package, Truck, CreditCard, Crown, ChevronRight, Star, SlidersHorizontal } from 'lucide-react';

const Tienda = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { categoria, plataforma } = useParams();

  const navigate = useNavigate();

  const { products, loading, error } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  
  const dynamicPlatforms = Array.from(new Set(
    products
      .filter(p => p.active)
      .flatMap(p => p.platform || [])
  )).filter(Boolean).sort((a, b) => a.localeCompare(b));

  // Sync platform from URL param
  useEffect(() => {
    if (plataforma) {
      setSelectedPlatform(plataforma.toLowerCase());
    } else {
      // Only reset if no platform in URL
    }
  }, [plataforma]);

  useEffect(() => {
    if (categoria && categoria !== categoria.toLowerCase()) {
      const basePath = plataforma ? `/tienda/${categoria.toLowerCase()}/${plataforma}` : `/tienda/${categoria.toLowerCase()}`;
      navigate(basePath, { replace: true });
    }
  }, [categoria, plataforma, navigate]);

  const normalizedCategory = categoria?.toLowerCase();
  const selectedCategory = normalizedCategory && categories.map(c => c.toLowerCase()).includes(normalizedCategory)
    ? categories.find(c => c.toLowerCase() === normalizedCategory) || 'Todos'
    : 'Todos';

  const seoTitle = selectedCategory !== 'Todos'
    ? selectedPlatform !== 'all'
      ? `${selectedCategory} ${selectedPlatform.toUpperCase()} - Tienda | Aventura Gamer`
      : `${selectedCategory} - Tienda Gamer | Aventura Gamer`
    : selectedPlatform !== 'all'
      ? `Productos ${selectedPlatform.toUpperCase()} - Tienda | Aventura Gamer`
      : 'Tienda Gamer - Gaming Store | Aventura Gamer';

  const seoDescription = selectedCategory !== 'Todos'
    ? `Compra ${selectedCategory}${selectedPlatform !== 'all' ? ` para ${selectedPlatform.toUpperCase()}` : ''} en Aventura Gamer. Envío a toda Colombia.`
    : 'Descubre nuestra amplia selección de productos gaming. Envío a toda Colombia.';

  const buildTiendaUrl = (cat: string, plat: string) => {
    const parts = ['/tienda'];
    if (cat !== 'Todos') parts.push(cat.toLowerCase());
    if (plat !== 'all') parts.push(plat.toLowerCase());
    return parts.join('/');
  };

  const canonicalUrl = `https://aventuragamer.com${buildTiendaUrl(selectedCategory, selectedPlatform)}`;

  const handleCategoryChange = (category: string) => {
    const newPlat = 'all';
    setSelectedPlatform(newPlat);
    navigate(buildTiendaUrl(category, newPlat));
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    navigate(buildTiendaUrl(selectedCategory, platform));
  };

  let filteredProducts = (selectedCategory === 'Todos' ? products : products.filter(p => p.category === selectedCategory))
    .filter(p => p.active);

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (priceRange !== 'all') {
    const [min, max] = priceRange.split('-').map(Number);
    filteredProducts = filteredProducts.filter(p => max ? (p.price >= min && p.price <= max) : p.price >= min);
  }

  if (selectedPlatform !== 'all') {
    filteredProducts = filteredProducts.filter(p => 
      p.platform && Array.isArray(p.platform) && 
      p.platform.some(plat => plat.toLowerCase() === selectedPlatform.toLowerCase())
    );
  }

  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'name': return a.name.localeCompare(b.name);
      case 'stock': return b.stock - a.stock;
      default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const PRODUCTS_PER_PAGE = 24;
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory, sortBy, priceRange, selectedPlatform]);

  const formatPrice = (price: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <Header />
      <WhatsAppFloat />

      {/* Top bar with breadcrumb + results count */}
      <div className="pt-20 border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Tienda</span>
            {selectedCategory !== 'Todos' && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">{selectedCategory}</span>
              </>
            )}
          </div>
          <span>{totalProducts} resultados</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        {/* Mobile-first filters */}
        <div className="space-y-3 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-card border-border"
            />
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Platform chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => handlePlatformChange('all')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedPlatform === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Todas
            </button>
            {dynamicPlatforms.map(plat => (
              <button
                key={plat}
                onClick={() => handlePlatformChange(plat.toLowerCase())}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedPlatform === plat.toLowerCase()
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {plat}
              </button>
            ))}
          </div>

          {/* Sort + count row */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{totalProducts} resultados</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] h-8 text-xs bg-card">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más recientes</SelectItem>
                <SelectItem value="price-low">Precio: menor</SelectItem>
                <SelectItem value="price-high">Precio: mayor</SelectItem>
                <SelectItem value="name">Nombre A-Z</SelectItem>
                <SelectItem value="stock">Disponibilidad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <main className="min-w-0">

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-lg border border-border overflow-hidden">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-3 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Error al cargar productos: {error}</p>
              </div>
            ) : totalProducts === 0 ? (
              <div className="text-center py-20 space-y-3">
                <Package className="h-16 w-16 mx-auto text-muted-foreground/40" />
                <p className="text-muted-foreground text-lg">No se encontraron productos</p>
                <p className="text-sm text-muted-foreground">Intenta ajustar los filtros o buscar otro término</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentProducts.map(product => (
                  <div
                    key={product.id}
                    className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200 cursor-pointer flex flex-col"
                    onClick={() => navigate(`/producto/${product.slug || product.id}`)}
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-muted/20 overflow-hidden">
                      {(product.images?.[0] || product.image) ? (
                        <OptimizedImage
                          src={product.images?.[0] || product.image || ''}
                          alt={product.name}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          width={400}
                          height={400}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}

                      {/* Badges */}
                      {product.badge_text && (
                        <Badge
                          className="absolute top-2 left-2 text-xs font-semibold shadow-sm"
                          style={{ backgroundColor: product.badge_color || undefined }}
                        >
                          {product.badge_text}
                        </Badge>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                          <Badge variant="destructive" className="text-sm">Agotado</Badge>
                        </div>
                      )}
                      {product.stock > 0 && product.stock <= 5 && (
                        <Badge className="absolute top-2 right-2 text-[10px] bg-destructive/90 text-destructive-foreground">
                          Quedan {product.stock}
                        </Badge>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 flex flex-col flex-1">
                      {product.category && (
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                          {product.category}
                        </span>
                      )}
                      <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors leading-snug">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2 hidden sm:block">
                          {product.description}
                        </p>
                      )}

                      <div className="mt-auto space-y-2">
                        <span className="text-lg font-bold text-foreground block">
                          {formatPrice(product.price)}
                        </span>

                        {product.stock > 0 && (
                          <span className="text-xs text-primary font-medium">En stock</span>
                        )}

                        <Button
                          variant="default"
                          size="sm"
                          className="w-full text-xs"
                          disabled={product.stock === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            addItem({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.images?.[0] || product.image || undefined,
                              type: 'product'
                            });
                            toast({
                              title: 'Agregado al carrito',
                              description: product.name
                            });
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
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => { e.preventDefault(); setCurrentPage(currentPage - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        />
                      </PaginationItem>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                      .map((page, idx, arr) => (
                        <React.Fragment key={page}>
                          {idx > 0 && arr[idx - 1] !== page - 1 && (
                            <PaginationItem><span className="px-2 text-muted-foreground">...</span></PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === page}
                              onClick={(e) => { e.preventDefault(); setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        </React.Fragment>
                      ))}
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => { e.preventDefault(); setCurrentPage(currentPage + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Trust bar */}
      <section className="border-t border-border bg-muted/20 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-foreground">Envío a toda Colombia</span>
              <span className="text-xs text-muted-foreground">24-48h en Medellín</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-foreground">Garantía incluida</span>
              <span className="text-xs text-muted-foreground">Devoluciones fáciles</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-foreground">Pago seguro</span>
              <span className="text-xs text-muted-foreground">Múltiples métodos</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tienda;
