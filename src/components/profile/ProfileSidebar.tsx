import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { type ProfileTab, useNavigationStore } from '../../store/useNavigationStore';
import {
  LayoutDashboard,
  ClipboardList,
  MapPin,
  Settings,
  Heart,
  LogOut,
  Home
} from 'lucide-react';

export interface ProfileSidebarProps {
  lang?: 'en' | 'ar';
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ lang = 'en' }) => {
  const { currentUser, logout } = useAuthStore();
  const { orders } = useOrderStore();
  const { activeProfileTab, setProfileSubTab } = useNavigationStore();

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  // Active orders (pending, processing, shipped) count
  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus === 'pending' || o.orderStatus === 'processing' || o.orderStatus === 'shipped'
  ).length;

  const wishlistCount = currentUser?.wishlist.length || 0;

  const handleLogout = async () => {
    if (window.confirm(t('Are you sure you want to logout?', 'هل أنت متأكد من رغبتك في تسجيل الخروج؟'))) {
      await logout();
      useNavigationStore.getState().setActiveTab('shop');
    }
  };

  // User Initials helper
  const getUserInitials = () => {
    if (!currentUser?.fullName) return 'U';
    return currentUser.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const menuItems = [
    {
      id: 'overview' as ProfileTab,
      label: t('Overview', 'نظرة عامة'),
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'orders' as ProfileTab,
      label: t('My Orders', 'طلباتي'),
      icon: <ClipboardList className="w-4 h-4" />,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      badgeColor: 'bg-secondary text-white',
    },
    {
      id: 'addresses' as ProfileTab,
      label: t('Address Book', 'دفتر العناوين'),
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: 'settings' as ProfileTab,
      label: t('Account Settings', 'إعدادات الحساب'),
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: 'wishlist' as ProfileTab,
      label: t('My Wishlist', 'قائمتي المفضلة'),
      icon: <Heart className="w-4 h-4" />,
      badge: wishlistCount > 0 ? wishlistCount : undefined,
      badgeColor: 'bg-red-500 text-white',
    },
  ];

  return (
    <div className="bg-card border border-border-main rounded-2xl p-5 space-y-6 shadow-main w-full" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* User Header Profile Card */}
      <div className="flex items-center gap-3.5 pb-5 border-b border-border-main text-left rtl:text-right">
        {currentUser?.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt={currentUser.fullName}
            className="w-12 h-12 rounded-full object-cover border border-border-main"
          />
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary text-sm font-bold tracking-wider">
            {getUserInitials()}
          </div>
        )}
        <div className="space-y-0.5 truncate">
          <h4 className="font-display font-black text-sm text-text-main truncate">
            {currentUser?.fullName || t('OmniMart User', 'مستخدم أومني مارت')}
          </h4>
          <p className="text-xs text-text-muted truncate">{currentUser?.email}</p>
        </div>
      </div>

      {/* Back to Home Button */}
      <button
        onClick={() => useNavigationStore.getState().setActiveTab('shop')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-secondary hover:bg-secondary/10 transition-all cursor-pointer border border-secondary/20 hover:border-secondary/40"
      >
        <Home className="w-4 h-4" />
        <span>{t('Back to Home', 'العودة للرئيسية')}</span>
      </button>

      {/* Tabs Menu List */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = activeProfileTab === item.id || (item.id === 'orders' && activeProfileTab === 'tracking');
          return (
            <button
              key={item.id}
              onClick={() => setProfileSubTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-secondary text-white shadow-sm'
                  : 'text-text-muted hover:text-text-main hover:bg-surface'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold leading-none ${isActive ? 'bg-white text-secondary' : item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer text-left rtl:text-right mt-4"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('Logout Session', 'تسجيل الخروج')}</span>
        </button>
      </nav>
    </div>
  );
};

ProfileSidebar.displayName = 'ProfileSidebar';
