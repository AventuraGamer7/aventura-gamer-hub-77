-- Create enum for shipping status first
CREATE TYPE shipping_status_enum AS ENUM (
  'pending',
  'processing', 
  'shipped',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'cancelled'
);

-- Add shipping tracking fields to orders table
ALTER TABLE public.orders 
ADD COLUMN shipping_status shipping_status_enum DEFAULT 'pending',
ADD COLUMN shipping_address text,
ADD COLUMN tracking_number text,
ADD COLUMN estimated_delivery timestamp with time zone,
ADD COLUMN shipped_at timestamp with time zone,
ADD COLUMN delivered_at timestamp with time zone;

-- Create an index for better performance on user orders
CREATE INDEX idx_orders_user_id_created_at ON public.orders(user_id, created_at DESC);