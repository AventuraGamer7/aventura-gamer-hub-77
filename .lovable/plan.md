
# Diagnóstico — Cached Egress excedido

Storage total: **336 MB** en `product-images`. El problema NO es el volumen almacenado, es lo que se **descarga** cada vez que un visitante abre la tienda.

## Causas confirmadas

1. **265 de 407 productos** (65%) tienen `image` apuntando a un JPG/PNG **original sin variante** (algunos de 3–11 MB). Cada visita al inicio/tienda descarga megas por producto.
2. **66 archivos en `migrated/`** suman **111 MB**, con originales de hasta **11 MB** cada uno, servidos tal cual (varios están duplicados exactos, mismo tamaño).
3. **116 archivos con `cacheControl: max-age=3600`** (1 hora) — el CDN los re-descarga cada hora en cada región, multiplicando el egress. Los WebP nuevos ya usan `immutable, 1 año`; los antiguos no.
4. Todas las variantes existen en DB (`image_variants` está lleno en los 407 productos) — pero `products.image` sigue apuntando al JPG original en 265 casos, así que `OptimizedImage` sirve el pesado cuando no recibe `variants`.

## Impacto estimado

Cambiando esos 265 productos de JPG original (~1–3 MB promedio) a `__medium.webp` (~40–80 KB) el egress por vista de catálogo cae **~95%**.

# Plan

## Fase 1 — Reescritura masiva de URLs (impacto inmediato, sin borrar nada)
Migración SQL que, para cada producto que tenga `image_variants.medium`, actualiza:
- `products.image` → `image_variants->>'medium'`
- `products.images[i]` → variante medium correspondiente cuando exista
- Igual para `product_images.image_url` cuando haya variante disponible

Los archivos originales quedan en el bucket (no se borran en esta fase) por seguridad — pero dejan de servirse.

## Fase 2 — Extender cache a los archivos antiguos
Edge function one-shot que recorre `storage.objects` en `product-images` y, para todo archivo con `cacheControl != 'max-age=31536000, immutable'`, hace `update()` fijando el header largo. Esto vale para JPG viejos que sigan sirviéndose por si algún link externo los referencia. Sin re-subida.

## Fase 3 — Auditoría y purga de originales huérfanos
1. Detectar archivos en `product-images/products/*.jpg|png` y `migrated/*` que **ya no** aparecen en `products.image`, `products.images`, `product_images.image_url`, ni `media_library.url` tras la Fase 1.
2. Borrar solo los huérfanos (dry-run primero, con listado).
3. Detectar duplicados exactos en `migrated/` (mismo tamaño+prefijo) y consolidar.

## Fase 4 — Prevención (código)
- En `OptimizedImage` añadir fallback: si `src` apunta a `.jpg`/`.png` en `product-images` y no llegan `variants`, intentar cargar automáticamente la variante `__medium.webp` derivada del mismo path. Log a consola si falla, para detectar productos que quedaron sin migrar.
- En `AddProductForm` y `ProductManagementPanel`, bloquear guardar `image` como URL de original cuando existan variantes (ya se hace en teoría, pero validar).

## Verificación
Después de Fase 1+2, revisar el gráfico de **Cached Egress** en Supabase durante 24–48 h: debe caer drásticamente. La Fase 3 reduce storage (~150 MB liberados estimados) pero no afecta egress.

# Detalles técnicos

- Fase 1 es una sola migración SQL — reversible con backup previo del campo `image` a una columna temporal `image_legacy` si prefieres safety net.
- Fase 2 usa `supabase.storage.from('product-images').update(path, blob, { cacheControl })` — requiere re-leer el blob. Alternativa más barata: `UPDATE storage.objects SET metadata = jsonb_set(metadata,'{cacheControl}','"max-age=31536000, immutable"') WHERE bucket_id='product-images'`. El header real en el CDN sí se respeta desde `metadata->>'cacheControl'`.
- Todas las variantes ya existen en `image_variants` (verificado: 407/407 productos las tienen).

# Confirmación

Dime cuáles fases ejecuto:
- **Solo Fase 1** (impacto ~95%, cero riesgo, 2 min)
- **Fase 1 + 2** (recomendado — el resto del efecto para links externos)
- **Todas** (incluye liberar ~150 MB de storage borrando huérfanos)
