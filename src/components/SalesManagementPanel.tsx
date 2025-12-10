import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { useSales } from '@/hooks/useSales';
import { toast } from '@/hooks/use-toast';
import { Loader2, ShoppingCart, Calendar, User, Search, Package, X, Check, Hash, DollarSign, Boxes, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SelectedProductData {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string | null;
}

const SalesManagementPanel = () => {
  const { user } = useAuth();
  const { products } = useProducts();
  const { sales, loading: loadingSales, refetch } = useSales();
  
  const [selectedProduct, setSelectedProduct] = useState<SelectedProductData | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [customPrice, setCustomPrice] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Filtros
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterUser, setFilterUser] = useState<string>('all');

  // Cerrar autocomplete al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateTotal = () => {
    if (!selectedProduct) return 0;
    const price = customPrice ? parseFloat(customPrice) : selectedProduct.price;
    return price * quantity;
  };

  const handleSelectProduct = (product: any) => {
    setSelectedProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.image
    });
    setCustomPrice(product.price.toString());
    setQuantity(1);
    setSearchTerm('');
    setShowAutocomplete(false);
  };

  const handleClearSelection = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setCustomPrice('');
    setNotes('');
  };

  const handleRegisterSale = async () => {
    if (!selectedProduct || !user) {
      toast({
        title: "Error",
        description: "Selecciona un producto para continuar",
        variant: "destructive"
      });
      return;
    }

    // Validar inventario
    if (quantity > selectedProduct.stock) {
      toast({
        title: "Inventario insuficiente",
        description: `Solo hay ${selectedProduct.stock} unidades disponibles de ${selectedProduct.name}`,
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const totalPrice = calculateTotal();
      
      const { error: saleError } = await (supabase as any)
        .from('sales')
        .insert({
          product_id: selectedProduct.id,
          quantity: quantity,
          total_price: totalPrice,
          sold_by: user.id
        });

      if (saleError) throw saleError;

      // Actualizar el inventario
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: selectedProduct.stock - quantity })
        .eq('id', selectedProduct.id);

      if (updateError) throw updateError;

      toast({
        title: "Venta registrada",
        description: `Se registró la venta de ${quantity} unidad(es) de ${selectedProduct.name}`,
      });

      // Limpiar formulario
      handleClearSelection();
      refetch();

    } catch (error: any) {
      console.error('Error registering sale:', error);
      toast({
        title: "Error al registrar venta",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Filtrar ventas
  const filteredSales = sales?.filter(sale => {
    const matchesDate = !filterDate || 
      format(new Date(sale.created_at), 'yyyy-MM-dd') === filterDate;
    
    const matchesUser = filterUser === 'all' || sale.sold_by === filterUser;
    
    return matchesDate && matchesUser;
  });

  // Filtrar productos por búsqueda
  const filteredProducts = products?.filter(p => 
    p.stock > 0 && 
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     p.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Obtener usuarios únicos de las ventas
  const uniqueUsers = Array.from(
    new Set(sales?.map(s => ({ id: s.sold_by, username: s.profiles?.username || 'Usuario' }))
      .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i))
  );

  return (
    <div className="space-y-6">
      {/* Formulario de Registro */}
      <Card className="border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Registrar Nueva Venta
          </CardTitle>
          <CardDescription>
            Busca y selecciona un producto para registrar la venta
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Buscador con Autocompletado */}
          <div className="space-y-4">
            <div className="space-y-2 relative" ref={searchRef}>
              <Label htmlFor="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Buscar Producto
              </Label>
              <Input
                id="search"
                type="text"
                placeholder="Escribe el nombre o ID del producto..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowAutocomplete(e.target.value.length > 0);
                }}
                onFocus={() => searchTerm.length > 0 && setShowAutocomplete(true)}
                className="pr-10"
              />
              
              {/* Dropdown de Autocompletado */}
              {showAutocomplete && filteredProducts && filteredProducts.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto">
                  {filteredProducts.slice(0, 8).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer transition-colors border-b border-border/50 last:border-b-0"
                    >
                      {/* Miniatura */}
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      {/* Información */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <Hash className="h-3 w-3 mr-1" />
                            {product.id.slice(0, 8)}...
                          </Badge>
                          <Badge variant={product.stock > 5 ? "default" : "destructive"} className="text-xs">
                            Stock: {product.stock}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Precio */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-primary">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                  ))}
                  {filteredProducts.length > 8 && (
                    <div className="p-2 text-center text-sm text-muted-foreground bg-muted/50">
                      +{filteredProducts.length - 8} productos más...
                    </div>
                  )}
                </div>
              )}
              
              {showAutocomplete && searchTerm && filteredProducts?.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg p-4 text-center text-muted-foreground">
                  No se encontraron productos
                </div>
              )}
            </div>

            {/* Producto Seleccionado */}
            {selectedProduct && (
              <Card className="border-2 border-primary/30 bg-primary/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      Producto Seleccionado
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClearSelection}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {/* Miniatura grande del producto */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0 border-2 border-border">
                      {selectedProduct.image ? (
                        <img 
                          src={selectedProduct.image} 
                          alt={selectedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Información del producto */}
                    <div className="flex-1 space-y-2">
                      <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Hash className="h-3 w-3 mr-1" />
                          {selectedProduct.id.slice(0, 8)}...
                        </Badge>
                        <Badge variant={selectedProduct.stock > 5 ? "secondary" : "destructive"}>
                          <Boxes className="h-3 w-3 mr-1" />
                          Stock: {selectedProduct.stock}
                        </Badge>
                        <Badge variant="default">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {formatPrice(selectedProduct.price)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Campos Editables */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="flex items-center gap-2">
                        <Boxes className="h-4 w-4" />
                        Cantidad
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max={selectedProduct.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="text-center font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customPrice" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Precio Unitario
                      </Label>
                      <Input
                        id="customPrice"
                        type="number"
                        min="0"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        className="text-center font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Total
                      </Label>
                      <div className="h-10 px-3 py-2 bg-primary/10 border border-primary/30 rounded-md flex items-center justify-center font-bold text-lg text-primary">
                        {formatPrice(calculateTotal())}
                      </div>
                    </div>
                  </div>

                  {/* Notas */}
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="notes" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Notas (opcional)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Agregar notas sobre la venta..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="resize-none h-20"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botón de Registro */}
            <Button
              onClick={handleRegisterSale}
              disabled={!selectedProduct || submitting}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Registrando venta...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Registrar Venta
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Productos Disponibles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Productos Disponibles
          </CardTitle>
          <CardDescription>
            Haz clic en un producto para seleccionarlo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products?.filter(p => p.stock > 0).slice(0, 15).map((product) => (
              <Card 
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${
                  selectedProduct?.id === product.id ? 'ring-2 ring-primary border-primary' : ''
                }`}
              >
                <div className="aspect-square relative overflow-hidden rounded-t-lg bg-muted">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {selectedProduct?.id === product.id && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  <Badge 
                    variant={product.stock > 5 ? "secondary" : "destructive"} 
                    className="absolute bottom-2 left-2 text-xs"
                  >
                    {product.stock} uds
                  </Badge>
                </div>
                <CardContent className="p-3">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-primary font-bold text-sm mt-1">{formatPrice(product.price)}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    #{product.id.slice(0, 8)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          {products && products.filter(p => p.stock > 0).length > 15 && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              Mostrando 15 de {products.filter(p => p.stock > 0).length} productos. Usa el buscador para encontrar más.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Historial de Ventas */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
          <CardDescription>
            Visualiza todas las ventas realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="filterDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Filtrar por Fecha
              </Label>
              <Input
                id="filterDate"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterUser" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Filtrar por Usuario
              </Label>
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger id="filterUser">
                  <SelectValue placeholder="Todos los usuarios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los usuarios</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loadingSales ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredSales?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron ventas
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Producto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Vendido por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales?.map((sale) => (
                    <TableRow key={sale.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {sale.products?.image ? (
                              <img 
                                src={sale.products.image} 
                                alt={sale.products?.name || ''}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium">
                            {sale.products?.name || 'Producto eliminado'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(sale.created_at), "dd MMM yyyy, HH:mm", { locale: es })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{sale.quantity}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {formatPrice(sale.total_price)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {sale.profiles?.username || 'Usuario'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesManagementPanel;
