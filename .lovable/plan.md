## Estado de Fase 1 y Fase 2

Sí, ambas fases ya están implementadas:

- **Fase 1 (mitigación)**: `getOptimizedImageUrl` en `src/lib/supabaseImage.ts` ya no llama a `supabase.storage.getPublicUrl({ transform })`. Devuelve URLs estáticas. Esto ya detuvo el consumo de cuota de Image Transformations.
- **Fase 2 (definitiva)**: `src/lib/imageProcessing.ts` genera 3 variantes WebP (240/640/1280) en el navegador con Canvas. `ProductImageUploader` sube las 4 versiones (original + thumb + medium + large) al bucket con `cacheControl: '31536000, immutable'`. `OptimizedImage` arma `srcset` desde las variantes estáticas.

Resultado: **0 transformaciones nuevas** en cada carga/render. La cuota dejará de crecer en este ciclo y se reseteará el próximo.

> Nota: las imágenes **antiguas** seguirán mostrándose con su URL cruda (sin transformar, así que tampoco gastan cuota). Para optimizarlas hay que re-subirlas desde el panel.

---

## Bug al subir imagen manual en Gestión de Productos

Encontré **dos causas reales**, ambas se arreglan en este plan:

### Causa 1 — Política de Storage rechaza al rol `admin` y `manager`
La policy INSERT del bucket `product-images` solo permite `superadmin` y `employee`:

```
bucket_id = 'product-images' AND role IN ('superadmin','employee')
```

Si el usuario logueado es `admin` o `manager` (que sí pueden gestionar productos por las RLS de la tabla `products`), la subida al Storage falla con un error de RLS y aparece el toast "No se pudo procesar/subir la imagen". Además **no hay policies de UPDATE/DELETE** para `product-images`, por lo que tampoco se podrían sobrescribir/borrar.

**Migración**: reemplazar las policies del bucket `product-images` para que incluyan `superadmin`, `admin`, `manager`, `employee` en INSERT/UPDATE/DELETE.

### Causa 2 — `image_variants` no se guarda al editar
En `ProductManagementPanel.handleUpdate` el `supabase.update({...})` **no incluye** `image_variants`. Resultado: el uploader genera y sube las variantes, las pinta en pantalla, pero al guardar el producto se pierden y la próxima vez se vuelve a servir la URL cruda.

**Fix**: agregar `image_variants: editingProduct.image_variants || []` al objeto del `update`.

---

## Cambios concretos

### 1. Migración SQL (storage policies)
```sql
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;

CREATE POLICY "Staff can upload product images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND public.get_current_user_role() IN ('superadmin','admin','manager','employee')
);

CREATE POLICY "Staff can update product images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'product-images'
  AND public.get_current_user_role() IN ('superadmin','admin','manager','employee')
);

CREATE POLICY "Staff can delete product images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'product-images'
  AND public.get_current_user_role() IN ('superadmin','admin','manager','employee')
);
```

### 2. `src/components/ProductManagementPanel.tsx` (handleUpdate)
Añadir `image_variants` al payload del update para que persistan las variantes generadas al editar.

### 3. Validación
- Probar subida manual con cuenta admin → debe terminar sin error y mostrar el badge "WebP ×3".
- Recargar el producto → las variantes siguen ahí y `OptimizedImage` usa `srcset`.
- Verificar en Dashboard de Supabase que el contador de Image Transformations ya no sube.

## Detalles técnicos

- No se toca `AddProductForm` (ya guarda `image_variants` al crear).
- No se modifica `supabaseImage.ts` ni `OptimizedImage.tsx` (ya están correctos).
- Las imágenes legacy sin variantes siguen funcionando vía fallback al `src` crudo.
