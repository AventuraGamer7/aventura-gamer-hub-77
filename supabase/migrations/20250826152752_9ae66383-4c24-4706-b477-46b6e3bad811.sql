-- Crear bucket para imágenes de órdenes de servicio
INSERT INTO storage.buckets (id, name, public) 
VALUES ('service-orders', 'service-orders', true);

-- Agregar campos para imágenes y descripción del admin a la tabla ordenes_servicio
ALTER TABLE public.ordenes_servicio 
ADD COLUMN admin_descripcion TEXT,
ADD COLUMN admin_imagenes TEXT[] DEFAULT '{}';

-- Crear políticas RLS para el bucket de órdenes de servicio
-- Los administradores pueden subir imágenes
CREATE POLICY "Admin can upload service order images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'service-orders' 
  AND (public.get_current_user_role() IN ('admin', 'superadmin', 'employee'))
);

-- Los administradores pueden actualizar imágenes
CREATE POLICY "Admin can update service order images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'service-orders' 
  AND (public.get_current_user_role() IN ('admin', 'superadmin', 'employee'))
);

-- Los administradores pueden eliminar imágenes
CREATE POLICY "Admin can delete service order images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'service-orders' 
  AND (public.get_current_user_role() IN ('admin', 'superadmin', 'employee'))
);

-- Todos pueden ver las imágenes (público)
CREATE POLICY "Everyone can view service order images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'service-orders');