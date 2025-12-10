import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, X, FolderOpen, Tag, Plus } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

interface CategorySelectorProps {
  selectedCategory: string;
  selectedSubcategories: string[];
  onCategoryChange: (category: string) => void;
  onSubcategoriesChange: (subcategories: string[]) => void;
  allowCustomCategory?: boolean;
  allowCustomSubcategory?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  selectedSubcategories,
  onCategoryChange,
  onSubcategoriesChange,
  allowCustomCategory = true,
  allowCustomSubcategory = true,
}) => {
  const { products } = useProducts();
  const [categorySearch, setCategorySearch] = useState('');
  const [subcategorySearch, setSubcategorySearch] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');

  // Get unique categories from products, sorted alphabetically
  const existingCategories = useMemo(() => {
    const cats = Array.from(
      new Set(products?.map(p => p.category).filter(Boolean) as string[])
    ).sort((a, b) => a.localeCompare(b));
    return cats;
  }, [products]);

  // Get unique subcategories, organized by category
  const subcategoriesByCategory = useMemo(() => {
    const map: Record<string, string[]> = {};
    products?.forEach(p => {
      if (p.category && p.subcategory && Array.isArray(p.subcategory)) {
        if (!map[p.category]) map[p.category] = [];
        p.subcategory.forEach(sub => {
          if (!map[p.category].includes(sub)) {
            map[p.category].push(sub);
          }
        });
      }
    });
    // Sort subcategories alphabetically
    Object.keys(map).forEach(cat => {
      map[cat].sort((a, b) => a.localeCompare(b));
    });
    return map;
  }, [products]);

  // Get all unique subcategories
  const allSubcategories = useMemo(() => {
    const allSubs = new Set<string>();
    Object.values(subcategoriesByCategory).forEach(subs => {
      subs.forEach(sub => allSubs.add(sub));
    });
    return Array.from(allSubs).sort((a, b) => a.localeCompare(b));
  }, [subcategoriesByCategory]);

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    if (!categorySearch) return existingCategories;
    return existingCategories.filter(cat => 
      cat.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [existingCategories, categorySearch]);

  // Filter subcategories by search - show subcategories related to selected category or all if no category
  const relevantSubcategories = useMemo(() => {
    let subs = selectedCategory && subcategoriesByCategory[selectedCategory] 
      ? subcategoriesByCategory[selectedCategory] 
      : allSubcategories;
    
    if (subcategorySearch) {
      subs = subs.filter(sub => 
        sub.toLowerCase().includes(subcategorySearch.toLowerCase())
      );
    }
    return subs;
  }, [selectedCategory, subcategoriesByCategory, allSubcategories, subcategorySearch]);

  const handleCategorySelect = (category: string) => {
    onCategoryChange(category === selectedCategory ? '' : category);
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    if (selectedSubcategories.includes(subcategory)) {
      onSubcategoriesChange(selectedSubcategories.filter(s => s !== subcategory));
    } else {
      onSubcategoriesChange([...selectedSubcategories, subcategory]);
    }
  };

  const handleAddCustomCategory = () => {
    if (newCategory.trim() && !existingCategories.includes(newCategory.trim())) {
      onCategoryChange(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleAddCustomSubcategory = () => {
    if (newSubcategory.trim() && !selectedSubcategories.includes(newSubcategory.trim())) {
      onSubcategoriesChange([...selectedSubcategories, newSubcategory.trim()]);
      setNewSubcategory('');
    }
  };

  const removeSubcategory = (subcategory: string) => {
    onSubcategoriesChange(selectedSubcategories.filter(s => s !== subcategory));
  };

  return (
    <div className="space-y-6">
      {/* Category Section */}
      <div className="space-y-3">
        <Label className="text-base font-semibold flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-primary" />
          Categoría Principal
        </Label>
        
        {/* Selected Category Display */}
        {selectedCategory && (
          <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg border border-primary/30">
            <Badge variant="default" className="text-sm px-3 py-1">
              {selectedCategory}
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onCategoryChange('')}
              className="h-6 w-6 p-0 hover:bg-destructive/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Category Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar categoría..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Accordion */}
        <Accordion type="single" collapsible defaultValue="categories" className="w-full">
          <AccordionItem value="categories" className="border border-border/50 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 bg-muted/30 hover:bg-muted/50 text-sm font-medium">
              Categorías Existentes ({filteredCategories.length})
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-40">
                <div className="p-3 space-y-1">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map(category => (
                      <div
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-200 ${
                          selectedCategory === category
                            ? 'bg-primary/20 border border-primary/40'
                            : 'hover:bg-muted/50 border border-transparent'
                        }`}
                      >
                        <Checkbox
                          checked={selectedCategory === category}
                          className="pointer-events-none"
                        />
                        <span className="text-sm flex-1">{category}</span>
                        {subcategoriesByCategory[category] && (
                          <Badge variant="outline" className="text-xs">
                            {subcategoriesByCategory[category].length} subs
                          </Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No se encontraron categorías
                    </p>
                  )}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Add Custom Category */}
        {allowCustomCategory && (
          <div className="flex gap-2">
            <Input
              placeholder="Nueva categoría personalizada..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomCategory();
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddCustomCategory}
              disabled={!newCategory.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Subcategories Section */}
      <div className="space-y-3">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Tag className="h-4 w-4 text-secondary" />
          Subcategorías
          {selectedSubcategories.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedSubcategories.length} seleccionadas
            </Badge>
          )}
        </Label>

        {/* Selected Subcategories as Chips */}
        {selectedSubcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-secondary/10 rounded-lg border border-secondary/30">
            {selectedSubcategories.map(subcat => (
              <Badge 
                key={subcat} 
                variant="secondary" 
                className="text-sm px-3 py-1 flex items-center gap-1 hover:bg-secondary/30 transition-colors"
              >
                {subcat}
                <button
                  type="button"
                  onClick={() => removeSubcategory(subcat)}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onSubcategoriesChange([])}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Limpiar todo
            </Button>
          </div>
        )}

        {/* Subcategory Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar subcategoría..."
            value={subcategorySearch}
            onChange={(e) => setSubcategorySearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Subcategories Accordion */}
        <Accordion type="single" collapsible defaultValue="subcategories" className="w-full">
          <AccordionItem value="subcategories" className="border border-border/50 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 bg-muted/30 hover:bg-muted/50 text-sm font-medium">
              Subcategorías Disponibles ({relevantSubcategories.length})
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-48">
                <div className="p-3 grid grid-cols-2 gap-1">
                  {relevantSubcategories.length > 0 ? (
                    relevantSubcategories.map(subcategory => (
                      <div
                        key={subcategory}
                        onClick={() => handleSubcategoryToggle(subcategory)}
                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all duration-200 ${
                          selectedSubcategories.includes(subcategory)
                            ? 'bg-secondary/20 border border-secondary/40'
                            : 'hover:bg-muted/50 border border-transparent'
                        }`}
                      >
                        <Checkbox
                          checked={selectedSubcategories.includes(subcategory)}
                          className="pointer-events-none"
                        />
                        <span className="text-sm truncate">{subcategory}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4 col-span-2">
                      No se encontraron subcategorías
                    </p>
                  )}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Add Custom Subcategory */}
        {allowCustomSubcategory && (
          <div className="flex gap-2">
            <Input
              placeholder="Nueva subcategoría personalizada..."
              value={newSubcategory}
              onChange={(e) => setNewSubcategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomSubcategory();
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddCustomSubcategory}
              disabled={!newSubcategory.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySelector;
