/**
 * Supabase Storage image optimization helpers.
 *
 * Goals:
 *  - Reduce Cached Egress by serving small, transformed (WebP) images per breakpoint.
 *  - Provide a single helper used by <OptimizedImage /> and any code that builds <img> tags.
 *
 * Recommended bucket structure:
 *   product-images/products/<id>/<file>
 *   product-images/banners/<file>
 *   course-covers/courses/<id>/<file>
 *   service-images/services/<id>/<file>
 *
 * Recommended upload options (admin):
 *   supabase.storage.from(bucket).upload(path, file, {
 *     cacheControl: '31536000, immutable',
 *     contentType: file.type,
 *     upsert: false,
 *   })
 */

import { supabase } from '@/integrations/supabase/client';

export const IMAGE_CACHE_CONTROL = '31536000, immutable';

export type ImageFormat = 'webp' | 'origin';

export interface OptimizedImageOptions {
  width?: number;
  height?: number;
  quality?: number; // 20-100
  resize?: 'cover' | 'contain' | 'fill';
  format?: ImageFormat;
}

/**
 * Detect a Supabase Storage public URL and return its `bucket` + `path`.
 * Returns null for any non-Supabase URL (external CDN, placeholder, blob:, etc.).
 */
function parseSupabasePublicUrl(url: string): { bucket: string; path: string } | null {
  if (!url) return null;
  const marker = '/storage/v1/object/public/';
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const tail = url.slice(idx + marker.length);
  const slash = tail.indexOf('/');
  if (slash === -1) return null;
  return {
    bucket: decodeURIComponent(tail.slice(0, slash)),
    path: decodeURIComponent(tail.slice(slash + 1).split('?')[0]),
  };
}

/**
 * Returns a transformed (and cacheable) image URL when possible.
 * Falls back to the original URL for non-Supabase sources.
 */
export function getOptimizedImageUrl(url: string | null | undefined, opts: OptimizedImageOptions = {}): string {
  if (!url) return '';
  const parsed = parseSupabasePublicUrl(url);
  if (!parsed) return url; // external / unknown

  const { width, height, quality = 75, resize = 'contain', format = 'webp' } = opts;

  const { data } = supabase.storage.from(parsed.bucket).getPublicUrl(parsed.path, {
    transform: {
      width,
      height,
      quality,
      resize,
      format: format === 'origin' ? 'origin' : undefined, // 'webp' is the default served by transform
    },
  });

  return data.publicUrl;
}

/**
 * Build a srcset string for responsive images.
 */
export function buildSrcSet(url: string, widths: number[], opts: Omit<OptimizedImageOptions, 'width'> = {}): string {
  return widths
    .map((w) => `${getOptimizedImageUrl(url, { ...opts, width: w })} ${w}w`)
    .join(', ');
}

/** Default responsive widths for product cards / thumbs. */
export const DEFAULT_WIDTHS = [160, 240, 320, 480, 640, 960];
