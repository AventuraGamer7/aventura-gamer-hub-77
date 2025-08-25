-- Add badge customization columns to products table
ALTER TABLE public.products 
ADD COLUMN badge_text text,
ADD COLUMN badge_color text DEFAULT 'primary';