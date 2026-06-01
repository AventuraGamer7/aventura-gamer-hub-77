import React, { useState, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import {
  ImageVariants,
  pickVariant,
  buildSrcSetFromVariants,
} from '@/lib/supabaseImage';

export interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string | null | undefined;
  alt: string;
  /** Variantes pre-generadas (thumb/medium/large). Si están presentes se usan en vez de `src` cruda. */
  variants?: ImageVariants | null;
  /** Ancho objetivo aproximado en px (sirve para elegir variante). */
  width?: number;
  height?: number;
  /** `sizes` attribute. */
  sizes?: string;
  /** Skeleton mientras carga. */
  skeleton?: boolean;
  /** LCP / fetchpriority high. */
  priority?: boolean;
  fit?: 'contain' | 'cover';
  fallback?: React.ReactNode;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  variants,
  width,
  height,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw',
  skeleton = true,
  priority = false,
  fit = 'contain',
  fallback,
  className,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  // Pick the best static URL: variant > raw src.
  const variantSrc = pickVariant(variants, width);
  const finalSrc = variantSrc || src || '';
  const srcSet = variants ? buildSrcSetFromVariants(variants) : undefined;

  if (!finalSrc || errored) {
    return <>{fallback ?? <div className={cn('w-full h-full bg-muted/20', className)} aria-hidden />}</>;
  }

  return (
    <div className={cn('relative w-full h-full', skeleton && !loaded && 'bg-muted/20 animate-pulse')}>
      <img
        src={finalSrc}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // @ts-expect-error fetchpriority is a valid HTML attribute not yet typed in React
        fetchpriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={cn(
          'w-full h-full transition-opacity duration-300',
          fit === 'contain' ? 'object-contain' : 'object-cover',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
        {...rest}
      />
    </div>
  );
};

export default OptimizedImage;
