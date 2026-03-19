
-- Create manual_orders table
CREATE TABLE public.manual_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  total_value NUMERIC(12,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'transferencia',
  receipt_url TEXT,
  status TEXT NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.manual_orders ENABLE ROW LEVEL SECURITY;

-- Users can create their own manual orders
CREATE POLICY "Users can create own manual orders"
  ON public.manual_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own manual orders
CREATE POLICY "Users can view own manual orders"
  ON public.manual_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all manual orders
CREATE POLICY "Admins can view all manual orders"
  ON public.manual_orders FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'employee')
  ));

-- Admins can update manual orders (change status)
CREATE POLICY "Admins can update manual orders"
  ON public.manual_orders FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin', 'employee')
  ));

-- Trigger to update updated_at
CREATE TRIGGER update_manual_orders_updated_at
  BEFORE UPDATE ON public.manual_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to award points when manual order is marked as paid
CREATE OR REPLACE FUNCTION public.award_points_on_manual_order()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
DECLARE
  points_to_award INTEGER;
  current_points INTEGER;
  current_level INTEGER;
  new_level INTEGER;
BEGIN
  -- Only award when status changes to 'pagada'
  IF NEW.status = 'pagada' AND (OLD.status IS DISTINCT FROM 'pagada') THEN
    points_to_award := FLOOR(NEW.total_value / 1000);
    
    SELECT points, level INTO current_points, current_level
    FROM public.profiles
    WHERE id = NEW.user_id;
    
    new_level := FLOOR((current_points + points_to_award) / 100) + 1;
    
    UPDATE public.profiles
    SET 
      points = points + points_to_award,
      level = new_level,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for awarding points
CREATE TRIGGER award_points_manual_order
  AFTER UPDATE ON public.manual_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.award_points_on_manual_order();
