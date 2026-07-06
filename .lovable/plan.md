## Cambios

### 1. `public/robots.txt` — desbloquear sitemap
Quitar la línea `Disallow: /*.xml$` que estaba bloqueando `/sitemap.xml` a los crawlers. Se mantiene `Disallow: /*.json$` y el resto.

### 2. `index.html` — idioma, keywords, og:image y fuentes
- `<html lang="en">` → `<html lang="es-CO">`
- Eliminar `<meta name="keywords">` (Google la ignora).
- Reducir Google Fonts de 5 familias / ~30 pesos a 3 familias / 6 pesos:
  - **Antes**: Inter (6 pesos) + Bungee + Orbitron (5 pesos) + Rajdhani (5 pesos) + Press Start 2P
  - **Después**: `Inter:wght@400;600;700` + `Orbitron:wght@400;700` + `Press Start 2P`
  - Ahorro estimado: ~250-350 KB en primera carga.
- Agregar `<meta property="og:image">` y `twitter:image` apuntando a la imagen generada (1216×640, ya guardada en `src/assets/og-image.jpg`). La pondré también accesible desde una ruta pública para que crawlers la lean (copia a `public/og-image.jpg`).

### 3. `tailwind.config.ts` — limpiar fontFamily
- Quitar `bungee` (0 usos en código).
- `rajdhani` → alias de `Inter` (solo 2 usos en `Privacidad.tsx`; visualmente queda casi igual con Inter 400).
- Mantener `gaming`, `orbitron`, `mario` (sí están en uso).

### 4. Imagen og ya generada
- `src/assets/og-image.jpg` (1216×640, ~Aventura Gamer + tagline + ubicación). La copio a `public/og-image.jpg` para servirla en una URL estable.

## Archivos a tocar
- `public/robots.txt` (1 línea menos)
- `index.html` (lang, meta keywords, og:image, twitter:image, link de fuentes)
- `tailwind.config.ts` (4 líneas en fontFamily)
- `public/og-image.jpg` (nuevo, copia del asset)

## Lo que NO se toca
- Lógica de Helmet por ruta (canonical estático queda por ahora — eso era el punto 9, no pediste).
- Mercado Pago SDK y `React.lazy()` (puntos 4 y 5, los dejamos para otra tanda).
- Estilos visuales: la sustitución de `Rajdhani` por `Inter` afecta solo a 2 párrafos en `Privacidad`.

## Validación
- Build sin warnings de Tailwind.
- `view-source:` del preview muestra `lang="es-CO"`, og:image presente, sin `keywords`.
- `robots.txt` accesible y sin `Disallow: /*.xml$`.
- Previa social en herramientas tipo opengraph.xyz muestra la imagen.
