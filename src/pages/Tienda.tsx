import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Star, Package, Truck, CreditCard, Crown, Filter, Search, Grid, List } from 'lucide-react';
const Tienda = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
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

  // Filter products by category
  const filteredProducts = selectedCategory === 'Todos' ? products : products.filter(p => p.category === selectedCategory);
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
  }) => <Card className="card-gaming border-primary/20 group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/40 relative">
      <div className="relative overflow-hidden rounded-t-lg">
        <img src={product.image || '/api/placeholder/300/300'} alt={product.name} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" />
        {product.stock === 0 && <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive">Agotado</Badge>
          </div>}
              {product.badge_text && (
                <Badge variant={product.badge_color as any} className="absolute -top-1 -left-1 text-sm px-3 py-1 animate-[pulse_1.5s_ease-in-out_infinite] transform -rotate-12 origin-top-left shadow-lg scale-110 hover:scale-125 transition-transform duration-300 z-50">
                  {product.badge_text}
                </Badge>
              )}
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
          <Button variant="gaming" className="flex-1" disabled={product.stock === 0} onClick={() => {
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
        }}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
          </Button>
        </div>
      </CardContent>
    </Card>;
  return <div className="min-h-screen bg-background">
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
          {/* Filters and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8 items-center justify-between">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full lg:w-auto">
              <TabsList className="grid w-full lg:w-auto" style={{
              gridTemplateColumns: `repeat(${Math.min(categories.length, 5)}, 1fr)`
            }}>
                {categories.slice(0, 5).map(category => <TabsTrigger key={category} value={category} className="text-xs">
                    {category}
                  </TabsTrigger>)}
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2">
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}>
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
    </div>;
};
export default Tienda;