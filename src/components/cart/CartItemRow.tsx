import React from 'react';
import type { CartItem } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { mockProducts } from '../../utils/mockData';
import { Trash2, Plus, Minus } from 'lucide-react';

export interface CartItemRowProps {
  item: CartItem;
  lang?: 'en' | 'ar';
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item, lang = 'en' }) => {
  const { updateQuantity, removeItem } = useCartStore();

  const product = mockProducts.find((p) => p.id === item.productId);

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  if (!product) {
    return (
      <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs font-bold text-red-600">
        {t('Item loading error or item removed', 'خطأ في تحميل المنتج أو تم حذفه')}
      </div>
    );
  }

  const hasDiscount =
    product.discountPrice !== null &&
    product.discountPrice !== undefined &&
    product.discountPrice < product.price;

  const handleIncrement = () => {
    updateQuantity(item.productId, item.quantity + 1, item.selectedAttributes);
  };

  const handleDecrement = () => {
    updateQuantity(item.productId, item.quantity - 1, item.selectedAttributes);
  };

  const handleRemove = () => {
    removeItem(item.productId, item.selectedAttributes);
  };

  const totalPrice = item.unitPrice * item.quantity;

  return (
    <div
      className="flex items-center gap-4 py-4 border-b border-border-main text-text-main group"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Thumbnail view */}
      <div className="w-16 h-16 rounded-xl bg-surface border border-border-main overflow-hidden shrink-0 relative">
        <img
          src={product.images[0]}
          alt={t(product.title.en, product.title.ar)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Description Info */}
      <div className="flex-1 min-w-0 space-y-1.5 text-left rtl:text-right">
        <h4 className="text-sm font-bold truncate hover:text-secondary transition-colors duration-200">
          {t(product.title.en, product.title.ar)}
        </h4>

        {/* Dynamic attributes tags (e.g. Color, Size) */}
        {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(item.selectedAttributes).map(([key, val]) => (
              <span
                key={key}
                className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-surface border border-border-main text-[10px] font-bold text-text-muted capitalize"
              >
                {key}: {val}
              </span>
            ))}
          </div>
        )}

        {/* Pricing details */}
        <div className="flex items-baseline gap-1.5 text-xs">
          <span className="font-extrabold text-secondary">${item.unitPrice.toFixed(2)}</span>
          {hasDiscount && (
            <span className="line-through text-[10px] text-text-muted">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Control Quantity + Totals */}
      <div className="flex flex-col items-end gap-2.5 shrink-0 select-none">
        {/* Quantity control pill */}
        <div className="flex items-center border border-border-main rounded-xl bg-surface p-1">
          <button
            onClick={handleDecrement}
            className="p-1 rounded-lg text-text-muted hover:text-text-main hover:bg-card transition duration-150 cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-7 text-center text-xs font-black">{item.quantity}</span>
          <button
            onClick={handleIncrement}
            className="p-1 rounded-lg text-text-muted hover:text-text-main hover:bg-card transition duration-150 cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Summed item price & trash button */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black">${totalPrice.toFixed(2)}</span>
          <button
            onClick={handleRemove}
            className="p-1 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 active:scale-95 transition-all duration-150 cursor-pointer"
            aria-label="Remove item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

CartItemRow.displayName = 'CartItemRow';
