
CREATE OR REPLACE VIEW public.all_sales_unified AS
SELECT s.id,
    s.item_id,
    s.quantity,
    s.total_price,
    s.sold_by,
    s.created_at,
    s.item_type,
    s.payment_method,
    s.description,
    CASE
        WHEN s.item_id IS NULL THEN COALESCE(s.description, 'Venta manual')
        WHEN s.item_type = 'pedido' THEN s.description
        WHEN s.item_type = 'service' THEN sv.name
        WHEN s.item_type = 'servicio' THEN sv.name
        WHEN s.item_type = 'orden_servicio' THEN COALESCE(os.descripcion, 'Orden #' || os.numero_orden)
        WHEN s.item_type IN ('course','curso') THEN cs.title
        ELSE COALESCE(p.name, s.description)
    END AS product_name,
    CASE
        WHEN s.item_type IN ('service','servicio') THEN sv.image
        WHEN s.item_type IN ('pedido','orden_servicio','course','curso','otro') THEN NULL::text
        ELSE p.image
    END AS product_image,
    CASE
        WHEN s.item_id IS NULL THEN
          CASE s.item_type
            WHEN 'servicio' THEN 'Servicio'
            WHEN 'service' THEN 'Servicio'
            WHEN 'curso' THEN 'Curso'
            WHEN 'course' THEN 'Curso'
            WHEN 'producto' THEN 'Producto'
            WHEN 'product' THEN 'Producto'
            WHEN 'otro' THEN 'Otro'
            ELSE 'Manual'
          END
        WHEN s.item_type = 'pedido' THEN 'Pedido'
        WHEN s.item_type IN ('service','servicio') THEN 'Servicio'
        WHEN s.item_type = 'orden_servicio' THEN 'Orden de servicio'
        WHEN s.item_type IN ('course','curso') THEN 'Curso'
        ELSE p.category
    END AS product_category,
    CASE
        WHEN s.item_id IS NULL THEN s.total_price::numeric(10,2)
        WHEN s.item_type = 'pedido' THEN s.total_price::numeric(10,2)
        WHEN s.item_type IN ('service','servicio') THEN sv.price
        WHEN s.item_type = 'orden_servicio' THEN os.precio_servicio
        WHEN s.item_type IN ('course','curso') THEN cs.price
        ELSE p.price
    END AS product_price,
    pr.username AS seller_name
FROM sales s
LEFT JOIN products p ON p.id = s.item_id AND s.item_type IN ('producto','product')
LEFT JOIN services sv ON sv.id = s.item_id AND s.item_type IN ('service','servicio')
LEFT JOIN ordenes_servicio os ON os.id = s.item_id AND s.item_type = 'orden_servicio'
LEFT JOIN courses cs ON cs.id = s.item_id AND s.item_type IN ('course','curso')
LEFT JOIN profiles pr ON pr.id = s.sold_by;
