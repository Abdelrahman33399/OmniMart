import React from 'react';
import { useNavigationStore as useNavStore } from '../store/useNavigationStore';
import { useOrderStore } from '../store/useOrderStore';
import { Button } from '../components/ui/Button';
import {
  CheckCircle,
  Calendar,
  Printer,
  ShoppingBag,
  Clock,
  ArrowRight,
  Package,
  Check,
  ChevronLeft
} from 'lucide-react';

export interface OrderSuccessPageProps {
  lang?: 'en' | 'ar';
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ lang = 'en' }) => {
  const { setActiveTab, setProfileSubTab } = useNavStore();
  const { lastPlacedOrder } = useOrderStore();

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  // If no order was placed, display fallback
  if (!lastPlacedOrder) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 bg-card border border-border-main rounded-2xl shadow-main space-y-6">
        <div className="w-20 h-20 rounded-full bg-surface border border-border-main flex items-center justify-center text-text-muted">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h2 className="font-display font-black text-2xl text-text-main">{t('No Order Record Found', 'لم يتم العثور على طلب')}</h2>
          <p className="text-xs text-text-muted">
            {t('It looks like you have not placed an order in this active session.', 'يبدو أنك لم تقم بإنشاء أي طلبات خلال هذه الجلسة.')}
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={() => setActiveTab('shop')}>
          {t('Go to Storefront', 'الذهاب إلى المتجر')}
        </Button>
      </div>
    );
  }

  // Calculate estimated delivery: 3 to 5 days from order date
  const orderDate = new Date(lastPlacedOrder.createdAt);
  const estMin = new Date(orderDate);
  estMin.setDate(orderDate.getDate() + 3);
  const estMax = new Date(orderDate);
  estMax.setDate(orderDate.getDate() + 5);

  const formattedEstMin = estMin.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
  const formattedEstMax = estMax.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-text-main text-left rtl:text-right" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Printable Area Wrapper */}
      <div className="space-y-8 print:p-0 print:border-none print:shadow-none">
        
        {/* Success Banner */}
        <div className="text-center space-y-3 bg-card border border-border-main rounded-2xl p-8 shadow-main print:bg-white print:border-none">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-2 animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="font-display font-black text-3xl tracking-tight text-green-600 dark:text-green-400">
            {t('Thank You for Your Order!', 'شكراً لطلبك!')}
          </h2>
          <p className="text-sm text-text-muted max-w-md mx-auto print:hidden">
            {t(
              'Your transaction was processed successfully. A confirmation email with tracking links has been dispatched.',
              'تمت معالجة عمليتك بنجاح. تم إرسال رسالة تأكيد إلى بريدك الإلكتروني تحتوي على روابط التتبع.'
            )}
          </p>
          <div className="inline-block px-4 py-2 bg-surface rounded-xl border border-border-main font-mono text-sm font-bold text-text-main mt-4">
            {t('Order Reference ID:', 'رقم مرجع الطلب:')} <span className="text-secondary">{lastPlacedOrder.orderId}</span>
          </div>
        </div>

        {/* Fulfillment Tracker */}
        <div className="bg-card border border-border-main rounded-2xl p-6 shadow-main print:hidden">
          <h3 className="font-display font-bold text-sm text-text-muted uppercase tracking-wider mb-6">
            {t('Delivery Status Tracker', 'تتبع حالة الشحن')}
          </h3>
          <div className="flex items-center justify-between w-full">
            {/* Step 1: Placed */}
            <div className="flex flex-col items-center flex-1 relative">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold mt-2 text-text-main">{t('Order Placed', 'تم تقديم الطلب')}</span>
              <span className="text-[9px] text-text-muted mt-0.5">{orderDate.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
            </div>

            <div className="flex-1 h-1 bg-green-500/30 mx-2" />

            {/* Step 2: Processing */}
            <div className="flex flex-col items-center flex-1 relative">
              <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs animate-pulse">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold mt-2 text-text-main">{t('Processing', 'قيد المعالجة')}</span>
              <span className="text-[9px] text-accent font-bold mt-0.5">{t('Active', 'نشط')}</span>
            </div>

            <div className="flex-1 h-1 bg-border-main mx-2" />

            {/* Step 3: Shipping */}
            <div className="flex flex-col items-center flex-1 relative">
              <div className="w-8 h-8 rounded-full bg-card border border-border-main text-text-muted flex items-center justify-center font-bold text-xs">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold mt-2 text-text-muted">{t('Shipping', 'شحن الطلب')}</span>
              <span className="text-[9px] text-text-muted mt-0.5">{t('Pending', 'معلق')}</span>
            </div>
          </div>
        </div>

        {/* Estimated Delivery Time */}
        <div className="bg-card border border-border-main rounded-2xl p-6 shadow-main flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-text-main">{t('Estimated Delivery Window', 'تاريخ التوصيل المتوقع')}</h4>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              {t('Your shipment is estimated to arrive between', 'يتوقع وصول شحنتك بين')} <strong className="text-text-main">{formattedEstMin}</strong> {t('and', 'و')} <strong className="text-text-main">{formattedEstMax}</strong>.
            </p>
          </div>
        </div>

        {/* Printable Order Receipt */}
        <div className="bg-card border border-border-main rounded-2xl p-6 shadow-main space-y-6 print:border-none print:shadow-none">
          <div className="flex items-center justify-between border-b border-border-main pb-4">
            <div>
              <h3 className="text-lg font-display font-bold text-text-main">{t('Order Receipt & Invoice', 'فاتورة وتفاصيل الطلب')}</h3>
              <p className="text-xs text-text-muted mt-0.5">
                {t('Placed on', 'تاريخ تقديم الطلب')} {orderDate.toLocaleDateString()} {orderDate.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border-main hover:bg-surface rounded-lg text-xs font-semibold transition cursor-pointer print:hidden"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('Print Invoice', 'طباعة الفاتورة')}</span>
            </button>
          </div>

          {/* Delivery & Payment summaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Delivery address */}
            <div className="text-xs space-y-1.5 font-medium">
              <p className="text-text-muted uppercase font-bold tracking-wider text-[10px]">{t('Shipping Destination', 'عنوان التوصيل')}</p>
              <p className="font-bold text-sm text-text-main">{lastPlacedOrder.customerInfo.fullName}</p>
              <p className="text-text-muted">{lastPlacedOrder.shippingAddress.street}</p>
              <p className="text-text-muted">
                {lastPlacedOrder.shippingAddress.city}, {lastPlacedOrder.shippingAddress.state}, {lastPlacedOrder.shippingAddress.zipCode}
              </p>
              <p className="text-text-muted">{lastPlacedOrder.customerInfo.phoneNumber}</p>
            </div>

            {/* Payment info */}
            <div className="text-xs space-y-1.5 font-medium">
              <p className="text-text-muted uppercase font-bold tracking-wider text-[10px]">{t('Payment Parameters', 'تفاصيل الدفع')}</p>
              <p className="font-bold text-sm text-text-main uppercase">
                {lastPlacedOrder.paymentMethod === 'card' ? t('Credit / Debit Card', 'بطاقة ائتمانية') : t('Cash on Delivery', 'الدفع عند الاستلام')}
              </p>
              <p className="text-text-muted">
                {t('Status:', 'الحالة:')}{' '}
                <span className={`font-bold capitalize ${
                  lastPlacedOrder.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-500'
                }`}>
                  {lastPlacedOrder.paymentStatus}
                </span>
              </p>
              <p className="text-text-muted">{t('Email Registered:', 'البريد الإلكتروني:')} {lastPlacedOrder.customerInfo.email}</p>
            </div>
          </div>

          {/* Itemized list */}
          <div className="border border-border-main rounded-xl overflow-hidden mt-4">
            <table className="w-full border-collapse text-xs text-left rtl:text-right">
              <thead>
                <tr className="bg-surface border-b border-border-main text-text-muted font-bold">
                  <th className="px-4 py-2">{t('Product Title', 'المنتج')}</th>
                  <th className="px-4 py-2 text-center">{t('Qty', 'الكمية')}</th>
                  <th className="px-4 py-2 text-right rtl:text-left">{t('Price', 'السعر')}</th>
                  <th className="px-4 py-2 text-right rtl:text-left">{t('Total', 'الإجمالي')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main font-medium">
                {lastPlacedOrder.items.map((item, idx) => (
                  <tr key={idx} className="text-text-main">
                    <td className="px-4 py-3">
                      <p className="font-bold">{t(item.title.en, item.title.ar)}</p>
                      {Object.keys(item.selectedAttributes).length > 0 && (
                        <p className="text-[10px] text-text-muted mt-0.5 flex gap-2">
                          {Object.entries(item.selectedAttributes).map(([k, v]) => (
                            <span key={k} className="capitalize">{k}: {v}</span>
                          ))}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-text-muted">{item.quantity}</td>
                    <td className="px-4 py-3 text-right rtl:text-left">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right rtl:text-left font-bold text-text-main">${item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing calculations */}
          <div className="w-full md:w-80 ms-auto text-xs space-y-2 pt-2">
            <div className="flex justify-between text-text-muted">
              <span>{t('Subtotal', 'المجموع الفرعي')}</span>
              <span>${lastPlacedOrder.pricing.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>{t('Shipping Cost', 'رسوم الشحن')}</span>
              <span>
                {lastPlacedOrder.pricing.shippingFee === 0 ? t('FREE', 'مجاني') : `$${lastPlacedOrder.pricing.shippingFee.toFixed(2)}`}
              </span>
            </div>
            {lastPlacedOrder.pricing.discount > 0 && (
              <div className="flex justify-between text-red-500 font-bold">
                <span>{t('Promo Discounts', 'الخصم المطبق')}</span>
                <span>-${lastPlacedOrder.pricing.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-text-main border-t border-border-main pt-2">
              <span>{t('Amount Paid', 'المبلغ المدفوع')}</span>
              <span className="text-accent text-base">${lastPlacedOrder.pricing.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-border-main print:hidden">
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            if (lastPlacedOrder) {
              setProfileSubTab('tracking', lastPlacedOrder.orderId);
            }
          }}
          className="w-full sm:w-auto font-bold cursor-pointer"
        >
          {t('Track Order', 'تتبع الطلب')}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setProfileSubTab('orders')}
          className="w-full sm:w-auto font-bold cursor-pointer"
        >
          {t('View Order History', 'عرض سجل الطلبات')}
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setActiveTab('shop')}
          rightIcon={lang === 'en' ? <ArrowRight className="w-4.5 h-4.5" /> : undefined}
          leftIcon={lang === 'ar' ? <ChevronLeft className="w-4.5 h-4.5" /> : undefined}
          className="w-full sm:w-auto font-bold cursor-pointer"
        >
          {t('Continue Shopping', 'مواصلة التسوق')}
        </Button>
      </div>
    </div>
  );
};

OrderSuccessPage.displayName = 'OrderSuccessPage';
