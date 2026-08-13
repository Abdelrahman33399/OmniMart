import React from 'react';
import { useNavigationStore } from '../store/useNavigationStore';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { ProfileSidebar } from '../components/profile/ProfileSidebar';
import { ProfileOverview } from '../components/profile/ProfileOverview';
import { OrdersPage } from './OrdersPage';
import { OrderTrackingView } from '../components/profile/OrderTrackingView';
import { AddressBook } from '../components/profile/AddressBook';
import { AccountSettings } from '../components/profile/AccountSettings';
import { mockProducts } from '../utils/mockData';
import { Button } from '../components/ui/Button';
import { Heart, Trash2, ShoppingCart, Star } from 'lucide-react';

export interface ProfilePageProps {
  lang?: 'en' | 'ar';
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ lang = 'en' }) => {
  const { activeProfileTab, toggleAuthModal, setActiveTab } = useNavigationStore();
  const { currentUser, isLoading } = useAuthStore();
  const { addItem } = useCartStore();

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  // If auth is loading, render a central spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-secondary border-t-transparent" />
        <p className="text-xs font-semibold">{t('Synchronizing user credentials...', 'جاري التحقق من بيانات الدخول...')}</p>
      </div>
    );
  }

  // Unauthenticated screen
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 bg-card border border-border-main rounded-2xl shadow-main space-y-6 animate-fade-in max-w-xl mx-auto" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="w-20 h-20 rounded-full bg-surface border border-border-main flex items-center justify-center text-text-muted">
          <Heart className="w-10 h-10" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h2 className="font-display font-black text-2xl text-text-main">{t('Profile Access Restricted', 'دخول مقيد')}</h2>
          <p className="text-xs text-text-muted">
            {t('You must sign in to access your personal dashboard, saved addresses, and past order invoice lists.', 'يجب تسجيل الدخول لعرض حسابك، وعناوين التوصيل، وقائمة المعاملات السابقة الخاصة بك.')}
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={() => toggleAuthModal(true)}>
          {t('Sign In / Register', 'تسجيل الدخول / التسجيل')}
        </Button>
      </div>
    );
  }

  // Render wishlist view
  const renderWishlist = () => {
    const wishlistItems = mockProducts.filter((p) => currentUser.wishlist.includes(p.id));

    const handleRemoveWishlist = (productId: string) => {
      // Create copy of wishlist without the productId
      const updatedWishlist = currentUser.wishlist.filter((id) => id !== productId);
      // Sync using store action
      useAuthStore.getState().updateProfileInfo(currentUser.fullName, currentUser.phoneNumber || '', currentUser.email).then(() => {
        // We will mock updating wishlist in useAuthStore local storage
        const currentMockUser = localStorage.getItem('omnimart_mock_current_user');
        if (currentMockUser) {
          const userObj = JSON.parse(currentMockUser);
          userObj.wishlist = updatedWishlist;
          localStorage.setItem('omnimart_mock_current_user', JSON.stringify(userObj));
          
          // Save in mock list
          const usersList = localStorage.getItem('omnimart_mock_users');
          if (usersList) {
            const arr = JSON.parse(usersList);
            const idx = arr.findIndex((u: any) => u.uid === currentUser.uid);
            if (idx > -1) {
              arr[idx].wishlist = updatedWishlist;
              localStorage.setItem('omnimart_mock_users', JSON.stringify(arr));
            }
          }
          // Force update store state
          useAuthStore.setState({ currentUser: userObj });
        }
      });
    };

    const handleAddToCart = (product: any) => {
      addItem(product, 1);
    };

    if (wishlistItems.length === 0) {
      return (
        <div className="bg-card border border-border-main rounded-2xl p-12 text-center shadow-main space-y-4">
          <div className="mx-auto w-12 h-12 rounded-xl bg-surface border border-border-main flex items-center justify-center text-text-muted">
            <Heart className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="font-display font-bold text-sm text-text-main">{t('Your Wishlist is Empty', 'قائمتك المفضلة فارغة')}</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              {t(
                'Bookmark your favorite products and they will appear here for easy shopping access.',
                'قم بإضافة المنتجات المفضلة لديك وسوف تظهر هنا للوصول إليها وإضافتها للسلة بسهولة.'
              )}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setActiveTab('shop')}>
            {t('Explore Catalogs', 'استكشف المنتجات')}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="border-b border-border-main pb-4">
          <h3 className="font-display font-black text-xl text-text-main">{t('My Bookmarked Wishlist', 'قائمتي المفضلة')}</h3>
          <p className="text-xs text-text-muted mt-0.5">
            {t('Review and add saved products directly to your active shopping cart.', 'راجع المنتجات المفضلة وقم بإضافتها مباشرة إلى سلة التسوق الخاصة بك.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishlistItems.map((product) => {
            const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined;
            return (
              <div
                key={product.id}
                className="bg-card border border-border-main rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <img
                  src={product.images[0]}
                  alt={t(product.title.en, product.title.ar)}
                  className="w-20 h-20 rounded-xl object-cover border border-border-main shrink-0"
                />
                
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="space-y-1">
                    <span className="block text-[9px] uppercase font-bold tracking-wider text-text-muted">{product.brand}</span>
                    <h4 className="font-display font-bold text-sm text-text-main truncate">
                      {t(product.title.en, product.title.ar)}
                    </h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span className="text-[10px] font-bold text-text-main">{product.rating.average}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-main">
                    <div>
                      {hasDiscount ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-display font-bold text-sm text-accent">${product.discountPrice?.toFixed(2)}</span>
                          <span className="text-[10px] line-through text-text-muted">${product.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="font-display font-bold text-sm text-text-main">${product.price.toFixed(2)}</span>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleRemoveWishlist(product.id)}
                        className="p-1.5 border border-border-main hover:bg-red-500/5 hover:text-red-500 rounded-lg transition cursor-pointer text-text-muted"
                        title={t('Remove from Wishlist', 'إزالة من المفضلة')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-1.5 bg-secondary text-white hover:bg-blue-600 rounded-lg transition cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{t('Add', 'أضف')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderActiveTabPanel = () => {
    switch (activeProfileTab) {
      case 'overview':
        return <ProfileOverview lang={lang} />;
      case 'orders':
        return <OrdersPage lang={lang} />;
      case 'tracking':
        return <OrderTrackingView lang={lang} />;
      case 'addresses':
        return <AddressBook lang={lang} />;
      case 'settings':
        return <AccountSettings lang={lang} />;
      case 'wishlist':
        return renderWishlist();
      default:
        return <ProfileOverview lang={lang} />;
    }
  };

  return (
    <div className="w-full" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Responsive layout: Sidebar on the left (on desktop), active panel on the right */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        <div className="md:col-span-1">
          <ProfileSidebar lang={lang} />
        </div>
        <div className="md:col-span-3 bg-card border border-border-main rounded-2xl p-6 shadow-main min-h-[500px]">
          {renderActiveTabPanel()}
        </div>
      </div>
    </div>
  );
};

ProfilePage.displayName = 'ProfilePage';
