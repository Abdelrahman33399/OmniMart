import React from 'react';
import { useNavigationStore } from '../../store/useNavigationStore';
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
  selectDiscountAmount,
  selectShippingFee,
  selectGrandTotal,
} from '../../store/useCartStore';
import { Drawer } from '../ui/Drawer';
import { FreeShippingBar } from './FreeShippingBar';
import { CartItemRow } from './CartItemRow';
import { CartPromoInput } from './CartPromoInput';
import { Button } from '../ui/Button';
import { ShoppingBag, ArrowRight, ArrowLeft, Trash2, Eye } from 'lucide-react';

export interface CartDrawerProps {
  lang?: 'en' | 'ar';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ lang = 'en' }) => {
  const { isCartDrawerOpen, toggleCartDrawer, setActiveTab } = useNavigationStore();
  const { items, clearCart } = useCartStore();

  const totalItems = useCartStore(selectTotalItems);
  const subtotal = useCartStore(selectSubtotal);
  const discount = useCartStore(selectDiscountAmount);
  const shippingFee = useCartStore(selectShippingFee);
  const grandTotal = useCartStore(selectGrandTotal);

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  const handleCheckout = () => {
    toggleCartDrawer(false);
    alert(t('Proceeding to Checkout mock page!', 'جاري الانتقال لصفحة الدفع التجريبية!'));
  };

  const handleViewFullCart = () => {
    toggleCartDrawer(false);
    setActiveTab('cart');
  };

  return (
    <Drawer
      isOpen={isCartDrawerOpen}
      onClose={() => toggleCartDrawer(false)}
      title={`${t('Your Cart', 'سلتك')} (${totalItems})`}
      position={lang === 'ar' ? 'left' : 'right'}
    >
      <div
        className="flex flex-col h-full text-text-main text-left rtl:text-right"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Dynamic Cart body list */}
        {items.length === 0 ? (
          /* EMPTY CART VIEW */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-surface border border-border-main flex items-center justify-center text-text-muted">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 max-w-[250px]">
              <h3 className="font-display font-bold text-base">
                {t('Your Cart is Empty', 'سلتك فارغة')}
              </h3>
              <p className="text-xs text-text-muted">
                {t(
                  'Looks like you haven\'t added any items to your cart yet.',
                  'يبدو أنك لم تقم بإضافة أي منتجات إلى سلتك بعد.'
                )}
              </p>
            </div>
            <Button variant="secondary" size="md" onClick={() => toggleCartDrawer(false)}>
              {t('Start Shopping', 'ابدأ التسوق')}
            </Button>
          </div>
        ) : (
          /* ACTIVE CART WITH ITEMS */
          <>
            {/* Scrollable list content */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
              {/* Free Shipping Bar */}
              <div className="bg-surface border border-border-main p-3.5 rounded-xl">
                <FreeShippingBar lang={lang} />
              </div>

              {/* Cart List */}
              <div className="divide-y divide-border-main">
                {items.map((item, idx) => (
                  <CartItemRow
                    key={`${item.productId}-${JSON.stringify(item.selectedAttributes || {})}-${idx}`}
                    item={item}
                    lang={lang}
                  />
                ))}
              </div>
            </div>

            {/* Sticky summary footer */}
            <div className="p-4 border-t border-border-main bg-card space-y-4.5 shrink-0">
              {/* Promo input */}
              <CartPromoInput lang={lang} />

              {/* Price list breaks */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-text-muted">
                  <span>{t('Subtotal', 'المجموع الفرعي')}</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                    <span>{t('Discount', 'الخصم')}</span>
                    <span className="font-bold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-text-muted">
                  <span>{t('Shipping Fee', 'تكلفة الشحن')}</span>
                  <span className="font-bold">
                    {shippingFee === 0 ? t('FREE', 'مجاني') : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-black pt-2 border-t border-border-main">
                  <span>{t('Total', 'الإجمالي')}</span>
                  <span className="text-secondary">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <Button
                  variant="primary"
                  fullWidth
                  size="md"
                  onClick={handleCheckout}
                  rightIcon={lang === 'en' ? <ArrowRight className="w-4 h-4" /> : undefined}
                  leftIcon={lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : undefined}
                  className="font-extrabold uppercase tracking-wider py-2.5 cursor-pointer"
                >
                  {t('Proceed to Checkout', 'المتابعة لإتمام الطلب')}
                </Button>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewFullCart}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    className="py-2 cursor-pointer font-bold"
                  >
                    {t('View Full Cart', 'عرض السلة بالكامل')}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      if (confirm(t('Clear all cart items?', 'مسح جميع محتويات السلة؟'))) {
                        clearCart();
                      }
                    }}
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                    className="py-2 cursor-pointer font-bold"
                  >
                    {t('Clear Cart', 'تفريغ السلة')}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};

CartDrawer.displayName = 'CartDrawer';
