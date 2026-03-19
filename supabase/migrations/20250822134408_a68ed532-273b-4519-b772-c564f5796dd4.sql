-- Create hero_slides table
CREATE TABLE public.hero_slides (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  subtitle text NOT NULL,
  description text NOT NULL,
  button_text text NOT NULL,
  button_url text NOT NULL,
  image_url text NOT NULL,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Enable RLS
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Allow admins and superadmins to manage all hero slides
CREATE POLICY "Admin can manage hero slides"
ON public.hero_slides FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
  AND role IN ('admin'::user_role, 'superadmin'::user_role)
));

-- Allow everyone to view active slides
CREATE POLICY "Everyone can view active hero slides"
ON public.hero_slides FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_hero_slides_updated_at
  BEFORE UPDATE ON public.hero_slides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();