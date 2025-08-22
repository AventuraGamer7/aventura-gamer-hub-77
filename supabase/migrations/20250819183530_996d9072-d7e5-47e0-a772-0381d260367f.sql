-- Update user_role enum to include admin, manager, and cliente roles
ALTER TYPE user_role ADD VALUE 'admin';
ALTER TYPE user_role ADD VALUE 'manager';
ALTER TYPE user_role ADD VALUE 'cliente';

-- Update default role for profiles table to 'cliente'
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'cliente'::user_role;

-- Update RLS policies for products table
DROP POLICY IF EXISTS "Superadmin and employees can manage products" ON public.products;

-- Create new policy for admin and manager to manage products
CREATE POLICY "Admin and manager can manage products" ON public.products
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'manager')
  )
);

-- Function to get current user role (avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;