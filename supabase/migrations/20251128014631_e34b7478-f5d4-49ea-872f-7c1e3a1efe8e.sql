-- Add subcategory column to products table
ALTER TABLE public.products 
ADD COLUMN subcategory text;