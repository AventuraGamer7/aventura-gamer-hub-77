ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_variants jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.product_images ADD COLUMN IF NOT EXISTS variants jsonb;
COMMENT ON COLUMN public.products.image_variants IS 'Array of {original, thumb, medium, large} URLs for pre-transformed WebP variants. Replaces on-the-fly Supabase image transformations.';
COMMENT ON COLUMN public.product_images.variants IS 'Object with {original, thumb, medium, large} URLs for this image.';