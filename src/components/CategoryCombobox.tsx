import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

const DEFAULT_CATEGORIES = ['videojuegos', 'consolas', 'controles', 'accesorios', 'perifericos', 'figuras', 'repuestos', 'otros'];

interface CategoryComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

const CategoryCombobox = ({ value, onChange }: CategoryComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null);
      if (data) {
        const unique = Array.from(new Set(data.map(d => d.category).filter(Boolean) as string[]));
        setDbCategories(unique);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...dbCategories])).sort();
  const filtered = value
    ? allCategories.filter(c => c.toLowerCase().includes(value.toLowerCase()))
    : allCategories;

  return (
    <div ref={ref} className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder="Escribir o seleccionar..."
        autoComplete="off"
      />
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-40 overflow-y-auto rounded-md border border-input bg-popover text-popover-foreground shadow-md">
          {filtered.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => { onChange(cat); setIsOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground ${value === cat ? 'bg-accent/50 font-medium' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryCombobox;
