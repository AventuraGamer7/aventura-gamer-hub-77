import React, { useState, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { buildSrcSet, getOptimizedImageUrl, DEFAULT_WIDTHS } from '@/lib/supabaseImage';

export interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string | null | undefined;
  alt: string;
  /** Intrinsic width hint used to request the right transformed size. */
  width?: number;
  height?: number;
  /** Pixel widths to generate in srcset. Defaults to DEFAULT_WIDTHS. */
  widths?: number[];
  /** `sizes` attribute (e.g. "(max-width: 768px) 50vw, 25vw"). */
  sizes?: string;
  /** Render quality (20-100). */
  quality?: number;
  /** Show a skeleton background while loading. */
  skeleton?: boolean;
  /** When true, sets fetchpriority=high + eager loading (use for LCP images). */
  priority?: boolean;
  /** Object-fit class. */
  fit?: 'contain' | 'cover';
  /** Fallback element when src is empty or fails. */
  fallback?: React.ReactNode;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  widths = DEFAULT_WIDTHS,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw',
  quality = 75,
  skeleton = true,
  priority = false,
  fit = 'contain',
  fallback,
  className,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return <>{fallback ?? <div className={cn('w-full h-full bg-muted/20', className)} aria-hidden />}</>;
  }

  const optimizedSrc = getOptimizedImageUrl(src, { width: width ?? widths[Math.floor(widths.length / 2)], quality });
  const srcSet = buildSrcSet(src, widths, { quality });

  return (
    <div className={cn('relative w-full h-full', skeleton && !loaded && 'bg-muted/20 animate-pulse')}>
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
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
