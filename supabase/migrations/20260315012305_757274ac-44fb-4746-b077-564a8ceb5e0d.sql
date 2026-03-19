
-- Add slug column
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug text;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique ON public.products (slug);

-- Function to generate slug from name
CREATE OR REPLACE FUNCTION public.generate_slug(input_text text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  slug text;
BEGIN
  -- Lowercase, replace non-alphanumeric with hyphens, trim hyphens
  slug := lower(input_text);
  slug := regexp_replace(slug, '[^a-z0-9\s-]', '', 'g');
  slug := regexp_replace(slug, '[\s]+', '-', 'g');
  slug := regexp_replace(slug, '-+', '-', 'g');
  slug := trim(both '-' from slug);
  RETURN slug;
END;
$$;

-- Populate existing products with slugs
UPDATE public.products 
SET slug = generate_slug(name) || '-' || left(id::text, 8)
WHERE slug IS NULL;

-- Trigger to auto-generate slug on insert/update
CREATE OR REPLACE FUNCTION public.set_product_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Only generate if slug is null or name changed
  IF NEW.slug IS NULL OR (TG_OP = 'UPDATE' AND OLD.name IS DISTINCT FROM NEW.name AND NEW.slug = OLD.slug) THEN
    base_slug := generate_slug(NEW.name);
    final_slug := base_slug;
    
    -- Check for duplicates
    LOOP
      IF NOT EXISTS (SELECT 1 FROM public.products WHERE slug = final_slug AND id != NEW.id) THEN
        EXIT;
      END IF;
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    
    NEW.slug := final_slug;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER set_product_slug_trigger
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.set_product_slug();
