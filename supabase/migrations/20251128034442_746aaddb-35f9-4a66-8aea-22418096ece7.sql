-- Cambiar el campo subcategory de texto simple a array de texto
-- Esto permitirá que cada producto tenga múltiples subcategorías

-- Primero, crear una columna temporal para migrar los datos existentes
ALTER TABLE products ADD COLUMN subcategory_temp text[];

-- Migrar datos existentes (convertir texto a array de un elemento)
UPDATE products 
SET subcategory_temp = ARRAY[subcategory]::text[]
WHERE subcategory IS NOT NULL AND subcategory != '';

-- Eliminar la columna antigua
ALTER TABLE products DROP COLUMN subcategory;

-- Renombrar la columna temporal
ALTER TABLE products RENAME COLUMN subcategory_temp TO subcategory;

-- Agregar índice para mejorar rendimiento en búsquedas
CREATE INDEX idx_products_subcategory ON products USING GIN(subcategory);

-- Comentario descriptivo
COMMENT ON COLUMN products.subcategory IS 'Array de subcategorías asignadas al producto, permitiendo clasificación múltiple';