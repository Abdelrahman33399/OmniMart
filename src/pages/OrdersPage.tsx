import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import { useNavigationStore } from '../store/useNavigationStore';
import { Button } from '../components/ui/Button';
import { mockProducts } from '../utils/mockData';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShoppingBag,
  CreditCard,
  History,
  Truck,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

export interface OrdersPageProps {
  lang?: 'en' | 'ar';
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ lang = 'en' }) => {
  const { currentUser, isLoading: isAuthLoading } = useAuthStore();
  const { orders, fetchOrders, isLoading: isOrdersLoading } = useOrderStore();
  const { toggleAuthModal, setActiveTab } = useNavigationStore();
  
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  // Fetch orders when user changes
  useEffect(() => {
    if (currentUser) {
      fetchOrders(currentUser.uid);
    }
  }, [currentUser, fetchOrders]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-3 h-3" />
            {t('Pending', 'معلق')}
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Clock className="w-3 h-3 animate-pulse" />
            {t('Processing', 'قيد المعالجة')}
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Truck className="w-3 h-3" />
            {t('Shipped', 'تم الشحن')}
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-600 dark:text-green-400">
            <CheckCircle className="w-3 h-3" />
            {t('Delivered', 'تم التوصيل')}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400">
            <XCircle className="w-3 h-3" />
            {t('Cancelled', 'ملغي')}
          </span>
        );
      default:
        return null;
    }
  };

  // If loading authentication profile
  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-secondary border-t-transparent" />
        <p className="text-xs font-semibold">{t('Synchronizing user session...', 'جاري مزامنة بيانات الجلسة...')}</p>
      </div>
    );
  }

  // Unauthenticated warning
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 bg-card border border-border-main rounded-2xl shadow-main space-y-6 animate-fade-in max-w-xl mx-auto">
        <div className="w-20 h-20 rounded-full bg-surface border border-border-main flex items-center justify-center text-text-muted">
          <History className="w-10 h-10" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h2 className="font-display font-black text-2xl text-text-main">{t('Sign In Required', 'يجب تسجيل الدخول')}</h2>
          <p className="text-xs text-text-muted">
            {t('Authentication is required to query, load, and inspect your order fulfillment history.', 'يرجى تسجيل الدخول لعرض تتبع الطلبات وسجل المعاملات الخاص بك.')}
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={() => toggleAuthModal(true)}>
          {t('Sign In Now', 'تسجيل الدخول الآن')}
        </Button>
      </div>
    );
  }

  // Loading orders from server
  if (isOrdersLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-secondary border-t-transparent" />
        <p className="text-xs font-semibold">{t('Querying invoice records from database...', 'جاري تحميل سجل الطلبات من قاعدة البيانات...')}</p>
      </div>
    );
  }

  // Empty orders list
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 bg-card border border-border-main rounded-2xl shadow-main space-y-6 animate-fade-in max-w-xl mx-auto">
        <div className="w-20 h-20 rounded-full bg-surface border border-border-main flex items-center justify-center text-text-muted">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h2 className="font-display font-black text-2xl text-text-main">{t('No Orders Placed Yet', 'لا يوجد طلبات سابقة')}</h2>
          <p className="text-xs text-text-muted">
            {t('You have not created any order objects. Explore the storefront to place your first transaction.', 'لم تقم بإنشاء أي طلبات سابقة. تفضل بزيارة المتجر لإجراء أول عملية شراء.')}
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={() => setActiveTab('shop')}>
          {t('Browse Products', 'استكشف المنتجات')}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-text-main text-left rtl:text-right" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Title */}
      <div>
        <h2 className="font-display font-black text-2xl tracking-tight">{t('Your Order History', 'سجل طلباتك')}</h2>
        <p className="text-xs text-text-muted mt-0.5">
          {t('Inspect delivery state, tracking parameters, and receipts of past transactions.', 'تحقق من حالة الشحن والتفاصيل والفواتير الخاصة بطلباتك السابقة.')}
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = !!expandedOrders[order.orderId];
          const orderDate = new Date(order.createdAt);
          
          return (
            <div
              key={order.orderId}
              className="bg-card border border-border-main rounded-2xl overflow-hidden shadow-main hover:shadow-md transition-shadow"
            >
              {/* Order Header / Card Summary */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface/50 border-b border-border-main text-xs font-semibold">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                  <div>
                    <p className="text-text-muted uppercase text-[10px] tracking-wider">{t('Order Reference', 'رقم الطلب')}</p>
                    <p className="font-mono font-bold text-text-main mt-0.5">{order.orderId}</p>
                  </div>
                  <div>
                    <p className="text-text-muted uppercase text-[10px] tracking-wider">{t('Date Placed', 'تاريخ الطلب')}</p>
                    <p className="text-text-main mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-text-muted" />
                      {orderDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-muted uppercase text-[10px] tracking-wider">{t('Total Amount', 'المجموع الإجمالي')}</p>
                    <p className="text-accent font-bold mt-0.5 text-sm">${order.pricing.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-text-muted uppercase text-[10px] tracking-wider">{t('Fulfillment Status', 'حالة الطلب')}</p>
                    <div className="mt-0.5">{getStatusBadge(order.orderStatus)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 md:self-center">
                  <button
                    onClick={() => toggleExpand(order.orderId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-border-main hover:bg-surface rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <span>{isExpanded ? t('Hide Details', 'إخفاء التفاصيل') : t('Inspect Details', 'عرض التفاصيل')}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Order Items List (Collapsed/Expanded Panel) */}
              {isExpanded && (
                <div className="p-5 space-y-5 animate-fade-in border-t border-border-main bg-card text-xs">
                  
                  {/* Shipping & Payment details review */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface p-4 rounded-xl border border-border-main">
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-text-muted uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-secondary" />
                        {t('Delivery Destination', 'عنوان التوصيل')}
                      </h4>
                      <p className="font-bold text-text-main text-sm mt-1">{order.customerInfo.fullName}</p>
                      <p className="text-text-muted leading-relaxed mt-0.5">
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.zipCode}
                      </p>
                      <p className="text-text-muted">{order.customerInfo.phoneNumber}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-text-muted uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-secondary" />
                        {t('Payment Reference', 'مرجع الدفع')}
                      </h4>
                      <p className="font-bold text-text-main text-sm mt-1 uppercase">
                        {order.paymentMethod === 'card' ? t('Credit / Debit Card', 'بطاقة ائتمانية') : t('Cash on Delivery (COD)', 'الدفع النقدي عند الاستلام')}
                      </p>
                      <p className="text-text-muted mt-0.5">
                        {t('Payment Status:', 'حالة الدفع:')}{' '}
                        <span className={`font-bold capitalize ${
                          order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-500'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </p>
                      <p className="text-text-muted">{t('Registered Email:', 'البريد الإلكتروني للطلب:')} {order.customerInfo.email}</p>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="space-y-3">
                    <h4 className="font-display font-bold text-text-muted uppercase tracking-wider text-[10px]">
                      {t('Order Items', 'المنتجات المطلوبة')}
                    </h4>
                    <div className="border border-border-main rounded-xl overflow-hidden divide-y divide-border-main">
                      {order.items.map((item, idx) => {
                        const product = mockProducts.find((p) => p.id === item.productId);
                        return (
                          <div key={idx} className="flex items-center justify-between gap-4 p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product?.images[0] || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=80&q=80'}
                                alt={t(item.title.en, item.title.ar)}
                                className="w-10 h-10 rounded-lg object-cover border border-border-main shrink-0"
                              />
                              <div>
                                <h5 className="font-bold text-text-main">{t(item.title.en, item.title.ar)}</h5>
                                {Object.keys(item.selectedAttributes).length > 0 && (
                                  <div className="flex flex-wrap gap-x-2 text-[10px] text-text-muted mt-0.5">
                                    {Object.entries(item.selectedAttributes).map(([k, v]) => (
                                      <span key={k} className="capitalize">{k}: {v}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-text-main">${item.totalPrice.toFixed(2)}</p>
                              <p className="text-[10px] text-text-muted">
                                {item.quantity} x ${item.unitPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Calculations Details */}
                  <div className="w-60 ms-auto text-xs space-y-1.5 border-t border-border-main pt-3">
                    <div className="flex justify-between text-text-muted">
                      <span>{t('Subtotal', 'المجموع الفرعي')}</span>
                      <span>${order.pricing.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-text-muted">
                      <span>{t('Shipping Cost', 'تكلفة الشحن')}</span>
                      <span>
                        {order.pricing.shippingFee === 0 ? t('FREE', 'مجاني') : `$${order.pricing.shippingFee.toFixed(2)}`}
                      </span>
                    </div>
                    {order.pricing.discount > 0 && (
                      <div className="flex justify-between text-red-500 font-bold">
                        <span>{t('Discounts', 'الخصم')}</span>
                        <span>-${order.pricing.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-text-main border-t border-border-main pt-2">
                      <span>{t('Grand Total', 'المجموع الكلي')}</span>
                      <span className="text-accent">${order.pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

OrdersPage.displayName = 'OrdersPage';
