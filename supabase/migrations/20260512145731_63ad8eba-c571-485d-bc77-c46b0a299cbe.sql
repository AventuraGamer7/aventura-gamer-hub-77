DELETE FROM public.sales WHERE item_type IN ('pedido', 'orden_servicio');

DROP FUNCTION IF EXISTS public.award_points_on_pedido() CASCADE;
DROP FUNCTION IF EXISTS public.register_sale_on_pedido_completion() CASCADE;
DROP FUNCTION IF EXISTS public.confirmar_llegada_orden(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.trigger_procesar_orden_recibida() CASCADE;
DROP FUNCTION IF EXISTS public.buscar_referencia_producto(text) CASCADE;
DROP FUNCTION IF EXISTS public.fn_orden_completada_a_sales() CASCADE;
DROP FUNCTION IF EXISTS public.award_points_on_service_order() CASCADE;
DROP FUNCTION IF EXISTS public.generar_numero_orden() CASCADE;
DROP FUNCTION IF EXISTS public.set_completado_at() CASCADE;

DROP TABLE IF EXISTS public.catalogo_proveedores CASCADE;
DROP TABLE IF EXISTS public.ordenes_proveedores CASCADE;
DROP TABLE IF EXISTS public.ordenes_servicio CASCADE;
DROP TABLE IF EXISTS public.pedidos CASCADE;
DROP TABLE IF EXISTS public.gamification_rules CASCADE;

DROP SEQUENCE IF EXISTS public.orden_servicio_seq CASCADE;