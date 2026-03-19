-- Crear tabla de órdenes de servicio
CREATE TABLE public.ordenes_servicio (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    estado TEXT NOT NULL DEFAULT 'Recibido',
    descripcion TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.ordenes_servicio ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios vean solo sus órdenes
CREATE POLICY "Users can view their own orders" 
ON public.ordenes_servicio 
FOR SELECT 
USING (auth.uid() = usuario_id);

-- Política para que admins/empleados puedan ver todas las órdenes
CREATE POLICY "Admins can view all orders" 
ON public.ordenes_servicio 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'superadmin', 'employee')
));

-- Política para que admins/empleados puedan crear órdenes
CREATE POLICY "Admins can create orders" 
ON public.ordenes_servicio 
FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'superadmin', 'employee')
));

-- Política para que admins/empleados puedan actualizar órdenes
CREATE POLICY "Admins can update orders" 
ON public.ordenes_servicio 
FOR UPDATE 
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'superadmin', 'employee')
));

-- Trigger para actualizar updated_at
CREATE TRIGGER update_ordenes_servicio_updated_at
BEFORE UPDATE ON public.ordenes_servicio
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();