import React from 'react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore, selectTotalItems } from '../../store/useCartStore';
import { Home, Grid, Search, ShoppingCart, User } from 'lucide-react';

export interface MobileBottomNavProps {
  lang?: 'en' | 'ar';
  onHomeClick?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  lang = 'en',
  onHomeClick,
}) => {
  const { toggleCartDrawer, toggleMobileMenu, toggleAuthModal, setProfileSubTab } = useNavigationStore();
  const { currentUser } = useAuthStore();

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  const cartCount = useCartStore(selectTotalItems);

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border-main py-2 px-4 shadow-lg transition-colors duration-300"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-around">
        {/* Home Tab */}
        <button
          onClick={() => {
            if (onHomeClick) onHomeClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 text-text-muted hover:text-secondary active:scale-95 transition-all cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">{t('Home', 'الرئيسية')}</span>
        </button>

        {/* Categories Tab */}
        <button
          onClick={() => toggleMobileMenu(true)}
          className="flex flex-col items-center gap-1 text-text-muted hover:text-secondary active:scale-95 transition-all cursor-pointer"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">{t('Categories', 'الفئات')}</span>
        </button>

        {/* Search Trigger Tab */}
        <button
          onClick={() => {
            alert(t('Click the search bar in the header or type "/" to search.', 'انقر على شريط البحث في الأعلى أو اكتب "/" للبحث.'));
          }}
          className="flex flex-col items-center gap-1 text-text-muted hover:text-secondary active:scale-95 transition-all cursor-pointer"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">{t('Search', 'البحث')}</span>
        </button>

        {/* Cart Tab with Badge */}
        <button
          onClick={() => toggleCartDrawer(true)}
          className="relative flex flex-col items-center gap-1 text-text-muted hover:text-secondary active:scale-95 transition-all cursor-pointer"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">{t('Cart', 'السلة')}</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-1 rtl:right-auto rtl:left-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[8px] font-bold text-white leading-none">
              {cartCount}
            </span>
          )}
        </button>

        {/* Account Tab */}
        <button
          onClick={() => {
            if (currentUser) {
              setProfileSubTab('overview');
            } else {
              toggleAuthModal(true);
            }
          }}
          className="flex flex-col items-center gap-1 text-text-muted hover:text-secondary active:scale-95 transition-all cursor-pointer"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">{t('Account', 'حسابي')}</span>
        </button>
      </div>
    </div>
  );
};

MobileBottomNav.displayName = 'MobileBottomNav';
