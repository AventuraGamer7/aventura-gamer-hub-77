import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import SEOHead from '@/components/SEO/SEOHead';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, Star, ArrowLeft, Share2, Heart, Package, Truck, Shield, CreditCard } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  image: string | null;
  images: string[] | null;
  badge_text: string | null;
  badge_color: string | null;
  created_at: string;
  updated_at: string;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Producto no encontrado');
        } else {
          throw error;
        }
        return;
      }

      setProduct(data);
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: getProductImages()[0],
        type: 'product'
      });
    }

    toast({
      title: 'Producto agregado',
      description: `${quantity} ${product.name}${quantity > 1 ? 's' : ''} agregado${quantity > 1 ? 's' : ''} al carrito`
    });
  };

  const getProductImages = () => {
    if (!product) return ['/api/placeholder/400/400'];
    
    // Usar el array de imágenes si existe, sino usar la imagen singular, sino placeholder
    if (product.images && product.images.length > 0) {
      return product.images;
    } else if (product.image) {
      return [product.image];
    } else {
      return ['/api/placeholder/400/400'];
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || 'Producto',
          text: product?.description || 'Mira este producto en Aventura Gamer',
          url: url
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: 'Enlace copiado',
          description: 'El enlace del producto ha sido copiado al portapapeles'
        });
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Skeleton className="w-full h-96 rounded-lg" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/tienda')} variant="gaming">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la Tienda
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = getProductImages();
  const seoData = {
    title: `${product.name} - Aventura Gamer`,
    description: product.description || `Compra ${product.name} al mejor precio. ${product.category ? `Categoría: ${product.category}.` : ''} Stock disponible en Aventura Gamer.`,
    image: images[0],
    type: 'product' as const,
    data: {
      name: product.name,
      price: product.price,
      currency: 'COP',
      availability: product.stock > 0 ? 'InStock' : 'OutOfStock',
      category: product.category || 'Gaming',
      images: images
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...seoData} />
      
      <Header />
      <WhatsAppFloat />
      
      <main className="container mx-auto px-4 py-24">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/tienda')}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la Tienda
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
                  <DialogTrigger asChild>
                    <div className="relative h-96 bg-muted/20 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors">
                      <img
                        src={images[selectedImageIndex]}
                        alt={product.name}
                        className="max-w-full max-h-full object-scale-down"
                      />
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Badge variant="destructive" className="text-lg px-6 py-2">
                            Agotado
                          </Badge>
                        </div>
                      )}
                      {product.badge_text && (
                        <Badge 
                          variant={product.badge_color as any} 
                          className="absolute top-4 left-4"
                        >
                          {product.badge_text}
                        </Badge>
                      )}
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
                    <div className="relative w-full h-full flex items-center justify-center bg-background">
                      <img
                        src={images[selectedImageIndex]}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === selectedImageIndex 
                        ? 'border-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Vista ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary" className="mb-2">
                  {product.category || 'General'}
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              <h1 className="text-3xl font-bold text-glow mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.8/5 - 156 reseñas)</span>
              </div>

              <div className="text-3xl font-bold text-primary mb-4">
                {formatPrice(product.price)}
              </div>

              {product.stock > 0 && (
                <p className="text-sm text-muted-foreground mb-4">
                  {product.stock} unidades disponibles
                </p>
              )}
            </div>

            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity Selector and Add to Cart */}
            <div className="space-y-4">
              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Cantidad:</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1"
                  variant="gaming"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Product Benefits */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Beneficios incluidos:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Garantía incluida</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>Envío rápido a toda Colombia</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span>Múltiples métodos de pago</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-primary" />
                    <span>Producto 100% original</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;