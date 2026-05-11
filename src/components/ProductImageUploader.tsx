import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Link, Upload, Trash2, GripVertical, ChevronUp, ChevronDown,
  Loader2, ImagePlus, AlertCircle, Crown
} from 'lucide-react';

interface ProductImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const isValidUrl = (str: string) => {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const ProductImageUploader = ({ images, onChange }: ProductImageUploaderProps) => {
  const { toast } = useToast();
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);

  const addImageUrl = useCallback(() => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setUrlError('Ingresa una URL');
      return;
    }
    if (!isValidUrl(trimmed)) {
      setUrlError('URL no válida. Debe empezar con http:// o https://');
      return;
    }
    if (images.includes(trimmed)) {
      setUrlError('Esta imagen ya fue agregada');
      return;
    }
    setUrlError('');
    onChange([...images, trimmed]);
    setUrlInput('');
    setShowUrlInput(false);
  }, [urlInput, images, onChange]);

  const handleUrlKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addImageUrl();
    }
    if (e.key === 'Escape') {
      setShowUrlInput(false);
      setUrlInput('');
      setUrlError('');
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '31536000, immutable',
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      toast({ title: 'Error', description: 'No se pudo subir la imagen', variant: 'destructive' });
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages = [...images];

    for (const file of Array.from(files)) {
      const url = await uploadFile(file);
      if (url && !newImages.includes(url)) {
        newImages.push(url);
      }
    }

    onChange(newImages);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newImages.length) return;
    [newImages[index], newImages[target]] = [newImages[target], newImages[index]];
    onChange(newImages);
  };

  const getImageLabel = (index: number) => {
    if (index === 0) return 'Principal';
    if (index <= 2) return 'Destacada';
    return 'Galería';
  };

  const getLabelColor = (index: number) => {
    if (index === 0) return 'bg-primary text-primary-foreground';
    if (index <= 2) return 'bg-accent/20 text-accent-foreground';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">
          Imágenes del producto ({images.length})
        </Label>
      </div>

      {/* Image previews */}
      {images.length > 0 && (
        <div className="space-y-2">
          {/* Main image preview */}
          {images[0] && (
            <div className="relative rounded-lg border-2 border-primary/40 overflow-hidden bg-muted/20">
              <div className="flex items-start gap-3 p-2">
                <div className="relative w-28 h-28 rounded-md overflow-hidden shrink-0 bg-muted/30">
                  <img
                    src={images[0]}
                    alt="Imagen principal"
                    className="w-full h-full object-contain"
                    onError={() => setBrokenImages(prev => new Set(prev).add(images[0]))}
                  />
                  {brokenImages.has(images[0]) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-destructive/10">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Crown className="h-3.5 w-3.5 text-primary" />
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${getLabelColor(0)}`}>
                      {getImageLabel(0)}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{images[0]}</p>
                </div>
                <div className="flex flex-col gap-0.5 shrink-0">
                  {images.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveImage(0, 'down')}>
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => removeImage(0)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Thumbnails grid for rest */}
          {images.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {images.slice(1).map((img, rawIdx) => {
                const index = rawIdx + 1;
                return (
                  <div
                    key={`${img}-${index}`}
                    className="relative group rounded-lg border border-border overflow-hidden bg-muted/20"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={img}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-full object-contain p-1"
                        onError={() => setBrokenImages(prev => new Set(prev).add(img))}
                      />
                      {brokenImages.has(img) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-destructive/10">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        </div>
                      )}
                      <span className={`absolute top-1 left-1 text-[9px] font-medium px-1 py-0.5 rounded ${getLabelColor(index)}`}>
                        {getImageLabel(index)}
                      </span>
                    </div>
                    {/* Hover controls */}
                    <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => moveImage(index, 'up')} disabled={index === 0}>
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      {index < images.length - 1 && (
                        <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => moveImage(index, 'down')}>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      )}
                      <Button type="button" variant="destructive" size="icon" className="h-6 w-6" onClick={() => removeImage(index)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && !showUrlInput && (
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">Sin imágenes</p>
          <p className="text-xs text-muted-foreground">La primera imagen será la portada del producto</p>
        </div>
      )}

      {/* URL input (shown on click) */}
      {showUrlInput && (
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <Input
              type="url"
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setUrlError(''); }}
              onKeyDown={handleUrlKeyDown}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="h-9 text-sm"
              autoFocus
            />
            <Button type="button" variant="gaming" size="sm" className="h-9 shrink-0" onClick={addImageUrl}>
              Agregar
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-9 shrink-0" onClick={() => { setShowUrlInput(false); setUrlInput(''); setUrlError(''); }}>
              Cancelar
            </Button>
          </div>
          {urlError && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {urlError}
            </p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 flex-1"
          onClick={() => setShowUrlInput(true)}
          disabled={showUrlInput}
        >
          <Link className="h-3.5 w-3.5" />
          + Agregar imagen por URL
        </Button>

        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 text-muted-foreground"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          Subir archivo
        </Button>
      </div>

      {/* Help text */}
      <p className="text-[10px] text-muted-foreground">
        Imagen 1 = portada · Imágenes 2-3 = galería destacada · Resto = galería extendida
      </p>
    </div>
  );
};

export default ProductImageUploader;
