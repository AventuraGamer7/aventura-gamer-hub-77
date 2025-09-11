import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Star, Package, Truck, CreditCard, Crown, Filter, Search, Grid, List, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
const Tienda = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState('all');
  const { categoria } = useParams();
  const navigate = useNavigate();
  
  const {
    products,
    loading,
    error
  } = useProducts();
  const {
    addItem
  } = useCart();
  const {
    toast
  } = useToast();

  // Get unique categories from products
  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  
  // Normalize category to lowercase and redirect if needed
  useEffect(() => {
    if (categoria && categoria !== categoria.toLowerCase()) {
      navigate(`/tienda/${categoria.toLowerCase()}`, { replace: true });
      return;
    }
  }, [categoria, navigate]);
  
  // Get selected category from URL params or default to 'Todos'
  const normalizedCategory = categoria?.toLowerCase();
  const selectedCategory = normalizedCategory && categories.map(c => c.toLowerCase()).includes(normalizedCategory) 
    ? categories.find(c => c.toLowerCase() === normalizedCategory) || 'Todos'
    : 'Todos';

  // SEO data for different categories
  const seoData = {
    'Todos': {
      title: 'Tienda Gamer - Gaming Store | Aventura Gamer',
      description: 'Descubre nuestra amplia selección de productos gaming: controles, consolas, accesorios y más. Los mejores precios y calidad garantizada en Aventura Gamer.',
      url: '/tienda'
    },
    'Controles': {
      title: 'Controles para PS4, Xbox y más | Aventura Gamer',
      description: 'Controles gaming profesionales para Xbox, PlayStation y PC. Mejora tu experiencia de juego con nuestros controles de alta calidad en Aventura Gamer.',
      url: '/tienda/controles'
    },
    'Consolas': {
      title: 'Consolas de Videojuegos Xbox, PlayStation | Aventura Gamer',
      description: 'Las mejores consolas gaming: Xbox Series X/S, PlayStation 5, Nintendo Switch y más. Encuentra tu consola ideal al mejor precio en Aventura Gamer.',
      url: '/tienda/consolas'
    },
    'Extras': {
      title: 'Accesorios Gaming y Extras | Aventura Gamer',
      description: 'Accesorios gaming premium: auriculares, teclados mecánicos, mouse gaming, cables y componentes. Mejora tu setup gaming en Aventura Gamer.',
      url: '/tienda/extras'
    },
    'XBOX': {
      title: 'Accesorios y Controles Xbox | Aventura Gamer',
      description: 'Controles Xbox Series X/S, accesorios oficiales y compatibles. La mejor selección de productos Xbox al mejor precio en Aventura Gamer.',
      url: '/tienda/xbox'
    },
    'PS4': {
      title: 'Controles y Accesorios PS4 | Aventura Gamer',
      description: 'Controles DualShock 4, accesorios y repuestos para PlayStation 4. Productos originales y compatibles en Aventura Gamer.',
      url: '/tienda/ps4'
    },
    'PS5': {
      title: 'Controles DualSense y Accesorios PS5 | Aventura Gamer',
      description: 'Controles DualSense, cargadores y accesorios para PlayStation 5. La mejor experiencia gaming de nueva generación en Aventura Gamer.',
      url: '/tienda/ps5'
    }
  };

  const currentSeo = seoData[selectedCategory as keyof typeof seoData] || seoData['Todos'];
  const canonicalUrl = `https://aventuragamer.com${currentSeo.url}`;

  // Update URL when category changes
  const handleCategoryChange = (category: string) => {
    if (category === 'Todos') {
      // Navigate to base tienda route for 'Todos'
      navigate('/tienda');
    } else {
      // Navigate to category route with lowercase
      navigate(`/tienda/${category.toLowerCase()}`);
    }
  };

  // Filter and sort products
  let filteredProducts = selectedCategory === 'Todos' ? products : products.filter(p => p.category === selectedCategory);
  
  // Apply search filter
  if (searchTerm) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Apply price filter
  if (priceRange !== 'all') {
    const [min, max] = priceRange.split('-').map(Number);
    filteredProducts = filteredProducts.filter(p => {
      if (max) {
        return p.price >= min && p.price <= max;
      } else {
        return p.price >= min;
      }
    });
  }
  
  // Apply sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'stock':
        return b.stock - a.stock;
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
  const wholesaleFeatures = ['Precios especiales mayoristas', 'Envíos gratuitos en pedidos >$200.000', 'Acceso prioritario a nuevos productos', 'Soporte técnico especializado', 'Descuentos progresivos por volumen', 'Facturación empresarial'];
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };
  const ProductCard = ({
    product
  }: {
    product: typeof products[0];
  }) => (
    <Card 
      className="card-gaming border-primary/20 overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/40 cursor-pointer"
      onClick={() => navigate(`/producto/${product.id}`)}
    >
      <div className="relative h-72 bg-muted/10 rounded-lg overflow-hidden flex items-center justify-center">
        <img 
          src={product.image || '/api/placeholder/300/300'} 
          alt={product.name} 
          className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105" 
        />
        {product.stock === 0 && <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive">Agotado</Badge>
          </div>}
      </div>
      
      <CardHeader className="space-y-2 transition-all duration-300 group-hover:pb-6">
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className="text-xs">
            {product.category || 'General'}
          </Badge>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-current text-yellow-500" />
            4.8
            <span className="text-muted-foreground">(156)</span>
          </div>
        </div>
        <CardTitle className="text-lg text-neon group-hover:text-xl transition-all duration-300">{product.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground group-hover:text-base transition-all duration-300 group-hover:line-clamp-none line-clamp-2">
          {product.description || 'Sin descripción disponible'}
        </CardDescription>
        
        {/* Expanded content on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 max-h-0 group-hover:max-h-40 overflow-hidden">
          <div className="space-y-2 pt-2 border-t border-muted/20">
            <p className="text-xs text-muted-foreground">✓ Garantía incluida</p>
            <p className="text-xs text-muted-foreground">✓ Envíos a nivel nacional</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
          </div>
          {product.stock > 0 && <p className="text-xs text-muted-foreground">
              {product.stock} unidades disponibles
            </p>}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="gaming" 
            className="flex-1" 
            disabled={product.stock === 0} 
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when clicking button
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || undefined,
                type: 'product'
              });
              toast({
                title: 'Producto agregado',
                description: `${product.name} se agregó al carrito`
              });
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
          </Button>
        </div>
        
        {/* Badge en la parte inferior para mejor visibilidad */}
        {product.badge_text && (
          <div className="flex justify-center mt-3">
            <Badge variant={product.badge_color as any} className="text-sm px-4 py-2 animate-[pulse_1.5s_ease-in-out_infinite] shadow-lg hover:scale-105 transition-transform duration-300">
              {product.badge_text}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
  return <div className="min-h-screen bg-gaming-vibrant">
      <div className="bg-gaming-overlay">
        <Helmet>
        <title>{currentSeo.title}</title>
        <meta name="description" content={currentSeo.description} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={currentSeo.title} />
        <meta property="og:description" content={currentSeo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Aventura Gamer" />
        <meta property="og:locale" content="es_CO" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@aventuragamer" />
        <meta name="twitter:title" content={currentSeo.title} />
        <meta name="twitter:description" content={currentSeo.description} />
        <meta name="twitter:url" content={canonicalUrl} />
      </Helmet>
      <Header />
      <WhatsAppFloat />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background to-primary/10" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            
            
            <h1 className="text-4xl md:text-6xl font-bold text-glow">
              Repuestos & Consolas
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Encuentra repuestos originales, consolas y accesorios gaming de la más alta calidad. Precios mayoristas disponibles.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos por nombre, categoría o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base border-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Categories Tabs */}
          <div className="mb-6">
            <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 h-auto p-2 bg-muted/50">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category} 
                    className="text-xs sm:text-sm py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between bg-muted/30 p-4 rounded-lg">
            <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
              {/* Sort Filter */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Más recientes</SelectItem>
                    <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                    <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                    <SelectItem value="name">Nombre A-Z</SelectItem>
                    <SelectItem value="stock">Mayor stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Rango de precio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los precios</SelectItem>
                    <SelectItem value="0-50000">Menos de $50.000</SelectItem>
                    <SelectItem value="50000-100000">$50.000 - $100.000</SelectItem>
                    <SelectItem value="100000-200000">$100.000 - $200.000</SelectItem>
                    <SelectItem value="200000-500000">$200.000 - $500.000</SelectItem>
                    <SelectItem value="500000">Más de $500.000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                {filteredProducts.length} productos encontrados
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 border rounded-lg p-1">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {Array.from({
            length: 6
          }).map((_, i) => <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>)}
            </div> : error ? <div className="text-center py-12">
              <p className="text-muted-foreground">Error al cargar productos: {error}</p>
            </div> : filteredProducts.length === 0 ? <div className="text-center py-12">
              <p className="text-muted-foreground">
                {products.length === 0 ? 'No hay productos disponibles en este momento.' : `No se encontraron productos en la categoría "${selectedCategory}".`}
              </p>
            </div> : <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
            </div>}
        </div>
      </section>

      {/* Wholesale Banner */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <Card className="card-gaming border-primary/30 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <Badge className="bg-primary/30 text-primary border-primary/50">
                    <Crown className="mr-2 h-4 w-4" />
                    Suscripción Mayorista
                  </Badge>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-glow">
                    Acceso VIP a Precios Mayoristas
                  </h2>
                  
                  <p className="text-lg text-muted-foreground">
                    Únete a nuestro programa mayorista y obtén acceso exclusivo a precios especiales, 
                    envíos gratuitos y soporte prioritario.
                  </p>
                  
                  <div className="flex gap-4">
                    <Button variant="hero" size="lg">
                      <Crown className="mr-2 h-5 w-5" />
                      Suscribirse Ahora
                    </Button>
                    <Button variant="gaming-secondary" size="lg">
                      Más Información
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Beneficios Incluidos:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {wholesaleFeatures.map((feature, index) => <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </div>)}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Services Banner */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-gaming border-primary/20 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Envío Rápido</h3>
                <p className="text-sm text-muted-foreground">
                  Envíos a toda Colombia<br />
                  Entrega en 24-48 horas<br />
                  en Medellín y área metropolitana
                </p>
              </CardContent>
            </Card>

            <Card className="card-gaming border-primary/20 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Package className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Garantía Total</h3>
                <p className="text-sm text-muted-foreground">
                  Garantía en todos<br />
                  nuestros productos<br />
                  Devoluciones fáciles
                </p>
              </CardContent>
            </Card>

            <Card className="card-gaming border-primary/20 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gaming-orange/20 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-gaming-orange" />
                </div>
                <h3 className="font-semibold mb-2">Pago Seguro</h3>
                <p className="text-sm text-muted-foreground">
                  Múltiples métodos de pago<br />
                  Pagos seguros y protegidos<br />
                  Cuotas disponibles
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>;
};
export default Tienda;