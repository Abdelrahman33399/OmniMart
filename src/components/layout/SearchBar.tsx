import React, { useEffect, useRef } from 'react';
import { useFilterStore } from '../../store/useFilterStore';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  lang?: 'en' | 'ar';
}

export const SearchBar: React.FC<SearchBarProps> = ({ lang = 'en' }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    setCategories,
  } = useFilterStore();

  const inputRef = useRef<HTMLInputElement>(null);

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus on '/' or 'Ctrl+K'
      if (
        (e.key === '/' && document.activeElement !== inputRef.current) ||
        ((e.ctrlKey || e.metaKey) && e.key === 'k')
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is processed in real-time, we just blur the input
    inputRef.current?.blur();
  };

  const selectedCategoryValue = selectedCategories[0]?.replace('cat_', '') || 'all';

  const handleCategoryChange = (val: string) => {
    if (val === 'all') {
      setCategories([]);
    } else {
      setCategories([`cat_${val}`]);
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="flex items-center flex-1 max-w-lg md:max-w-xl h-10 rounded-xl border border-border-main bg-surface/50 overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent focus-within:bg-card transition-all duration-200"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Inline Category Select */}
      <div className="relative border-r border-border-main rtl:border-r-0 rtl:border-l shrink-0">
        <select
          value={selectedCategoryValue}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="h-full pl-3 pr-8 py-2 text-xs font-semibold text-text-main bg-transparent focus:outline-none appearance-none cursor-pointer"
        >
          <option value="all">{t('All Categories', 'كل الفئات')}</option>
          <option value="electronics">{t('Electronics', 'الإلكترونيات')}</option>
          <option value="fashion">{t('Fashion', 'الأزياء')}</option>
          <option value="home">{t('Home', 'المنزل')}</option>
        </select>
        <div className="absolute inset-y-0 right-2 rtl:right-auto rtl:left-2 flex items-center pointer-events-none text-text-muted">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Input Box */}
      <div className="relative flex-1 flex items-center px-3.5">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('Search products, brands...', 'ابحث عن منتجات، ماركات...')}
          className="w-full text-sm bg-transparent text-text-main placeholder:text-text-muted/50 focus:outline-none py-1.5"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full text-text-muted hover:bg-surface hover:text-text-main transition cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Keyboard shortcut badge */}
        {!searchQuery && (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border-main bg-card text-[9px] font-bold text-text-muted leading-none shadow-xs pointer-events-none select-none">
            <span>/</span>
          </kbd>
        )}
      </div>

      {/* Search Submit Button */}
      <button
        type="submit"
        className="h-full px-4.5 bg-primary text-white hover:bg-slate-800 dark:bg-accent dark:text-primary dark:hover:bg-amber-400 flex items-center justify-center transition-colors cursor-pointer shrink-0 border-l border-border-main rtl:border-l-0 rtl:border-r"
        aria-label="Submit Search"
      >
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
};

SearchBar.displayName = 'SearchBar';
