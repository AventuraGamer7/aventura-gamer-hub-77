-- Eliminar la política problemática que causa recursión infinita
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Crear la política correcta usando la función security definer existente
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.get_current_user_role() IN ('admin', 'superadmin', 'employee'));