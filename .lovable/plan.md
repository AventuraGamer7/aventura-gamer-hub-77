# Auditoría de la sección Cursos

## 1. Hallazgos actuales

### Panel de administración (`CourseManagementPanel.tsx`)
- El editor tiene **5 pestañas** (General, Temario, Requisitos, Incluye, Aprenderás) y obliga a rellenar cada una por separado → sensación de "vacío / incompleto".
- El **temario está sobre-estructurado**: Módulo → Lecciones (título + duración en minutos + descripción). Para un negocio de cursos presenciales de reparación gaming esto es exagerado; el admin no quiere capturar minutos por lección.
- No hay guardado por pestaña ni indicador de progreso; se guarda todo al final.
- El formulario de **creación** (`AddCourseForm.tsx`) sólo pide 4 campos básicos y no permite cargar temario / requisitos → obliga a crear y volver a editar.
- Portada solo por URL (no reutiliza el `ProductImageUploader` con compresión WebP que ya existe).
- Convive con `ManagementPanel.tsx` genérico que también edita cursos → duplicación.

### Vista pública
- `Cursos.tsx`: 4 pestañas de categorías con **el mismo bloque de tarjeta copiado 4 veces** (~400 líneas duplicadas). Filtrado por keywords en título/descripción (frágil).
- Tarjetas no muestran duración, nivel, ni número de estudiantes → poca información antes del click.
- Hero genérico, sin sección de beneficios visible (aunque `benefits` está declarado, nunca se renderiza).
- `CourseDetails.tsx`: mezcla datos reales con **mock data** de fallback (módulos, skills, requirements) → si el admin no llena todo, se ve información inventada.
- Sidebar de precio no es sticky; en scroll largo el CTA desaparece.
- Imagen hero usa `object-scale-down` con fondo `bg-muted` → se ve pequeña y desalineada.

## 2. Plan propuesto

### A. Simplificar el editor de cursos (prioridad alta)

Reemplazar las 5 pestañas por un **formulario de una sola vista con secciones colapsables**, unificando creación y edición en el mismo componente `CourseEditor`:

```text
┌─ Portada + Info básica ─────────────────┐
│ [imagen] Título | Precio | Nivel        │
│          Duración (semanas) | Cert ☑    │
│          Descripción corta              │
└─────────────────────────────────────────┘
┌─ Temario (simplificado) ────────────────┐
│ • Módulo 1: [texto]              [x]    │
│ • Módulo 2: [texto]              [x]    │
│ [+ Agregar módulo]                      │
│ (Opcional: "Ver detalle" abre lecciones)│
└─────────────────────────────────────────┘
┌─ Listas rápidas (chips editables) ──────┐
│ Lo que aprenderás  [+]                  │
│ Requisitos         [+]                  │
│ Qué incluye        [+]                  │
└─────────────────────────────────────────┘
```

Cambios concretos:
1. Nuevo componente `CourseEditor.tsx` que soporta modo `create` y `edit`.
2. Temario simplificado: por defecto solo **título del módulo**. La estructura anidada Módulo→Lecciones→minutos pasa a un panel avanzado plegado ("Detallar lecciones") oculto por defecto.
3. Listas (`requirements`, `includes`, `learning_outcomes`) se editan como **chips** con Enter (patrón ya usado en el editor de productos) en vez de arrays con inputs individuales.
4. Portada usa el `ProductImageUploader` existente (compresión WebP, bucket `product-images`) en vez de campo URL.
5. Botones "Guardar" y "Guardar y ver curso" arriba a la derecha, siempre visibles.
6. Eliminar `AddCourseForm.tsx` y la rama de cursos en `ManagementPanel.tsx` para no duplicar.

### B. Rediseño de la vista pública

**`Cursos.tsx` (listado):**
- Extraer una única `<CourseCard />` reutilizable → elimina las 4 copias.
- Reemplazar Tabs de categorías por **chips horizontales** (más limpio, coherente con la tienda Amazon-style).
- Añadir en cada tarjeta: badge de nivel, duración (semanas), estudiantes, "Certificado ✓" si aplica.
- Añadir sección **"¿Por qué aprender con nosotros?"** justo debajo del hero renderizando el array `benefits` que ya existe pero no se usa.
- Grid: 1 columna móvil / 2 tablet / 3 desktop (más denso, menos scroll).

**`CourseDetails.tsx`:**
- Eliminar el **mock data** completo. Si un campo está vacío, ocultar la sección (no inventar contenido).
- Hero: layout 2 columnas con imagen `object-cover` a `aspect-video`, badges de nivel + duración + certificado sobre la imagen.
- **Sidebar sticky** con precio y CTA "Inscribirse" que acompaña el scroll.
- Temario como **acordeón**: cada módulo se expande para ver lecciones (si existen). Muestra total de módulos y horas al inicio.
- Añadir sección "Instructor" y "Preguntas frecuentes" (opcionales, ocultas si vacías) preparando futuros campos.

### C. Consolidación
- Borrar rama `type === 'courses'` de `ManagementPanel.tsx`.
- Borrar `AddCourseForm.tsx`.
- Dashboard admin queda solo con `CourseManagementPanel` (renombrado internamente a usar `CourseEditor`).

## 3. Detalles técnicos

- **Sin cambios de esquema DB**: se mantienen `curriculum`, `requirements`, `includes`, `learning_outcomes`. El temario simplificado guarda `[{ module: "...", lessons: [] }]`; el panel avanzado sigue soportando lecciones detalladas.
- Reutilizar `ProductImageUploader` para portada → aprovecha compresión WebP ya implementada (evita seguir engordando storage).
- `useCourses` no requiere cambios.
- `Cursos.tsx` pasa de ~433 líneas a ~150 al extraer `CourseCard`.
- `CourseDetails.tsx` pasa de ~450 a ~250 al eliminar mocks y duplicaciones.

## 4. Preguntas antes de implementar

1. ¿El temario debe seguir permitiendo **lecciones con duración en minutos** (en panel avanzado), o quieres eliminar completamente ese nivel y quedarte solo con módulos?
2. ¿Los chips de categorías del listado deben mantener las mismas 4 (Todos/Reparación/Mantenimiento/Avanzado), o prefieres una tabla `course_categories` real en DB?
3. ¿Prefieres arrancar por **A (editor admin)** o por **B (vista pública)**, o hago las dos en una sola tanda?
