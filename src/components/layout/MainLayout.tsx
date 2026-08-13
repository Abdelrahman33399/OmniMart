import React, { useEffect } from 'react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthModal } from '../auth/AuthModal';
import { TopBar } from './TopBar';
import { MainHeader } from './MainHeader';
import { CategoryMegaMenu } from './CategoryMegaMenu';
import { MobileBottomNav } from './MobileBottomNav';
import { Drawer } from '../ui/Drawer';
import { CartDrawer } from '../cart/CartDrawer';
import { mockCategories } from '../../utils/mockData';
import { Search, Laptop, Shirt, Home, Package, Sparkles, Activity } from 'lucide-react';
import { HeroScrollSection } from '../hero/HeroScrollSection';

export interface MainLayoutProps {
  children: React.ReactNode;
  lang?: 'en' | 'ar';
  onLangChange?: (lang: 'en' | 'ar') => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  lang = 'en',
  onLangChange = () => {},
}) => {
  const {
    activeTab,
    isMobileMenuOpen,
    toggleMobileMenu,
    toggleAuthModal,
  } = useNavigationStore();

  // Subscribe to Authentication changes globally
  const subscribeToAuthChanges = useAuthStore((state) => state.subscribeToAuthChanges);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges();
    return () => {
      unsubscribe();
    };
  }, [subscribeToAuthChanges]);

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop className="w-4 h-4 text-secondary" />;
      case 'Shirt':
        return <Shirt className="w-4 h-4 text-secondary" />;
      case 'Home':
        return <Home className="w-4 h-4 text-secondary" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-secondary" />;
      case 'Activity':
        return <Activity className="w-4 h-4 text-secondary" />;
      default:
        return <Package className="w-4 h-4 text-secondary" />;
    }
  };



  return (
    <div
      className="min-h-screen bg-surface flex flex-col transition-colors duration-300 pb-16 md:pb-0"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Top Utility Announcements bar */}
      <TopBar currentLang={lang} onLangChange={onLangChange} />

      {/* Main Glassmorphic Sticky Header */}
      <MainHeader lang={lang} />

      {/* Categories Desktop Megamenu sub-bar */}
      <CategoryMegaMenu lang={lang} />

      {activeTab === 'shop' && <HeroScrollSection lang={lang} />}

      {/* Layout Main Voids */}
      <main className={`flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in ${activeTab === 'shop' ? 'pb-8 pt-4' : 'py-8'}`}>
        {children}
      </main>

      {/* Fixed bottom navigation for mobile screen widths */}
      <MobileBottomNav lang={lang} />

      {/* CART DRAWER PORTAL */}
      <CartDrawer lang={lang} />

      {/* MOBILE MENU / CATEGORIES DRAWER */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => toggleMobileMenu(false)}
        title={t('Navigation & Categories', 'التنقل والفئات')}
        position="left"
      >
        <div className="space-y-6">
          {/* Quick search input overlay */}
          <div className="relative">
            <input
              type="text"
              placeholder={t('Search categories...', 'ابحث في الفئات...')}
              className="w-full text-xs py-2 pl-3 pr-8 rounded-lg border border-border-main bg-surface text-text-main focus:outline-none focus:ring-1 focus:ring-secondary"
            />
            <Search className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-2.5" />
          </div>

          {/* List of Mobile Categories */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-muted pb-1.5 border-b border-border-main">
              {t('Featured Categories', 'الفئات المميزة')}
            </h4>
            <div className="space-y-1">
              {mockCategories.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.slug}`}
                  onClick={() => toggleMobileMenu(false)}
                  className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-surface text-text-main transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-surface border border-border-main">
                    {getCategoryIcon(category.icon)}
                  </div>
                  <span>{t(category.name.en, category.name.ar)}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links shortcuts */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-muted pb-1.5 border-b border-border-main">
              {t('Account & Support', 'الحساب والدعم')}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <button
                onClick={() => {
                  toggleMobileMenu(false);
                  toggleAuthModal(true);
                }}
                className="p-3 text-center border border-border-main hover:bg-surface rounded-xl transition cursor-pointer text-text-main"
              >
                {t('Login / Register', 'تسجيل الدخول / التسجيل')}
              </button>
              <a
                href="#support"
                onClick={() => toggleMobileMenu(false)}
                className="p-3 text-center border border-border-main hover:bg-surface rounded-xl transition flex items-center justify-center text-text-main"
              >
                {t('Help Center', 'مركز المساعدة')}
              </a>
            </div>
          </div>
        </div>
      </Drawer>

      {/* AUTHENTICATION LOGIN / REGISTER MODAL */}
      <AuthModal lang={lang} />
    </div>
  );
};

MainLayout.displayName = 'MainLayout';
