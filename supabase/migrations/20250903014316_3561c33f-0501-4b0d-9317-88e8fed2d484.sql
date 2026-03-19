-- Create rewards table
CREATE TABLE public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  xp_cost INTEGER NOT NULL,
  icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gamification rules table
CREATE TABLE public.gamification_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_type TEXT NOT NULL, -- 'purchase', 'social_post', 'level_threshold', 'special_event'
  rule_name TEXT NOT NULL,
  description TEXT,
  xp_amount INTEGER NOT NULL,
  threshold_value NUMERIC, -- For purchase amounts or level thresholds
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table  
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  xp_reward INTEGER NOT NULL,
  condition_type TEXT NOT NULL, -- 'purchase_count', 'social_posts', 'xp_threshold', 'custom'
  condition_value INTEGER, -- Target value for the condition
  icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for rewards
CREATE POLICY "Everyone can view active rewards" 
ON public.rewards 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage rewards" 
ON public.rewards 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('admin', 'superadmin')
));

-- Create policies for gamification_rules
CREATE POLICY "Admins can view all rules" 
ON public.gamification_rules 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('admin', 'superadmin', 'employee')
));

CREATE POLICY "Admins can manage rules" 
ON public.gamification_rules 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('admin', 'superadmin')
));

-- Create policies for achievements
CREATE POLICY "Everyone can view active achievements" 
ON public.achievements 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage achievements" 
ON public.achievements 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('admin', 'superadmin')
));

-- Insert default rules
INSERT INTO public.gamification_rules (rule_type, rule_name, description, xp_amount, threshold_value) VALUES
('purchase', 'Compras', 'XP Coins por cada $20,000 en compras', 2, 20000),
('social_post', 'Publicaciones Sociales', 'XP Coins por publicación en redes sociales', 2, 1),
('level_threshold', 'Nivel Novato', 'XP mínimo para nivel Novato', 0, 30),
('level_threshold', 'Nivel ProGamer', 'XP mínimo para nivel ProGamer', 0, 60),
('level_threshold', 'Nivel Élite', 'XP mínimo para nivel Élite', 0, 90),
('level_threshold', 'Nivel Maestro', 'XP mínimo para nivel Maestro', 0, 120);

-- Insert default achievements
INSERT INTO public.achievements (name, description, xp_reward, condition_type, condition_value, icon) VALUES
('Primera Compra', 'Realiza tu primera compra en AventuraGamer', 2, 'purchase_count', 1, 'ShoppingCart'),
('Influencer Gamer', 'Haz tu primer post etiquetando @AventuraGamer', 2, 'social_posts', 1, 'Share2'),
('Rango Novato', 'Alcanza 30 XP Coins', 5, 'xp_threshold', 30, 'Award'),
('Rango ProGamer', 'Alcanza 60 XP Coins', 10, 'xp_threshold', 60, 'Crown');

-- Insert default rewards
INSERT INTO public.rewards (name, description, xp_cost, icon) VALUES
('Descuento 5%', 'Descuento del 5% en tu próxima compra', 20, 'Percent'),
('Descuento 10%', 'Descuento del 10% en tu próxima compra', 40, 'Percent'),
('Envío Gratis', 'Envío gratuito en tu próxima compra', 30, 'Truck'),
('Producto Exclusivo', 'Acceso a productos exclusivos para miembros', 60, 'Star');

-- Create triggers for updated_at
CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON public.rewards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gamification_rules_updated_at
  BEFORE UPDATE ON public.gamification_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON public.achievements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();