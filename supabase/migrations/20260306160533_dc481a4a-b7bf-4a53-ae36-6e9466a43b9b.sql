
-- Add item_type column to sales (default 'producto' for existing records)
ALTER TABLE public.sales ADD COLUMN IF NOT EXISTS item_type text NOT NULL DEFAULT 'producto';

-- Drop the foreign key constraint so we can store service/course IDs too
ALTER TABLE public.sales DROP CONSTRAINT IF EXISTS sales_product_id_fkey;

-- Update triggers to only adjust stock for products
CREATE OR REPLACE FUNCTION public.adjust_stock_on_insert()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  -- Only adjust stock for products
  IF NEW.item_type = 'producto' THEN
    update public.products
       set stock = stock - NEW.quantity
     where id = NEW.product_id
       and stock >= NEW.quantity;

    if not found then
      raise exception 'No hay stock suficiente para product_id=% (qty=%).', NEW.product_id, NEW.quantity
        using errcode = '23514';
    end if;
  END IF;

  return NEW;
end $function$;

CREATE OR REPLACE FUNCTION public.adjust_stock_on_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  v_price numeric(12,2);
begin
  -- Only adjust stock for products
  IF OLD.item_type = 'producto' THEN
    update public.products
       set stock = stock + OLD.quantity
     where id = OLD.product_id;
  END IF;

  IF NEW.item_type = 'producto' THEN
    select price into v_price from public.products where id = NEW.product_id;
    if v_price is null then
      raise exception 'Producto no encontrado para id=%', NEW.product_id;
    end if;
    NEW.unit_price := v_price;
    NEW.total := v_price * NEW.quantity;

    update public.products
       set stock = stock - NEW.quantity
     where id = NEW.product_id
       and stock >= NEW.quantity;

    if not found then
      IF OLD.item_type = 'producto' THEN
        update public.products
           set stock = stock - OLD.quantity
         where id = OLD.product_id;
      END IF;
      raise exception 'No hay stock suficiente para product_id=% (qty=%) en UPDATE.', NEW.product_id, NEW.quantity
        using errcode = '23514';
    end if;
  END IF;

  return NEW;
end $function$;

CREATE OR REPLACE FUNCTION public.adjust_stock_on_delete()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  IF OLD.item_type = 'producto' THEN
    update public.products
       set stock = stock + OLD.quantity
     where id = OLD.product_id;
  END IF;

  return OLD;
end $function$;

CREATE OR REPLACE FUNCTION public.set_price_on_insert()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  v_price numeric;
begin
  -- Only auto-set price for products
  IF NEW.item_type = 'producto' THEN
    select price into v_price
    from public.products
    where id = NEW.product_id;

    NEW.unit_price := v_price;
    NEW.total_price := v_price * NEW.quantity;
  END IF;

  return NEW;
end;
$function$;
