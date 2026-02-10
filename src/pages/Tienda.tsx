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
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { categoria } = useParams();
  const navigate = useNavigate();

  const { products, loading, error } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  useEffect(() => {
    if (categoria && categoria !== categoria.toLowerCase()) {
      navigate(`/tienda/${categoria.toLowerCase()}`, { replace: true });
    }
  }, [categoria, navigate]);

  const normalizedCategory = categoria?.toLowerCase();
  const selectedCategory = normalizedCategory && categories.map(c => c.toLowerCase()).includes(normalizedCategory)
    ? categories.find(c => c.toLowerCase() === normalizedCategory) || 'Todos'
    : 'Todos';

  const getSubcategories = () => {
    if (selectedCategory === 'Todos') return [];
    const subcats = products
      .filter(p => p.category === selectedCategory && p.subcategory && p.subcategory.length > 0)
      .flatMap(p => p.subcategory || []);
    return Array.from(new Set(subcats));
  };
  const subcategories = getSubcategories();

  const seoData: Record<string, { title: string; description: string; url: string }> = {
    'Todos': { title: 'Tienda Gamer - Gaming Store | Aventura Gamer', description: 'Descubre nuestra amplia selección de productos gaming.', url: '/tienda' },
  };
  const currentSeo = seoData[selectedCategory] || seoData['Todos'];
  const canonicalUrl = `https://aventuragamer.com${currentSeo.url}`;

  const handleCategoryChange = (category: string) => {
    setSelectedSubcategory('all');
    if (category === 'Todos') {
      navigate('/tienda');
    } else {
      navigate(`/tienda/${category.toLowerCase()}`);
    }
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

  if (selectedSubcategory !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.subcategory && p.subcategory.includes(selectedSubcategory));
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

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory, sortBy, priceRange, selectedSubcategory]);

  const formatPrice = (price: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{currentSeo.title}</title>
        <meta name="description" content={currentSeo.description} />
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

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar Filters */}
          <aside className="w-full lg:w-60 shrink-0 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 bg-card border-border"
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Categorías</h3>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategories */}
            {subcategories.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Subcategorías</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedSubcategory('all')}
                    className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                      selectedSubcategory === 'all'
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    Todas
                  </button>
                  {subcategories.map(sub => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcategory(sub)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                        selectedSubcategory === sub
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Precio
              </h3>
              <div className="space-y-1">
                {[
                  { value: 'all', label: 'Todos los precios' },
                  { value: '0-50000', label: 'Hasta $50.000' },
                  { value: '50000-100000', label: '$50.000 - $100.000' },
                  { value: '100000-200000', label: '$100.000 - $200.000' },
                  { value: '200000-500000', label: '$200.000 - $500.000' },
                  { value: '500000', label: 'Más de $500.000' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setPriceRange(opt.value)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                      priceRange === opt.value
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground hidden sm:block">
                Mostrando {startIndex + 1}-{Math.min(startIndex + PRODUCTS_PER_PAGE, totalProducts)} de {totalProducts}
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px] bg-card">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Más recientes</SelectItem>
                  <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                  <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                  <SelectItem value="stock">Mayor disponibilidad</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                    onClick={() => navigate(`/producto/${product.id}`)}
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-muted/20 overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
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
                              image: product.image || undefined,
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
