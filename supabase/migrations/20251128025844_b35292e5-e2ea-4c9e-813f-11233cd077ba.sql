-- Create function to award points on purchase
CREATE OR REPLACE FUNCTION public.award_points_on_order()
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
BEGIN
  -- Calculate points based on total price (1 point per $1000 COP)
  points_to_award := FLOOR(NEW.total_price / 1000);
  
  -- Get current points and level
  SELECT points, level INTO current_points, current_level
  FROM public.profiles
  WHERE id = NEW.user_id;
  
  -- Calculate new level (Level = floor(points / 100) + 1)
  new_level := FLOOR((current_points + points_to_award) / 100) + 1;
  
  -- Update profile with new points and level
  UPDATE public.profiles
  SET 
    points = points + points_to_award,
    level = new_level,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to award points when order is created
DROP TRIGGER IF EXISTS trigger_award_points_on_order ON public.orders;
CREATE TRIGGER trigger_award_points_on_order
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.award_points_on_order();