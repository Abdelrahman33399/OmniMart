import React from 'react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useCartStore } from '../../store/useCartStore';
import { mockProducts } from '../../utils/mockData';
import { OrderStatusTimeline } from './OrderStatusTimeline';
import { Button } from '../ui/Button';
import {
  MapPin,
  CreditCard,
  ShoppingBag,
  Printer,
  ChevronLeft,
  ArrowLeft,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export interface OrderTrackingViewProps {
  lang?: 'en' | 'ar';
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ lang = 'en' }) => {
  const { selectedOrderId, setProfileSubTab } = useNavigationStore();
  const { orders } = useOrderStore();
  const { addItem } = useCartStore();

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  const order = orders.find((o) => o.orderId === selectedOrderId);

  if (!order) {
    return (
      <div className="bg-card border border-border-main rounded-2xl p-8 text-center space-y-4 shadow-main text-left rtl:text-right" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="mx-auto w-12 h-12 rounded-xl bg-surface border border-border-main flex items-center justify-center text-text-muted">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h4 className="font-display font-bold text-sm text-text-main">{t('Order Details Not Found', 'تفاصيل الطلب غير موجودة')}</h4>
          <p className="text-xs text-text-muted leading-relaxed">
            {t(
              'The order you are attempting to trace could not be resolved in your active profile records.',
              'لم نتمكن من العثور على الطلب الذي تحاول تتبعه في سجلات حسابك.'
            )}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setProfileSubTab('orders')}>
          {t('Back to Orders', 'العودة لقائمة الطلبات')}
        </Button>
      </div>
    );
  }

  const handleBuyAgain = () => {
    let count = 0;
    order.items.forEach((item) => {
      const product = mockProducts.find((p) => p.id === item.productId);
      if (product) {
        addItem(product, item.quantity, item.selectedAttributes as Record<string, string>);
        count++;
      }
    });
    alert(t(`Added ${count} items back to your shopping cart!`, `تمت إعادة إضافة ${count} عناصر إلى سلة التسوق الخاصة بك!`));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left rtl:text-right animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header and Back Link */}
      <div className="flex items-center justify-between border-b border-border-main pb-4">
        <div>
          <button
            onClick={() => setProfileSubTab('orders')}
            className="flex items-center gap-1.5 text-text-muted hover:text-secondary font-bold text-xs transition mb-1.5 cursor-pointer"
          >
            {lang === 'ar' ? <ChevronLeft className="w-3.5 h-3.5 rotate-180" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{t('Back to Orders List', 'العودة لقائمة الطلبات')}</span>
          </button>
          <h3 className="font-display font-black text-xl text-text-main flex items-center gap-2">
            {t('Trace Order Shipment', 'تتبع تفاصيل الشحنة')}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-3 py-1.5 border border-border-main hover:bg-surface rounded-xl text-xs font-bold transition cursor-pointer print:hidden text-text-main"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('Print Invoice', 'طباعة الفاتورة')}</span>
          </button>
        </div>
      </div>

      {/* Visual Fulfillment Stepper Card */}
      <div className="bg-card border border-border-main rounded-2xl p-5 shadow-main">
        <OrderStatusTimeline status={order.orderStatus} createdAt={order.createdAt as string} lang={lang} />
      </div>

      {/* Itemized Order Details & Invoice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recipient Address & Invoice Table */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping & Payment details card */}
          <div className="bg-card border border-border-main rounded-2xl p-5 shadow-main grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping address info */}
            <div className="space-y-1.5 text-xs text-text-main font-medium">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-secondary" />
                {t('Shipping Address Destination', 'عنوان وجهة التوصيل')}
              </span>
              <p className="font-bold text-sm text-text-main pt-1">{order.customerInfo.fullName}</p>
              <p className="text-text-muted leading-relaxed">{order.shippingAddress.street}</p>
              <p className="text-text-muted">
                {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.zipCode}
              </p>
              <p className="text-text-muted">{order.customerInfo.phoneNumber}</p>
            </div>

            {/* Payment method badge details */}
            <div className="space-y-1.5 text-xs text-text-main font-medium">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-secondary" />
                {t('Payment Reference Parameters', 'بيانات الدفع المرجعية')}
              </span>
              <p className="font-bold text-sm text-text-main pt-1 uppercase">
                {order.paymentMethod === 'card' ? t('Credit / Debit Card', 'بطاقة ائتمانية') : t('Cash on Delivery (COD)', 'الدفع عند الاستلام نقداً')}
              </p>
              <p className="text-text-muted mt-0.5">
                {t('Transaction Status:', 'حالة العملية:')}{' '}
                <span className={`font-bold capitalize ${
                  order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-500'
                }`}>
                  {order.paymentStatus}
                </span>
              </p>
              <p className="text-text-muted">{t('Registered Email:', 'البريد الإلكتروني للطلب:')} {order.customerInfo.email}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="bg-card border border-border-main rounded-2xl overflow-hidden shadow-main">
            <div className="bg-surface px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border-main">
              {t('Itemized Order Receipt', 'تفاصيل المنتجات بالفاتورة')}
            </div>
            <div className="divide-y divide-border-main">
              {order.items.map((item, idx) => {
                const product = mockProducts.find((p) => p.id === item.productId);
                return (
                  <div key={idx} className="flex items-center justify-between gap-4 p-4 text-xs font-medium">
                    <div className="flex items-center gap-3">
                      <img
                        src={product?.images[0] || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=80&q=80'}
                        alt={t(item.title.en, item.title.ar)}
                        className="w-11 h-11 rounded-lg object-cover border border-border-main shrink-0"
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
                    <div className="text-right whitespace-nowrap">
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
        </div>

        {/* Pricing calculations details & CTAs */}
        <div className="space-y-6">
          
          {/* Invoice Pricing card */}
          <div className="bg-card border border-border-main rounded-2xl p-5 shadow-main space-y-4">
            <h4 className="font-display font-bold text-sm text-text-main border-b border-border-main pb-3">
              {t('Pricing Calculations', 'الحساب والتكاليف')}
            </h4>
            
            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between text-text-muted">
                <span>{t('Subtotal', 'المجموع الفرعي')}</span>
                <span className="text-text-main">${order.pricing.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>{t('Shipping Cost', 'تكلفة الشحن')}</span>
                <span className="text-text-main">
                  {order.pricing.shippingFee === 0 ? t('FREE', 'مجاني') : `$${order.pricing.shippingFee.toFixed(2)}`}
                </span>
              </div>
              {order.pricing.discount > 0 && (
                <div className="flex justify-between text-red-500 font-bold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    {t('Discount Applied', 'الخصم المطبق')}
                  </span>
                  <span>-${order.pricing.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border-main pt-3 flex justify-between text-sm font-bold text-text-main">
                <span>{t('Total Invoice Amount', 'السعر الإجمالي المدفوع')}</span>
                <span className="text-accent text-base">${order.pricing.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 print:hidden">
            <Button
              variant="primary"
              fullWidth
              onClick={handleBuyAgain}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              className="font-bold cursor-pointer"
            >
              {t('Buy It Again', 'إعادة الشراء')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderTrackingView.displayName = 'OrderTrackingView';
