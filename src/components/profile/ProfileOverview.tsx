import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import {
  ClipboardList,
  Truck,
  MapPin,
  Heart,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Package,
  Calendar,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

export interface ProfileOverviewProps {
  lang?: 'en' | 'ar';
}

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({ lang = 'en' }) => {
  const { currentUser } = useAuthStore();
  const { orders } = useOrderStore();
  const { setProfileSubTab } = useNavigationStore();

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  const totalOrders = orders.length;
  const activeOrders = orders.filter(
    (o) => o.orderStatus === 'pending' || o.orderStatus === 'processing' || o.orderStatus === 'shipped'
  );
  const activeShipmentsCount = activeOrders.length;
  const savedAddressesCount = currentUser?.addresses.length || 0;
  const wishlistCount = currentUser?.wishlist.length || 0;

  // Most recent order
  const latestOrder = orders[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-600 bg-amber-500/10 dark:text-amber-400';
      case 'processing':
        return 'text-blue-600 bg-blue-500/10 dark:text-blue-400';
      case 'shipped':
        return 'text-indigo-600 bg-indigo-500/10 dark:text-indigo-400';
      case 'delivered':
        return 'text-green-600 bg-green-500/10 dark:text-green-400';
      case 'cancelled':
        return 'text-red-600 bg-red-500/10 dark:text-red-400';
      default:
        return 'text-text-muted bg-surface';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3.5 h-3.5" />;
      case 'processing':
        return <Clock className="w-3.5 h-3.5 animate-pulse" />;
      case 'shipped':
        return <Truck className="w-3.5 h-3.5" />;
      case 'delivered':
        return <CheckCircle className="w-3.5 h-3.5" />;
      case 'cancelled':
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const stats = [
    {
      label: t('Total Orders', 'إجمالي الطلبات'),
      value: totalOrders,
      icon: <ClipboardList className="w-5 h-5 text-secondary" />,
      action: () => setProfileSubTab('orders'),
    },
    {
      label: t('Active Shipments', 'شحنات قيد التوصيل'),
      value: activeShipmentsCount,
      icon: <Truck className="w-5 h-5 text-indigo-500" />,
      action: () => setProfileSubTab('orders'),
    },
    {
      label: t('Saved Addresses', 'العناوين المسجلة'),
      value: savedAddressesCount,
      icon: <MapPin className="w-5 h-5 text-emerald-500" />,
      action: () => setProfileSubTab('addresses'),
    },
    {
      label: t('My Wishlist', 'قائمتي المفضلة'),
      value: wishlistCount,
      icon: <Heart className="w-5 h-5 text-red-500" />,
      action: () => setProfileSubTab('wishlist'),
    },
  ];

  return (
    <div className="space-y-6 text-left rtl:text-right" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Greeting card banner */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 rounded-full bg-white/5 blur-2xl"></div>
        <div className="relative z-10 space-y-1 max-w-lg">
          <span className="text-[10px] uppercase font-extrabold bg-white/20 px-2 py-0.5 rounded-full text-accent tracking-wider">
            {t('Customer Dashboard', 'لوحة تحكم العميل')}
          </span>
          <h3 className="font-display font-black text-2xl mt-2">
            {t(`Hello, ${currentUser?.fullName.split(' ')[0]}!`, `مرحباً، ${currentUser?.fullName.split(' ')[0]}!`)}
          </h3>
          <p className="text-white/80 text-xs leading-relaxed">
            {t(
              'Welcome to your central account console. From here you can inspect ongoing deliveries, manage shipping profiles, and adjust security settings.',
              'أهلاً بك في لوحة تحكم حسابك الرئيسية. من هنا يمكنك تتبع الشحنات الجارية، وإدارة عناوين التوصيل، وضبط إعدادات الأمان.'
            )}
          </p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <button
            key={idx}
            onClick={stat.action}
            className="bg-card border border-border-main p-4 rounded-xl flex flex-col justify-between items-start text-left rtl:text-right hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-surface border border-border-main flex items-center justify-center group-hover:scale-105 transition-transform">
              {stat.icon}
            </div>
            <div className="mt-4">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {stat.label}
              </span>
              <span className="block text-xl font-display font-black text-text-main mt-0.5">
                {stat.value}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Active Order Tracker Widget */}
      {latestOrder ? (
        <div className="bg-card border border-border-main rounded-2xl p-5 shadow-main space-y-4">
          <div className="flex items-center justify-between border-b border-border-main pb-3">
            <div>
              <h4 className="font-display font-bold text-sm text-text-main">
                {t('Latest Order Activity', 'نشاط أحدث الطلبات')}
              </h4>
              <p className="text-[10px] text-text-muted mt-0.5">
                {t('Status updates for your most recent purchase.', 'آخر تحديثات الشحن الخاصة بعملية الشراء الأخيرة.')}
              </p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${getStatusColor(latestOrder.orderStatus)}`}>
              {getStatusIcon(latestOrder.orderStatus)}
              {t(latestOrder.orderStatus, latestOrder.orderStatus)}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-surface rounded-xl border border-border-main">
            <div className="space-y-1.5 text-xs text-text-muted">
              <div>
                <span className="font-bold text-text-main">{t('Order Reference ID:', 'رقم مرجع الطلب:')}</span>{' '}
                <span className="font-mono font-bold text-secondary">{latestOrder.orderId}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{t('Placed on:', 'تاريخ الطلب:')} {new Date(latestOrder.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px] md:max-w-sm">
                  {latestOrder.shippingAddress.street}, {latestOrder.shippingAddress.city}
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end shrink-0">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{t('Amount Paid', 'المبلغ المدفوع')}</span>
              <span className="text-lg font-display font-black text-text-main mt-0.5">${latestOrder.pricing.total.toFixed(2)}</span>
              <button
                onClick={() => setProfileSubTab('tracking', latestOrder.orderId)}
                className="mt-3 flex items-center gap-1 px-3 py-1.5 bg-secondary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-secondary/90 transition cursor-pointer"
              >
                <span>{t('Track Shipment', 'تتبع الشحنة')}</span>
                {lang === 'en' ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border-main rounded-2xl p-8 text-center shadow-main space-y-4">
          <div className="mx-auto w-12 h-12 rounded-xl bg-surface border border-border-main flex items-center justify-center text-text-muted">
            <Package className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="font-display font-bold text-sm text-text-main">{t('No Order History', 'لا يوجد طلبات بعد')}</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              {t(
                'You have not placed any orders yet. Select items from the catalog and checkout to begin.',
                'لم تقم بإنشاء أي طلبات حتى الآن. اختر منتجات من المعرض وادفع لبدء طلبك الأول.'
              )}
            </p>
          </div>
          <button
            onClick={() => useNavigationStore.getState().setActiveTab('shop')}
            className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer dark:bg-accent dark:text-primary dark:hover:bg-amber-400"
          >
            <span>{t('Explore Catalog', 'استكشف المنتجات')}</span>
            {lang === 'en' ? <ArrowRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
};

ProfileOverview.displayName = 'ProfileOverview';
