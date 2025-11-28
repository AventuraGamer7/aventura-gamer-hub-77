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
import { useProductVariants } from '@/hooks/useProductVariants';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, Star, ArrowLeft, Share2, Heart, Package, Truck, Shield, CreditCard, MessageCircle, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  subcategory: string | null;
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
  const { variants, loading: variantsLoading } = useProductVariants(id);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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
    
    // Si hay una variante seleccionada, usar su imagen
    if (selectedVariant) {
      const variant = variants.find(v => v.id === selectedVariant);
      if (variant?.image_url) {
        return [variant.image_url];
      }
    }
    
    // Usar el array de imágenes si existe, sino usar la imagen singular, sino placeholder
    if (product.images && product.images.length > 0) {
      return product.images;
    } else if (product.image) {
      return [product.image];
    } else {
      return ['/api/placeholder/400/400'];
    }
  };

  const getCurrentPrice = () => {
    if (!product) return 0;
    
    if (selectedVariant) {
      const variant = variants.find(v => v.id === selectedVariant);
      if (variant) {
        return product.price + (variant.price_adjustment || 0);
      }
    }
    
    return product.price;
  };

  const getCurrentStock = () => {
    if (!product) return 0;
    
    if (selectedVariant) {
      const variant = variants.find(v => v.id === selectedVariant);
      if (variant) {
        return variant.stock;
      }
    }
    
    return product.stock;
  };

  const activeVariants = variants.filter(v => v.is_active).sort((a, b) => a.display_order - b.display_order);

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

  const handleWhatsAppRequest = () => {
    if (!product) return;
    
    const message = `Hola, estoy interesado en solicitar el producto: ${product.name}. Precio: ${formatPrice(product.price)}. Me gustaría más información para comprarlo ahora.`;
    const whatsappUrl = `https://wa.me/573505138557?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  useEffect(() => {
    if (!isImageModalOpen) {
      setZoomLevel(1);
      setImagePosition({ x: 0, y: 0 });
    }
  }, [isImageModalOpen]);

  // Keyboard navigation for carousel
  useEffect(() => {
    if (!isImageModalOpen || !product) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentImages = getProductImages();
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedImageIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));
        handleResetZoom();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedImageIndex((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1));
        handleResetZoom();
      } else if (e.key === 'Escape') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageModalOpen, product]);

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
                    <div className="relative h-96 bg-muted/20 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors group">
                      <img
                        src={images[selectedImageIndex]}
                        alt={product.name}
                        className="max-w-full max-h-full object-scale-down"
                      />
                      
                      {/* Navigation Arrows for Main Image */}
                      {images.length > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur-sm shadow-lg hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                            }}
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur-sm shadow-lg hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                            }}
                          >
                            <ChevronRight className="h-6 w-6" />
                          </Button>
                        </>
                      )}
                      
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
                  <DialogContent className="max-w-5xl w-[95vw] h-auto p-4 md:p-6">
                    <div className="space-y-4">
                      <div className="relative">
                        {/* Zoom Controls */}
                        <div className="absolute top-2 right-2 z-10 flex gap-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleZoomIn}
                            disabled={zoomLevel >= 4}
                            title="Acercar"
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleZoomOut}
                            disabled={zoomLevel <= 1}
                            title="Alejar"
                          >
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleResetZoom}
                            disabled={zoomLevel === 1}
                            title="Restablecer"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Zoom Level Indicator */}
                        {zoomLevel > 1 && (
                          <div className="absolute top-2 left-2 z-10 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
                            <span className="text-sm font-medium">{Math.round(zoomLevel * 100)}%</span>
                          </div>
                        )}

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur-sm shadow-lg hover:bg-background"
                              onClick={() => {
                                setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                                handleResetZoom();
                              }}
                            >
                              <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur-sm shadow-lg hover:bg-background"
                              onClick={() => {
                                setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                                handleResetZoom();
                              }}
                            >
                              <ChevronRight className="h-6 w-6" />
                            </Button>
                          </>
                        )}

                        {/* Image Container */}
                        <div 
                          className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden rounded-lg bg-muted/20"
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                          onWheel={handleWheel}
                          style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                        >
                          <img
                            src={images[selectedImageIndex]}
                            alt={`${product.name} - Imagen ${selectedImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain select-none transition-transform"
                            style={{
                              transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                              transformOrigin: 'center center'
                            }}
                            draggable={false}
                          />
                        </div>

                        {/* Instructions */}
                        {zoomLevel === 1 && (
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                            <p className="text-xs text-muted-foreground text-center">
                              Usa la rueda del mouse o los botones + y - para acercar
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Thumbnails */}
                      {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 px-1 justify-center">
                          {images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setSelectedImageIndex(index);
                                handleResetZoom();
                              }}
                              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                index === selectedImageIndex 
                                  ? 'border-primary ring-2 ring-primary/50 scale-105' 
                                  : 'border-border hover:border-primary/50 hover:scale-105'
                              }`}
                            >
                              <img
                                src={image}
                                alt={`${product.name} - Miniatura ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Image Counter */}
                      {images.length > 1 && (
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            Imagen {selectedImageIndex + 1} de {images.length}
                          </p>
                        </div>
                      )}
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
                <div className="flex flex-col gap-2">
                  <Badge variant="secondary" className="w-fit">
                    {product.category || 'General'}
                  </Badge>
                  {product.subcategory && (
                    <Badge variant="outline" className="w-fit">
                      {product.subcategory}
                    </Badge>
                  )}
                </div>
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
                {formatPrice(getCurrentPrice())}
              </div>

              {getCurrentStock() > 0 && (
                <p className="text-sm text-muted-foreground mb-4">
                  {getCurrentStock()} unidades disponibles
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

            {/* Product Variants */}
            {!variantsLoading && activeVariants.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Colores y Diseños Disponibles</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {activeVariants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariant(variant.id);
                        setSelectedImageIndex(0);
                      }}
                      className={`relative group rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                        selectedVariant === variant.id
                          ? 'border-primary shadow-lg shadow-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="aspect-square bg-muted/20 flex items-center justify-center p-2">
                        <img
                          src={variant.image_url}
                          alt={variant.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                        <span className="text-xs text-white font-medium px-2 text-center">
                          {variant.name}
                        </span>
                      </div>
                      {selectedVariant === variant.id && (
                        <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      {variant.color_code && (
                        <div 
                          className="absolute bottom-1 left-1 w-4 h-4 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: variant.color_code }}
                        />
                      )}
                    </button>
                  ))}
                </div>
                {selectedVariant && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {activeVariants.find(v => v.id === selectedVariant)?.name}
                    {activeVariants.find(v => v.id === selectedVariant)?.price_adjustment !== 0 && (
                      <span className="ml-2 text-primary font-medium">
                        ({activeVariants.find(v => v.id === selectedVariant)!.price_adjustment! > 0 ? '+' : ''}
                        {formatPrice(activeVariants.find(v => v.id === selectedVariant)!.price_adjustment!)})
                      </span>
                    )}
                  </p>
                )}
              </div>
            )}

            {/* Quantity Selector and Add to Cart */}
            <div className="space-y-4">
              {getCurrentStock() > 0 && (
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
                      onClick={() => setQuantity(Math.min(getCurrentStock(), quantity + 1))}
                      disabled={quantity >= getCurrentStock()}
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={getCurrentStock() === 0}
                    className="flex-1"
                    variant="gaming"
                    size="lg"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {getCurrentStock() > 0 ? 'Agregar al Carrito' : 'Agotado'}
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                
                <Button
                  onClick={handleWhatsAppRequest}
                  disabled={product.stock === 0}
                  className="w-full relative overflow-hidden group animate-fade-in hover:scale-105 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:border-green-500"
                  variant="outline"
                  size="lg"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-500/0 via-green-500/30 to-green-500/0 group-hover:animate-[slide-in-right_0.6s_ease-in-out_infinite]"></span>
                  <MessageCircle className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
                  <span className="relative z-10 font-semibold">Solicitar este producto ahora</span>
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