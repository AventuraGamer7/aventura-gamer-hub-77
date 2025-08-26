-- Add shipping tracking fields to orders table
ALTER TABLE public.orders 
ADD COLUMN shipping_status text DEFAULT 'pending',
ADD COLUMN shipping_address text,
ADD COLUMN tracking_number text,
ADD COLUMN estimated_delivery timestamp with time zone,
ADD COLUMN shipped_at timestamp with time zone,
ADD COLUMN delivered_at timestamp with time zone;

-- Create enum for shipping status
CREATE TYPE shipping_status_enum AS ENUM (
  'pending',
  'processing', 
  'shipped',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'cancelled'
);

-- Update the column to use the enum
ALTER TABLE public.orders 
ALTER COLUMN shipping_status TYPE shipping_status_enum 
USING shipping_status::shipping_status_enum;

-- Add policies for customers to view their order details
CREATE POLICY "Users can view their order shipping details" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create an index for better performance on user orders
CREATE INDEX idx_orders_user_id_created_at ON public.orders(user_id, created_at DESC);