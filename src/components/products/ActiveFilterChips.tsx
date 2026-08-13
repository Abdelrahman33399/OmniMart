import React from 'react';
import { useFilterStore } from '../../store/useFilterStore';
import { mockCategories } from '../../utils/mockData';
import { X, Trash2 } from 'lucide-react';

export interface ActiveFilterChipsProps {
  lang?: 'en' | 'ar';
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({ lang = 'en' }) => {
  const {
    selectedCategories,
    selectedBrands,
    priceRange,
    minRating,
    inStockOnly,
    searchQuery,
    removeFilterChip,
    resetFilters,
  } = useFilterStore();

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  // Helper to find category name
  const getCategoryName = (id: string) => {
    const category = mockCategories.find((c) => c.id === id);
    return category ? t(category.name.en, category.name.ar) : id;
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 3000 ||
    minRating > 0 ||
    inStockOnly ||
    searchQuery !== '';

  if (!hasActiveFilters) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-2 text-xs font-semibold py-1"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <span className="text-text-muted mr-1 rtl:mr-0 rtl:ml-1">
        {t('Active Filters:', 'الفلاتر النشطة:')}
      </span>

      {/* Search Query Chip */}
      {searchQuery && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border-main text-text-main shadow-2xs">
          <span>
            {t('Search', 'البحث')}: "{searchQuery}"
          </span>
          <button
            onClick={() => removeFilterChip('search')}
            className="hover:text-red-500 transition cursor-pointer"
            aria-label="Remove Search Filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Category Chips */}
      {selectedCategories.map((catId) => (
        <span
          key={catId}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border-main text-text-main shadow-2xs"
        >
          <span>{getCategoryName(catId)}</span>
          <button
            onClick={() => removeFilterChip('category', catId)}
            className="hover:text-red-500 transition cursor-pointer"
            aria-label={`Remove Category ${catId}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* Brand Chips */}
      {selectedBrands.map((brand) => (
        <span
          key={brand}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border-main text-text-main shadow-2xs"
        >
          <span>{brand}</span>
          <button
            onClick={() => removeFilterChip('brand', brand)}
            className="hover:text-red-500 transition cursor-pointer"
            aria-label={`Remove Brand ${brand}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* Price Chip */}
      {(priceRange[0] > 0 || priceRange[1] < 3000) && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border-main text-text-main shadow-2xs">
          <span>
            ${priceRange[0]} - ${priceRange[1]}
          </span>
          <button
            onClick={() => removeFilterChip('price')}
            className="hover:text-red-500 transition cursor-pointer"
            aria-label="Remove Price Filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Rating Chip */}
      {minRating > 0 && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border-main text-text-main shadow-2xs">
          <span className="flex items-center gap-0.5">
            {minRating}★ &amp; {t('Up', 'فوق')}
          </span>
          <button
            onClick={() => removeFilterChip('rating')}
            className="hover:text-red-500 transition cursor-pointer"
            aria-label="Remove Rating Filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Stock Chip */}
      {inStockOnly && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border-main text-text-main shadow-2xs">
          <span>{t('In Stock Only', 'متوفر فقط')}</span>
          <button
            onClick={() => removeFilterChip('stock')}
            className="hover:text-red-500 transition cursor-pointer"
            aria-label="Remove Stock Filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Clear All Button */}
      <button
        onClick={() => resetFilters()}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 hover:bg-red-100 transition cursor-pointer shadow-2xs"
      >
        <Trash2 className="w-3 h-3" />
        <span>{t('Clear All Filters', 'مسح كل الفلاتر')}</span>
      </button>
    </div>
  );
};

ActiveFilterChips.displayName = 'ActiveFilterChips';
