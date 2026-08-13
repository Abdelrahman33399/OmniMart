import React, { useState } from 'react';
import type { Product } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Heart, Star, Eye, ShoppingCart } from 'lucide-react';

export interface ProductCardProps {
  product: Product;
  lang?: 'en' | 'ar';
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void | Promise<void>;
  onWishlistToggle?: (productId: string, isWishlisted: boolean) => void;
  isInitiallyWishlisted?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang = 'en',
  onQuickView,
  onAddToCart,
  onWishlistToggle,
  isInitiallyWishlisted = false,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(isInitiallyWishlisted);
  const [isAdding, setIsAdding] = useState(false);

  const t = (enText: string, arText: string) => (lang === 'en' ? enText : arText);

  const hasDiscount =
    product.discountPrice !== null &&
    product.discountPrice !== undefined &&
    product.discountPrice < product.price;

  const discountPercentage = hasDiscount
    ? Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100)
    : 0;

  const isOutOfStock = product.stock === 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    if (onWishlistToggle) {
      onWishlistToggle(product.id, nextState);
    }
  };

  const handleAddToCartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onAddToCart) return;
    setIsAdding(true);
    try {
      await onAddToCart(product);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-border-main bg-card shadow-main hover:shadow-lg transition-all duration-300 overflow-hidden text-left"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Top Action Bar (Discount Badge & Wishlist Heart) */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {hasDiscount ? (
          <Badge variant="amber" size="sm" className="pointer-events-auto">
            {discountPercentage}% {t('OFF', 'خصم')}
          </Badge>
        ) : (
          <div />
        )}
        <button
          onClick={handleWishlistClick}
          className={`
            p-2 rounded-full backdrop-blur-md bg-white/70 dark:bg-[#0B0F17]/70 text-text-muted hover:text-red-500 hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm border border-black/5 dark:border-white/5 pointer-events-auto cursor-pointer
            ${isWishlisted ? 'text-red-500! fill-red-500 dark:fill-red-500' : ''}
          `}
          aria-label={t('Add to Wishlist', 'إضافة للمفضلة')}
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Image Container */}
      <div className="aspect-square relative w-full overflow-hidden bg-surface">
        <img
          src={product.images[0]}
          alt={t(product.title.en, product.title.ar)}
          className={`
            object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105
            ${isOutOfStock ? 'scale-100 group-hover:scale-100 opacity-60' : ''}
          `}
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
            <span className="px-4 py-2 rounded-xl bg-red-600 text-white font-display font-extrabold text-sm uppercase tracking-wider shadow-lg">
              {t('Out of Stock', 'نفذت الكمية')}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Brand & Category Tag */}
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-text-muted">
            <span>{product.brand}</span>
            <span>{t(product.categoryId.replace('cat_', ''), product.categoryId.replace('cat_', ''))}</span>
          </div>

          {/* Localized Title */}
          <h3 className="font-display font-bold text-base text-text-main line-clamp-2 min-h-[3rem] group-hover:text-secondary transition-colors duration-200">
            {t(product.title.en, product.title.ar)}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating.average)
                      ? 'fill-current'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-text-main pl-1">{product.rating.average}</span>
            <span className="text-[10px] text-text-muted">({product.rating.count})</span>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="flex items-baseline gap-2">
          {hasDiscount ? (
            <>
              <span className="font-display font-black text-xl text-accent">
                ${product.discountPrice?.toFixed(2)}
              </span>
              <span className="text-xs line-through text-text-muted">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-display font-black text-xl text-text-main">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Footer Actions */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-border-main">
          {/* Quick View Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuickView && onQuickView(product)}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            {t('Quick View', 'عرض سريع')}
          </Button>

          {/* Add to Cart Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCartClick}
            disabled={isOutOfStock}
            isLoading={isAdding}
            leftIcon={<ShoppingCart className="w-3.5 h-3.5" />}
          >
            {t('Add to Cart', 'أضف للسلة')}
          </Button>
        </div>
      </div>
    </div>
  );
};

ProductCard.displayName = 'ProductCard';
