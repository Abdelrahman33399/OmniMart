import React, { useState } from 'react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useCartStore, selectTotalItems } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Heart, User, ShoppingCart, ChevronDown, ListOrdered, LogOut, Settings } from 'lucide-react';

export interface HeaderActionsProps {
  lang?: 'en' | 'ar';
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ lang = 'en' }) => {
  const { toggleCartDrawer, toggleAuthModal, setActiveTab, setProfileSubTab } = useNavigationStore();
  const { currentUser, logout } = useAuthStore();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  // Derived counts from store
  const wishlistCount = currentUser?.wishlist.length || 0;
  const cartCount = useCartStore(selectTotalItems);

  const handleAccountClick = () => {
    if (currentUser) {
      setIsUserDropdownOpen(!isUserDropdownOpen);
    } else {
      toggleAuthModal(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    setActiveTab('shop');
  };

  return (
    <div className="flex items-center gap-4 text-text-main" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Wishlist Button */}
      <button
        className="relative p-2 rounded-full hover:bg-surface transition-colors duration-200 cursor-pointer"
        aria-label={t('Wishlist', 'المفضلة')}
        onClick={() => alert(t(`Wishlist has ${wishlistCount} items`, `المفضلة تحتوي على ${wishlistCount} عناصر`))}
      >
        <Heart className="w-5 h-5 hover:text-red-500 transition-colors" />
        {wishlistCount > 0 && (
          <span className="absolute top-1 right-1 rtl:right-auto rtl:left-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white leading-none">
            {wishlistCount}
          </span>
        )}
      </button>

      {/* Account Dropdown */}
      <div className="relative">
        <button
          onClick={handleAccountClick}
          onBlur={() => setTimeout(() => setIsUserDropdownOpen(false), 200)}
          className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-surface transition-all duration-200 cursor-pointer text-xs font-bold"
          aria-expanded={isUserDropdownOpen}
          aria-haspopup="true"
        >
          <User className="w-5 h-5" />
          <span className="hidden lg:inline truncate max-w-[90px]">
            {currentUser ? currentUser.fullName.split(' ')[0] : t('Sign In', 'تسجيل الدخول')}
          </span>
          {currentUser && (
            <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
          )}
        </button>

        {/* Dropdown Menu */}
        {isUserDropdownOpen && currentUser && (
          <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 rounded-xl bg-card border border-border-main shadow-xl py-2 z-50 animate-fade-in text-xs font-medium">
            <div className="px-4 py-2 border-b border-border-main text-text-muted select-none">
              <p className="font-bold text-text-main truncate">{currentUser.fullName}</p>
              <p className="text-[10px] truncate">{currentUser.email}</p>
            </div>
            
            <button
              onClick={() => {
                setProfileSubTab('overview');
                setIsUserDropdownOpen(false);
              }}
              className="w-full text-left rtl:text-right px-4 py-2.5 hover:bg-surface text-text-main flex items-center gap-2 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-secondary" />
              <span>{t('My Profile', 'ملفي الشخصي')}</span>
            </button>

            <button
              onClick={() => {
                setProfileSubTab('orders');
                setIsUserDropdownOpen(false);
              }}
              className="w-full text-left rtl:text-right px-4 py-2.5 hover:bg-surface text-text-main flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ListOrdered className="w-4 h-4 text-secondary" />
              <span>{t('My Orders', 'طلباتي')}</span>
            </button>

            <button
              onClick={() => {
                setProfileSubTab('settings');
                setIsUserDropdownOpen(false);
              }}
              className="w-full text-left rtl:text-right px-4 py-2.5 hover:bg-surface text-text-main flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-secondary" />
              <span>{t('Account Settings', 'إعدادات الحساب')}</span>
            </button>
            
            <div className="h-px bg-border-main my-1" />
            
            <button
              onClick={handleLogout}
              className="w-full text-left rtl:text-right px-4 py-2.5 hover:bg-surface text-red-600 dark:text-red-400 flex items-center gap-2 transition-colors cursor-pointer font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('Logout', 'تسجيل الخروج')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Cart Drawer Trigger */}
      <button
        onClick={() => toggleCartDrawer(true)}
        className="relative p-2 rounded-full hover:bg-surface transition-colors duration-200 cursor-pointer"
        aria-label={t('Open Cart', 'فتح السلة')}
      >
        <ShoppingCart className="w-5 h-5 text-text-main" />
        {cartCount > 0 && (
          <span className="absolute top-1 right-1 rtl:right-auto rtl:left-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-white leading-none">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
};

HeaderActions.displayName = 'HeaderActions';
