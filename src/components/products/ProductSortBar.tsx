import React from 'react';
import { useFilterStore, type SortOption } from '../../store/useFilterStore';
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { Select } from '../ui/Select';

export interface ProductSortBarProps {
  totalCount: number;
  filteredCount: number;
  lang?: 'en' | 'ar';
  onMobileFilterOpen: () => void;
}

export const ProductSortBar: React.FC<ProductSortBarProps> = ({
  totalCount,
  filteredCount,
  lang = 'en',
  onMobileFilterOpen,
}) => {
  const {
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    selectedCategories,
    selectedBrands,
    priceRange,
    minRating,
    inStockOnly,
    searchQuery,
  } = useFilterStore();

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  // Calculate active filter badge
  const activeFiltersCount =
    selectedCategories.length +
    selectedBrands.length +
    (priceRange[0] > 0 || priceRange[1] < 3000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
  };

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 bg-card border border-border-main rounded-2xl shadow-main text-text-main"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Dynamic Item Counter */}
      <div className="text-sm font-semibold text-text-muted">
        {t(
          `Showing ${filteredCount} of ${totalCount} products`,
          `عرض ${filteredCount} من أصل ${totalCount} منتجاً`
        )}
      </div>

      {/* Action triggers */}
      <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap sm:flex-nowrap">
        {/* Mobile Filter Toggle */}
        <button
          onClick={onMobileFilterOpen}
          className="md:hidden flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border border-border-main bg-surface hover:bg-card text-text-main transition-colors relative cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-secondary" />
          <span>{t('Filters', 'الفلاتر')}</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 rtl:-right-auto rtl:-left-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-secondary text-[9px] font-black text-white leading-none border border-card shadow-sm">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Sort drop field */}
        <div className="w-44 select-none">
          <Select
            options={[
              { value: 'featured', label: t('Featured', 'المميز') },
              { value: 'price-low-high', label: t('Price: Low to High', 'السعر: من الأقل للأعلى') },
              { value: 'price-high-low', label: t('Price: High to Low', 'السعر: من الأعلى للأقل') },
              { value: 'rating', label: t('Highest Rated', 'الأعلى تقييماً') },
              { value: 'newest', label: t('Newest Arrivals', 'أحدث المنتجات') },
            ]}
            value={sortBy}
            onChange={handleSortChange}
            className="text-xs h-9 py-1.5 font-semibold text-text-main cursor-pointer"
          />
        </div>

        {/* View Mode layout buttons (Grid vs List toggle) */}
        <div className="flex items-center border border-border-main p-1 rounded-xl bg-surface">
          {/* Grid Toggle */}
          <button
            onClick={() => setViewMode('grid')}
            className={`
              p-1.5 rounded-lg transition-all cursor-pointer
              ${
                viewMode === 'grid'
                  ? 'bg-card text-secondary shadow-xs'
                  : 'text-text-muted hover:text-text-main'
              }
            `}
            aria-label="Grid View"
          >
            <LayoutGrid className="w-4.5 h-4.5" />
          </button>

          {/* List Toggle */}
          <button
            onClick={() => setViewMode('list')}
            className={`
              p-1.5 rounded-lg transition-all cursor-pointer
              ${
                viewMode === 'list'
                  ? 'bg-card text-secondary shadow-xs'
                  : 'text-text-muted hover:text-text-main'
              }
            `}
            aria-label="List View"
          >
            <List className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

ProductSortBar.displayName = 'ProductSortBar';
