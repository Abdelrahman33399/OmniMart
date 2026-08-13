import React from 'react';
import { useNavigationStore } from '../store/useNavigationStore';
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
  selectDiscountAmount,
  selectShippingFee,
  selectGrandTotal,
} from '../store/useCartStore';
import { CartItemRow } from '../components/cart/CartItemRow';
import { CartPromoInput } from '../components/cart/CartPromoInput';
import { FreeShippingBar } from '../components/cart/FreeShippingBar';
import { Button } from '../components/ui/Button';
import {
  Lock,
  ShieldCheck,
  CreditCard,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Truck,
} from 'lucide-react';

export interface CartPageProps {
  lang?: 'en' | 'ar';
}

export const CartPage: React.FC<CartPageProps> = ({ lang = 'en' }) => {
  const { setActiveTab } = useNavigationStore();
  const { items, clearCart } = useCartStore();

  const totalItems = useCartStore(selectTotalItems);
  const subtotal = useCartStore(selectSubtotal);
  const discount = useCartStore(selectDiscountAmount);
  const shippingFee = useCartStore(selectShippingFee);
  const grandTotal = useCartStore(selectGrandTotal);

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  const handleCheckout = () => {
    setActiveTab('checkout');
  };

  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center py-20 bg-card border border-border-main rounded-2xl shadow-main space-y-6 animate-fade-in"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="w-20 h-20 rounded-full bg-surface border border-border-main flex items-center justify-center text-text-muted">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h2 className="font-display font-black text-2xl text-text-main">
            {t('Your Shopping Cart is Empty', 'سلة تسوقك فارغة')}
          </h2>
          <p className="text-xs text-text-muted">
            {t(
              'Add items to your cart and make your next purchase with us today.',
              'أضف منتجات إلى سلتك وقم بإتمام عملية الشراء التالية معنا اليوم.'
            )}
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setActiveTab('shop')}
          leftIcon={lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : undefined}
          rightIcon={lang === 'en' ? <ArrowRight className="w-4 h-4" /> : undefined}
        >
          {t('Explore Storefront', 'استكشف المنتجات')}
        </Button>
      </div>
    );
  }

  return (
    <div
      className="space-y-6 text-text-main text-left rtl:text-right"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Page Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-main">
        <div>
          <h2 className="font-display font-black text-2xl tracking-tight">
            {t('Shopping Cart', 'سلة التسوق')}
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            {t(`Review and adjust your ${totalItems} selected items below`, `راجع واضبط ${totalItems} منتجات مضافة أدناه`)}
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            if (confirm(t('Are you sure you want to clear your cart?', 'هل أنت متأكد من تفريغ السلة بالكامل؟'))) {
              clearCart();
            }
          }}
          leftIcon={<Trash2 className="w-4 h-4" />}
        >
          {t('Clear Shopping Cart', 'تفريغ السلة بالكامل')}
        </Button>
      </div>

      {/* Grid view: Items List (Left) + Pricing Card Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Cart Items Details lists */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Free Shipping Progress bar */}
          <div className="bg-card border border-border-main p-4.5 rounded-2xl shadow-main">
            <FreeShippingBar lang={lang} />
          </div>

          {/* Cart Item Cards list */}
          <div className="bg-card border border-border-main rounded-2xl shadow-main p-6 divide-y divide-border-main">
            {items.map((item, idx) => (
              <CartItemRow
                key={`${item.productId}-${JSON.stringify(item.selectedAttributes || {})}-${idx}`}
                item={item}
                lang={lang}
              />
            ))}
          </div>

          {/* Back button */}
          <button
            onClick={() => setActiveTab('shop')}
            className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:underline cursor-pointer"
          >
            {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{t('Continue Shopping', 'مواصلة التسوق')}</span>
          </button>
        </div>

        {/* Right: Summary cards */}
        <div className="col-span-1 space-y-6">
          {/* Summary Card */}
          <div className="bg-card border border-border-main rounded-2xl shadow-main p-6 space-y-5">
            <h3 className="font-display font-black text-lg pb-3 border-b border-border-main">
              {t('Order Summary', 'ملخص الطلب')}
            </h3>

            {/* Promo input */}
            <CartPromoInput lang={lang} />

            {/* Calculations breakdown */}
            <div className="space-y-3.5 text-xs border-t border-b border-border-main py-4.5">
              <div className="flex justify-between text-text-muted">
                <span>{t('Subtotal', 'المجموع الفرعي')}</span>
                <span className="font-extrabold">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>{t('Promo Code Discount', 'خصم الرمز الترويجي')}</span>
                  <span className="font-extrabold">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-text-muted">
                <span>{t('Shipping Estimate', 'تقدير الشحن')}</span>
                <span className="font-extrabold">
                  {shippingFee === 0 ? (
                    <span className="text-green-600 dark:text-green-400">{t('FREE', 'مجاني')}</span>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>
              
              {shippingFee > 0 && (
                <div className="flex items-start gap-1.5 text-[10px] text-text-muted bg-surface/50 border border-border-main rounded-xl p-2.5">
                  <Truck className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span>
                    {t(
                      'Spend $50.00 or more to unlock Free Shipping estimate!',
                      'أنفق 50.00 دولاراً أو أكثر لتفعيل الشحن المجاني التقديري!'
                    )}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-baseline py-1">
              <span className="text-sm font-black">{t('Grand Total', 'الإجمالي الكلي')}</span>
              <span className="text-2xl font-display font-black text-secondary">
                ${grandTotal.toFixed(2)}
              </span>
            </div>

            {/* Secure checkout triggers */}
            <div className="space-y-3 pt-3">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleCheckout}
                leftIcon={<Lock className="w-4.5 h-4.5" />}
                className="font-extrabold uppercase tracking-wider py-3 cursor-pointer"
              >
                {t('Proceed to Checkout', 'المتابعة لإتمام الدفع الآمن')}
              </Button>

              {/* Express checkout buttons */}
              <div className="relative flex py-2.5 items-center">
                <div className="flex-grow border-t border-border-main"></div>
                <span className="flex-shrink mx-4 text-[10px] text-text-muted uppercase font-bold tracking-widest bg-card">
                  {t('Or pay with', 'أو الدفع عبر')}
                </span>
                <div className="flex-grow border-t border-border-main"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCheckout}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 border border-border-main bg-[#FFC439] hover:bg-[#E5AF30] text-[#003087] font-black rounded-xl text-xs transition cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#003087]" />
                  <span>PayPal</span>
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-black hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  <span>Apple Pay</span>
                </button>
              </div>
            </div>
          </div>

          {/* Secure seals card */}
          <div className="bg-surface border border-border-main rounded-2xl p-4.5 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
              <div className="text-xs">
                <h4 className="font-bold text-text-main">{t('Security & Trust Guarantee', 'ضمان الأمان والخصوصية')}</h4>
                <p className="text-text-muted mt-0.5">
                  {t(
                    'Your transaction is secured with 256-bit SSL encryption protocol.',
                    'جميع معاملاتك محمية بتشفير 256 بت SSL الآمن بالكامل.'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-secondary shrink-0" />
              <div className="text-xs">
                <h4 className="font-bold text-text-main">{t('30-Day Money Back Guarantee', 'ضمان استرجاع الأموال 30 يوماً')}</h4>
                <p className="text-text-muted mt-0.5">
                  {t(
                    'Return any product within 30 days if you are unsatisfied with details.',
                    'يمكنك استرجاع أي منتج في غضون 30 يوماً إن لم تكن راضياً عن تفاصيله.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CartPage.displayName = 'CartPage';
