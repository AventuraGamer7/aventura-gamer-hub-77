-- Expandir la tabla courses para incluir campos completos de gestión
ALTER TABLE public.courses 
ADD COLUMN duration_weeks integer DEFAULT 4,
ADD COLUMN level text DEFAULT 'principiante',
ADD COLUMN estimated_students integer DEFAULT 0,
ADD COLUMN has_certification boolean DEFAULT false,
ADD COLUMN curriculum jsonb DEFAULT '[]'::jsonb,
ADD COLUMN requirements jsonb DEFAULT '[]'::jsonb,
ADD COLUMN includes jsonb DEFAULT '[]'::jsonb,
ADD COLUMN learning_outcomes jsonb DEFAULT '[]'::jsonb;

-- Comentarios para documentar la estructura
COMMENT ON COLUMN public.courses.curriculum IS 'Estructura: [{"module": "Nombre", "lessons": [{"title": "Lección", "duration": 60, "description": "..."}]}]';
COMMENT ON COLUMN public.courses.requirements IS 'Array de strings con requisitos del curso';
COMMENT ON COLUMN public.courses.includes IS 'Array de strings con lo que incluye el curso';
COMMENT ON COLUMN public.courses.learning_outcomes IS 'Array de strings con lo que aprenderás';