-- Create function to award points on service order
CREATE OR REPLACE FUNCTION public.award_points_on_service_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  points_to_award INTEGER;
  current_points INTEGER;
  current_level INTEGER;
  new_level INTEGER;
  service_price NUMERIC;
BEGIN
  -- Get service price
  SELECT price INTO service_price
  FROM public.services
  WHERE id = NEW.id;
  
  -- Calculate points based on service price (1 point per $1000 COP)
  points_to_award := FLOOR(service_price / 1000);
  
  -- Get current points and level
  SELECT points, level INTO current_points, current_level
  FROM public.profiles
  WHERE id = NEW.usuario_id;
  
  -- Calculate new level (Level = floor(points / 100) + 1)
  new_level := FLOOR((current_points + points_to_award) / 100) + 1;
  
  -- Update profile with new points and level
  UPDATE public.profiles
  SET 
    points = points + points_to_award,
    level = new_level,
    updated_at = NOW()
  WHERE id = NEW.usuario_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to award points when service order is created
DROP TRIGGER IF EXISTS trigger_award_points_on_service_order ON public.ordenes_servicio;
CREATE TRIGGER trigger_award_points_on_service_order
AFTER INSERT ON public.ordenes_servicio
FOR EACH ROW
EXECUTE FUNCTION public.award_points_on_service_order();