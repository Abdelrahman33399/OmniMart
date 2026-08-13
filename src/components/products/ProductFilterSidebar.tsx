import React from 'react';
import { useFilterStore } from '../../store/useFilterStore';
import { mockProducts, mockCategories } from '../../utils/mockData';
import { Star, X, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ProductFilterSidebarProps {
  lang?: 'en' | 'ar';
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  lang = 'en',
  isMobile = false,
  onCloseMobile,
}) => {
  const {
    selectedCategories,
    setCategories,
    selectedBrands,
    setBrands,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    inStockOnly,
    toggleInStock,
    resetFilters,
  } = useFilterStore();

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  // Dynamic Product Counts Calculations
  const getCategoryCount = (categoryId: string) => {
    return mockProducts.filter((p) => p.categoryId === categoryId).length;
  };

  const allBrands = Array.from(new Set(mockProducts.map((p) => p.brand)));
  const getBrandCount = (brandName: string) => {
    return mockProducts.filter((p) => p.brand === brandName).length;
  };

  // Checkbox handlers
  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setCategories(selectedCategories.filter((id) => id !== categoryId));
    } else {
      setCategories([...selectedCategories, categoryId]);
    }
  };

  const handleBrandToggle = (brandName: string) => {
    if (selectedBrands.includes(brandName)) {
      setBrands(selectedBrands.filter((b) => b !== brandName));
    } else {
      setBrands([...selectedBrands, brandName]);
    }
  };

  const handleMinPriceChange = (val: string) => {
    const min = parseFloat(val) || 0;
    setPriceRange([min, priceRange[1]]);
  };

  const handleMaxPriceChange = (val: string) => {
    const max = parseFloat(val) || 0;
    setPriceRange([priceRange[0], max]);
  };

  const ratingOptions = [4, 3, 2];

  // Detect active state
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 3000 ||
    minRating > 0 ||
    inStockOnly;

  return (
    <div
      className={`space-y-6 w-full text-text-main ${isMobile ? '' : 'hidden md:block bg-card border border-border-main p-6 rounded-2xl shadow-main'}`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border-main">
        <h3 className="font-display font-black text-lg tracking-tight">
          {t('Filter Search', 'تصفية المنتجات')}
        </h3>
        {hasActiveFilters && (
          <button
            onClick={() => resetFilters()}
            className="text-xs font-semibold text-secondary hover:underline cursor-pointer flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            {t('Clear All', 'مسح الكل')}
          </button>
        )}
      </div>

      {/* Accordion 1: Categories */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          {t('Categories', 'الأقسام')}
        </h4>
        <div className="space-y-2">
          {mockCategories.map((category) => {
            const count = getCategoryCount(category.id);
            const isChecked = selectedCategories.includes(category.id);
            return (
              <label
                key={category.id}
                className="flex items-center justify-between text-sm font-semibold cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`
                      w-4.5 h-4.5 rounded border flex items-center justify-center transition-all duration-200
                      ${
                        isChecked
                          ? 'bg-secondary border-transparent text-white'
                          : 'border-border-main group-hover:border-text-muted bg-card'
                      }
                    `}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-text-main group-hover:text-secondary transition-colors duration-200">
                    {t(category.name.en, category.name.ar)}
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold text-text-muted bg-surface rounded-md">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Accordion 2: Brands */}
      <div className="space-y-3 pt-4 border-t border-border-main">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          {t('Brands', 'الماركات')}
        </h4>
        <div className="space-y-2">
          {allBrands.map((brand) => {
            const count = getBrandCount(brand);
            const isChecked = selectedBrands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center justify-between text-sm font-semibold cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => handleBrandToggle(brand)}
                    className={`
                      w-4.5 h-4.5 rounded border flex items-center justify-center transition-all duration-200
                      ${
                        isChecked
                          ? 'bg-secondary border-transparent text-white'
                          : 'border-border-main group-hover:border-text-muted bg-card'
                      }
                    `}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-text-main group-hover:text-secondary transition-colors duration-200">
                    {brand}
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold text-text-muted bg-surface rounded-md">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Accordion 3: Price Limit */}
      <div className="space-y-3 pt-4 border-t border-border-main">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          {t('Price Range ($)', 'نطاق السعر ($)')}
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-text-muted font-bold text-[10px] uppercase">Min</span>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-border-main bg-card text-text-main font-bold rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>
          <div className="space-y-1">
            <span className="text-text-muted font-bold text-[10px] uppercase">Max</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              placeholder="3000"
              className="w-full px-3 py-2 border border-border-main bg-card text-text-main font-bold rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>
        </div>
        {/* Quick Range Slider */}
        <input
          type="range"
          min="0"
          max="3000"
          step="50"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full h-1 bg-border-main rounded-lg appearance-none cursor-pointer accent-secondary"
        />
      </div>

      {/* Accordion 4: Rating Star Limits */}
      <div className="space-y-3 pt-4 border-t border-border-main">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          {t('Customer Rating', 'تقييم العملاء')}
        </h4>
        <div className="space-y-2">
          {ratingOptions.map((rating) => {
            const isActive = minRating === rating;
            return (
              <button
                key={rating}
                onClick={() => setMinRating(isActive ? 0 : rating)}
                className={`
                  w-full flex items-center justify-between text-sm font-semibold px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer text-left rtl:text-right
                  ${
                    isActive
                      ? 'bg-secondary/10 border border-secondary/20 text-secondary'
                      : 'border border-transparent text-text-main hover:bg-surface'
                  }
                `}
              >
                <div className="flex items-center gap-1">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4.5 h-4.5 ${
                          i < rating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs ml-1 rtl:mr-1 font-bold">
                    &amp; {t('Up', 'فوق')}
                  </span>
                </div>
                {isActive && <Check className="w-4 h-4 text-secondary stroke-[3.5]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion 5: Stock Status */}
      <div className="pt-4 border-t border-border-main flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            {t('In Stock Only', 'المتوفر في المخزن فقط')}
          </h4>
          <p className="text-[10px] text-text-muted">{t('Hide unavailable items', 'إخفاء السلع غير المتوفرة')}</p>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={() => toggleInStock()}
          className={`
            relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
            ${inStockOnly ? 'bg-secondary' : 'bg-slate-300 dark:bg-slate-700'}
          `}
          role="switch"
          aria-checked={inStockOnly}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out
              ${inStockOnly ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      {/* Mobile Drawer actions */}
      {isMobile && onCloseMobile && (
        <div className="pt-6 border-t border-border-main">
          <Button variant="primary" fullWidth size="lg" onClick={onCloseMobile}>
            {t('Apply Filters', 'تطبيق الفلاتر')}
          </Button>
        </div>
      )}
    </div>
  );
};

ProductFilterSidebar.displayName = 'ProductFilterSidebar';
