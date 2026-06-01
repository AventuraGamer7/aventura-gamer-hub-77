/**
 * Browser-side image pre-processing.
 *
 * Genera variantes WebP (thumb 240, medium 640, large 1280) usando Canvas
 * antes de subir a Supabase Storage. Reemplaza las transformaciones on-the-fly
 * (que tienen cuota limitada) por archivos estáticos cacheables en CDN.
 */

export type VariantKey = 'thumb' | 'medium' | 'large';

export interface VariantSpec {
  key: VariantKey;
  maxWidth: number;
  quality: number;
}

export const VARIANT_SPECS: VariantSpec[] = [
  { key: 'thumb', maxWidth: 240, quality: 0.7 },
  { key: 'medium', maxWidth: 640, quality: 0.78 },
  { key: 'large', maxWidth: 1280, quality: 0.82 },
];

export interface ProcessedVariants {
  original: Blob;
  thumb: Blob;
  medium: Blob;
  large: Blob;
}

async function loadBitmap(file: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file);
    } catch {
      // fallthrough
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    return img;
  } finally {
    // Image still holds the src; revoke later if needed (caller draws sync)
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

function getDims(src: ImageBitmap | HTMLImageElement): { w: number; h: number } {
  if ('width' in src && 'height' in src) {
    return { w: (src as any).width, h: (src as any).height };
  }
  return { w: 0, h: 0 };
}

async function resizeToWebp(
  src: ImageBitmap | HTMLImageElement,
  maxWidth: number,
  quality: number,
): Promise<Blob> {
  const { w, h } = getDims(src);
  const ratio = w > maxWidth ? maxWidth / w : 1;
  const targetW = Math.max(1, Math.round(w * ratio));
  const targetH = Math.max(1, Math.round(h * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(src as CanvasImageSource, 0, 0, targetW, targetH);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
      'image/webp',
      quality,
    );
  });
}

/**
 * Procesa un archivo de imagen y devuelve las 3 variantes WebP + el original.
 * Si el navegador no soporta WebP, las variantes saldrán como PNG/JPEG.
 */
export async function processImageVariants(file: File): Promise<ProcessedVariants> {
  const bitmap = await loadBitmap(file);
  const [thumb, medium, large] = await Promise.all(
    VARIANT_SPECS.map((spec) => resizeToWebp(bitmap, spec.maxWidth, spec.quality)),
  );
  return { original: file, thumb, medium, large };
}
