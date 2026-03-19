-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admin and manager can manage products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;

DROP POLICY IF EXISTS "Anyone can view courses" ON public.courses;
DROP POLICY IF EXISTS "Superadmin and employees can manage courses" ON public.courses;

DROP POLICY IF EXISTS "Anyone can view services" ON public.services;
DROP POLICY IF EXISTS "Superadmin and employees can manage services" ON public.services;

-- PRODUCTS TABLE POLICIES
-- Everyone can read products
CREATE POLICY "Everyone can view products" ON public.products
FOR SELECT USING (true);

-- Superadmin has full permissions
CREATE POLICY "Superadmin can manage products" ON public.products
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'superadmin'::user_role
  )
);

-- Admin can create, read, and update (no delete)
CREATE POLICY "Admin can create products" ON public.products
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

CREATE POLICY "Admin can update products" ON public.products
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

-- Employee maintains existing permissions (full access)
CREATE POLICY "Employee can manage products" ON public.products
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = ANY (ARRAY['employee'::user_role, 'manager'::user_role])
  )
);

-- COURSES TABLE POLICIES  
-- Everyone can read courses
CREATE POLICY "Everyone can view courses" ON public.courses
FOR SELECT USING (true);

-- Superadmin has full permissions
CREATE POLICY "Superadmin can manage courses" ON public.courses
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'superadmin'::user_role
  )
);

-- Admin can create, read, and update (no delete)
CREATE POLICY "Admin can create courses" ON public.courses
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

CREATE POLICY "Admin can update courses" ON public.courses
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

-- Employee maintains existing permissions (full access)
CREATE POLICY "Employee can manage courses" ON public.courses
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'employee'::user_role
  )
);

-- SERVICES TABLE POLICIES
-- Everyone can read services
CREATE POLICY "Everyone can view services" ON public.services
FOR SELECT USING (true);

-- Superadmin has full permissions  
CREATE POLICY "Superadmin can manage services" ON public.services
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'superadmin'::user_role
  )
);

-- Admin can create, read, and update (no delete)
CREATE POLICY "Admin can create services" ON public.services
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

CREATE POLICY "Admin can update services" ON public.services
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

-- Employee maintains existing permissions (full access)
CREATE POLICY "Employee can manage services" ON public.services  
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'employee'::user_role
  )
);