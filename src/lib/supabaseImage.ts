/**
 * Image URL helpers.
 *
 * IMPORTANTE: Ya NO usamos `supabase.storage.getPublicUrl({ transform })`
 * porque consume cuota de "Image Transformations" del plan Pro de Supabase.
 * En su lugar generamos variantes estáticas (thumb/medium/large) al momento
 * de subir la imagen, y este módulo solo elige cuál servir.
 *
 * Estructura recomendada en Storage:
 *   product-images/products/<timestamp>-<rand>.webp           (medium, default)
 *   product-images/products/<timestamp>-<rand>__thumb.webp
 *   product-images/products/<timestamp>-<rand>__large.webp
 *   product-images/products/<timestamp>-<rand>__original.<ext>
 */

import { supabase } from '@/integrations/supabase/client';

export const IMAGE_CACHE_CONTROL = '31536000, immutable';

export interface ImageVariants {
  original: string;
  thumb: string;
  medium: string;
  large: string;
}

export interface OptimizedImageOptions {
  width?: number;
  height?: number;
  quality?: number;
}

/**
 * Devuelve la URL "tal cual" para imágenes que no tienen variantes pre-generadas.
 * (Ya no aplicamos transformaciones de Supabase.)
 */
export function getOptimizedImageUrl(url: string | null | undefined, _opts: OptimizedImageOptions = {}): string {
  return url || '';
}

/**
 * Elige la variante adecuada según el ancho objetivo.
 */
export function pickVariant(variants: ImageVariants | null | undefined, targetWidth?: number): string | null {
  if (!variants) return null;
  const w = targetWidth ?? 640;
  if (w <= 320) return variants.thumb || variants.medium || variants.large || variants.original;
  if (w <= 800) return variants.medium || variants.large || variants.original;
  return variants.large || variants.original || variants.medium;
}

/**
 * Construye un srcset desde variantes pre-generadas.
 */
export function buildSrcSetFromVariants(variants: ImageVariants | null | undefined): string {
  if (!variants) return '';
  const parts: string[] = [];
  if (variants.thumb) parts.push(`${variants.thumb} 240w`);
  if (variants.medium) parts.push(`${variants.medium} 640w`);
  if (variants.large) parts.push(`${variants.large} 1280w`);
  return parts.join(', ');
}

/** Sube un Blob al bucket indicado con cache largo + immutable. */
export async function uploadImageBlob(
  bucket: string,
  path: string,
  blob: Blob,
  contentType = 'image/webp',
): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, blob, {
    cacheControl: IMAGE_CACHE_CONTROL,
    contentType,
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/** Compat: anchos por defecto (no se usan para transformación, solo como hint). */
export const DEFAULT_WIDTHS = [320, 640, 1280];

/** Compat: srcset legacy — devuelve solo la url original (sin transformar). */
export function buildSrcSet(url: string, _widths: number[] = DEFAULT_WIDTHS): string {
  return url;
}
