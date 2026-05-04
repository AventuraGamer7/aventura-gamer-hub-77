
-- Fix privilege escalation: prevent users from changing their own role
CREATE OR REPLACE FUNCTION public.prevent_role_self_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF public.get_current_user_role() NOT IN ('admin'::user_role, 'superadmin'::user_role) THEN
      NEW.role := OLD.role;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_role_self_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_self_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_role_self_escalation();

-- Fix search_path on existing functions
ALTER FUNCTION public.set_updated_at() SET search_path = public;
ALTER FUNCTION public.set_completado_at() SET search_path = public;
ALTER FUNCTION public.generate_slug(text) SET search_path = public;
ALTER FUNCTION public.fn_orden_completada_a_sales() SET search_path = public;
ALTER FUNCTION public.set_product_slug() SET search_path = public;
ALTER FUNCTION public.set_price_on_insert() SET search_path = public;
ALTER FUNCTION public.adjust_stock_on_delete() SET search_path = public;
ALTER FUNCTION public.confirmar_llegada_orden(uuid) SET search_path = public;
ALTER FUNCTION public.buscar_referencia_producto(text) SET search_path = public;
ALTER FUNCTION public.trigger_procesar_orden_recibida() SET search_path = public;
ALTER FUNCTION public.generar_numero_orden() SET search_path = public;
ALTER FUNCTION public.set_sold_by_default() SET search_path = public;

DO $$
BEGIN
  BEGIN
    EXECUTE 'ALTER FUNCTION public.procesar_imagen_masiva() SET search_path = public';
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    EXECUTE 'ALTER FUNCTION public.procesar_imagen_masiva(text) SET search_path = public';
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    EXECUTE 'ALTER FUNCTION public.procesar_imagen_masiva(uuid) SET search_path = public';
  EXCEPTION WHEN others THEN NULL;
  END;
END$$;
