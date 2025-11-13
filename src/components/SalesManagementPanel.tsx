import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { useSales } from '@/hooks/useSales';
import { toast } from '@/hooks/use-toast';
import { Loader2, ShoppingCart, Calendar, User, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const SalesManagementPanel = () => {
  const { user } = useAuth();
  const { products } = useProducts();
  const { sales, loading: loadingSales, refetch } = useSales();
  
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  
  // Filtros
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterUser, setFilterUser] = useState<string>('all');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getSelectedProductInfo = () => {
    return products?.find(p => p.id === selectedProduct);
  };

  const calculateTotal = () => {
    const product = getSelectedProductInfo();
    if (!product) return 0;
    return product.price * quantity;
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

    const product = getSelectedProductInfo();
    if (!product) return;

    // Validar inventario
    if (quantity > product.stock) {
      toast({
        title: "Inventario insuficiente",
        description: `Solo hay ${product.stock} unidades disponibles de ${product.name}`,
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      // 1. Registrar la venta
      const { error: saleError } = await supabase
        .from('sales')
        .insert({
          product_id: selectedProduct,
          quantity: quantity,
          total_price: calculateTotal(),
          sold_by: user.id
        });

      if (saleError) throw saleError;

      // 2. Actualizar el inventario
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: product.stock - quantity })
        .eq('id', selectedProduct);

      if (updateError) throw updateError;

      toast({
        title: "Venta registrada",
        description: `Se registró la venta de ${quantity} unidad(es) de ${product.name}`,
      });

      // Limpiar formulario
      setSelectedProduct('');
      setQuantity(1);
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

  // Obtener usuarios únicos de las ventas
  const uniqueUsers = Array.from(
    new Set(sales?.map(s => ({ id: s.sold_by, username: s.profiles?.username || 'Usuario' }))
      .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i))
  );

  return (
    <div className="space-y-6">
      {/* Formulario de Registro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Registrar Nueva Venta
          </CardTitle>
          <CardDescription>
            Selecciona el producto y cantidad para registrar una venta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product">Producto</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Selecciona un producto" />
                </SelectTrigger>
                <SelectContent>
                  {products?.filter(p => p.stock > 0).map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (Stock: {product.stock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={getSelectedProductInfo()?.stock || 1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="space-y-2">
              <Label>Total</Label>
              <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center font-semibold text-lg">
                {formatPrice(calculateTotal())}
              </div>
            </div>
          </div>

          <Button
            onClick={handleRegisterSale}
            disabled={!selectedProduct || submitting}
            className="w-full mt-4"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              'Registrar Venta'
            )}
          </Button>
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
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Vendido por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales?.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>
                        {format(new Date(sale.created_at), "dd MMM yyyy, HH:mm", { locale: es })}
                      </TableCell>
                      <TableCell className="font-medium">
                        {sale.products?.name || 'Producto eliminado'}
                      </TableCell>
                      <TableCell className="text-center">
                        {sale.quantity}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatPrice(sale.total_price)}
                      </TableCell>
                      <TableCell>
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
