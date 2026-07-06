## Diagnóstico

El recurso excedido es **Storage** (límite del plan free: 1 GB).

| Bucket | Archivos | Tamaño | Problema |
|---|---|---|---|
| `product-images` | 750 | **979 MB** | Muchos PNG grandes (432 archivos PNG, avg 1.37 MB, máx 6.4 MB). Sin compresión. |
| `imagenes` | 89 | **221 MB** | Fotos crudas de WhatsApp/cámara: **11 archivos entre 7 y 19 MB** sin comprimir. Bucket poco usado. |
| `product images` (con espacio) | 17 | 2.8 MB | Bucket duplicado, huérfano. |
| `service-orders` | 2 | 144 KB | OK. |
| **Total** | 858 | **~1.20 GB** | **20 % por encima del límite**. |

Referencias en DB: **812 URLs** apuntan a objetos, hay **~46 archivos huérfanos** que ya no usa nadie.

## Plan de corrección (por impacto)

### 1. Auditar y eliminar huérfanos (rápido, ~50-100 MB)
- Cruzar `storage.objects` contra: `products.image`, `products.images`, `product_images.image_url`, `media_library.url`.
- Listar los archivos no referenciados en los 3 buckets grandes.
- **Antes de borrar**, mostrarte el listado para tu aprobación (por seguridad).

### 2. Limpiar bucket `imagenes` (~180 MB recuperables)
- Los 11 archivos > 7 MB son fotos crudas (`IMG-20260113-...`, `17741...`). Auditar cuáles están en uso real.
- Los no usados → borrar directo.
- Los usados → recomprimir a WebP ≤ 500 KB y reemplazar la URL en `media_library` / `products`.

### 3. Consolidar bucket duplicado `product images` (~3 MB)
- Mover los 17 archivos a `product-images` y actualizar referencias.
- Eliminar el bucket "product images" (con espacio, error de nombre).

### 4. Comprimir imágenes grandes de `product-images` (~200-300 MB recuperables)
- Detectar todos los archivos > 800 KB (probablemente ~150 objetos).
- Script batch: descargar → recomprimir con `sharp` a WebP calidad 82, máx 1600 px → subir con mismo path (extensión .webp) → actualizar URLs en DB.
- Meta: llevar `product-images` de 979 MB → ~400 MB.

### 5. Prevención (para que no vuelva a pasar)
- En `ProductImageUploader` y `SubidaMasivaImagenes`: agregar compresión **client-side** con `browser-image-compression`:
  - Máx 1600 px, calidad 0.82, formato WebP.
  - Rechazar archivos que después de comprimir sigan > 1.5 MB.
- Actualizar el límite del bucket (policy) a **2 MB por archivo**.
- Migración SQL: hacer que `imagenes` sea privado o eliminarlo si ya no se usa (para que nadie suba ahí por error).

## Resultado esperado

| Antes | Después |
|---|---|
| 1.20 GB | ~600 MB |
| 3 buckets con imágenes | 2 buckets (`product-images` + `service-orders`) |
| Sin compresión | WebP forzado en subida |

Queda con margen para crecer al doble antes de volver a tocar la cuota.

## Archivos a tocar (fase de código)
- `src/components/ProductImageUploader.tsx` — compresión client-side.
- `src/components/SubidaMasivaImagenes.tsx` — compresión client-side + rechazo de archivos grandes.
- Nuevo: `scripts/compress-storage.ts` — script batch para recomprimir lo ya subido (se corre 1 vez).
- Migración SQL: actualizar límites de bucket, opcionalmente eliminar `imagenes` y `product images`.

## Decisiones que necesito de ti antes de ejecutar

1. **¿Puedo borrar los huérfanos automáticamente** (después de mostrarte la lista) o prefieres borrar tú manualmente desde el dashboard?
2. **Bucket `imagenes`**: ¿lo usas para algo específico (ej. carga masiva de WhatsApp)? Si no, lo eliminamos.
3. **Bucket `product images` (con espacio)**: ¿confirmas que puedo consolidarlo en `product-images` y eliminarlo?
4. ¿Ejecutamos la fase 5 (compresión client-side) ya para prevenir, aunque la limpieza retroactiva la hagamos en pasos separados?
