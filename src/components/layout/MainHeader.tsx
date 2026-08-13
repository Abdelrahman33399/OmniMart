import React from 'react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { SearchBar } from './SearchBar';
import { HeaderActions } from './HeaderActions';
import { Menu, X } from 'lucide-react';

export interface MainHeaderProps {
  lang?: 'en' | 'ar';
}

export const MainHeader: React.FC<MainHeaderProps> = ({ lang = 'en' }) => {
  const { isMobileMenuOpen, toggleMobileMenu } = useNavigationStore();


  return (
    <div
      className="backdrop-blur-md bg-surface/90 sticky top-0 z-40 border-b border-border-main transition-colors duration-300 shadow-xs"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Mobile Drawer Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile hamburger menu */}
          <button
            onClick={() => toggleMobileMenu(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text-main border border-border-main hover:bg-surface transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Logo Frame */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md border border-primary/20 dark:bg-accent dark:text-primary">
              <span className="font-display font-extrabold text-lg">O</span>
            </div>
            <div>
              <span className="font-display font-black text-lg tracking-tight text-text-main">
                Omni<span className="text-accent dark:text-secondary">Mart</span>
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar (Centered, Hidden on Mobile screen viewports, visible >= md) */}
        <div className="hidden md:flex flex-1 justify-center max-w-xl mx-auto">
          <SearchBar lang={lang} />
        </div>

        {/* Header Actions & Profile buttons (Wishlist, Account, Cart) */}
        <div className="shrink-0">
          <HeaderActions lang={lang} />
        </div>
      </div>
    </div>
  );
};

MainHeader.displayName = 'MainHeader';
