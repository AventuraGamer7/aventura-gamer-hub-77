-- Crear tabla de ventas
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price NUMERIC(12,2) NOT NULL CHECK (total_price >= 0),
  sold_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Política para que admins, superadmins y empleados puedan ver todas las ventas
CREATE POLICY "Admins and employees can view all sales"
ON public.sales
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'employee', 'manager')
  )
);

-- Política para crear ventas (admins, superadmins y empleados)
CREATE POLICY "Admins and employees can create sales"
ON public.sales
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'employee', 'manager')
  )
  AND sold_by = auth.uid()
);

-- Crear índices para mejorar performance
CREATE INDEX idx_sales_product_id ON public.sales(product_id);
CREATE INDEX idx_sales_sold_by ON public.sales(sold_by);
CREATE INDEX idx_sales_created_at ON public.sales(created_at DESC);