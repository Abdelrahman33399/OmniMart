import React, { useState } from 'react';
import type { Product } from '../../types';
import { useFilterStore } from '../../store/useFilterStore';
import { ProductCard } from '../common/ProductCard';
import { Skeleton } from '../ui/Skeleton';
import { Button } from '../ui/Button';
import { Star, Eye, ShoppingCart, Heart, Inbox } from 'lucide-react';
import { mockCategories } from '../../utils/mockData';

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  lang?: 'en' | 'ar';
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void | Promise<void>;
  onWishlistToggle?: (productId: string, isFav: boolean) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  lang = 'en',
  onQuickView,
  onAddToCart,
  onWishlistToggle,
}) => {
  const { viewMode, resetFilters } = useFilterStore();
  const [wishlistState, setWishlistState] = useState<Record<string, boolean>>({
    prod_101: true,
    prod_104: true,
  });

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  const handleWishlistClick = (productId: string, state: boolean) => {
    setWishlistState((prev) => ({ ...prev, [productId]: state }));
    if (onWishlistToggle) onWishlistToggle(productId, state);
  };

  // Skeleton grid placeholder
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`}>
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
    );
  }

  // EMPTY STATE
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 bg-card border border-border-main rounded-2xl shadow-main space-y-5">
        <div className="w-16 h-16 rounded-full bg-surface border border-border-main flex items-center justify-center text-text-muted">
          <Inbox className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h3 className="font-display font-bold text-lg text-text-main">
            {t('No Products Found', 'لم يتم العثور على منتجات')}
          </h3>
          <p className="text-xs text-text-muted">
            {t(
              'No products match your current filtering criteria. Try resetting all filters or refining search query.',
              'لا توجد منتجات تطابق معايير التصفية الحالية الخاصة بك. حاول إعادة تعيين الفلاتر أو تغيير كلمة البحث.'
            )}
          </p>
        </div>
        <Button variant="secondary" onClick={() => resetFilters()}>
          {t('Reset All Filters', 'إعادة تعيين كل الفلاتر')}
        </Button>
      </div>
    );
  }

  // GRID VIEW MODE
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            lang={lang}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
            onWishlistToggle={(id, fav) => handleWishlistClick(id, fav)}
            isInitiallyWishlisted={!!wishlistState[product.id]}
          />
        ))}
      </div>
    );
  }

  // LIST VIEW MODE (Horizontal Full-Width Cards)
  return (
    <div className="space-y-4.5 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {products.map((product) => {
        const hasDiscount =
          product.discountPrice !== null &&
          product.discountPrice !== undefined &&
          product.discountPrice < product.price;

        const discountPercentage = hasDiscount
          ? Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100)
          : 0;

        const isOutOfStock = product.stock === 0;
        const isWishlisted = !!wishlistState[product.id];

        const [isAdding, setIsAdding] = useState(false);

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

        const getCategoryName = (id: string) => {
          const category = mockCategories.find((c) => c.id === id);
          return category ? t(category.name.en, category.name.ar) : id;
        };

        return (
          <div
            key={product.id}
            className="flex flex-col sm:flex-row rounded-2xl border border-border-main bg-card shadow-main hover:shadow-lg transition-all duration-300 overflow-hidden text-left"
          >
            {/* Left/Start side: Image Container */}
            <div className="aspect-square sm:w-48 sm:h-full relative overflow-hidden bg-surface flex-shrink-0">
              <img
                src={product.images[0]}
                alt={t(product.title.en, product.title.ar)}
                className={`
                  object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105
                  ${isOutOfStock ? 'scale-100 opacity-60' : ''}
                `}
              />

              {/* Badges overlay */}
              <div className="absolute top-2 left-2 rtl:left-auto rtl:right-2 flex flex-col gap-1.5">
                {hasDiscount && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-accent text-primary leading-none uppercase shadow-xs">
                    {discountPercentage}% {t('OFF', 'خصم')}
                  </span>
                )}
                {product.isFeatured && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-secondary text-white leading-none uppercase shadow-xs">
                    {t('Featured', 'مميز')}
                  </span>
                )}
              </div>

              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-display font-extrabold text-[10px] uppercase tracking-wider">
                    {t('Out of Stock', 'نفذت')}
                  </span>
                </div>
              )}
            </div>

            {/* Middle part: Content Area */}
            <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  <span>{product.brand}</span>
                  <span>&bull;</span>
                  <span>{getCategoryName(product.categoryId)}</span>
                </div>

                <h3 className="font-display font-black text-lg text-text-main hover:text-secondary transition-colors duration-200 line-clamp-1">
                  {t(product.title.en, product.title.ar)}
                </h3>

                {/* Rating stars */}
                <div className="flex items-center gap-1.5">
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
                  <span className="text-xs font-bold text-text-main">{product.rating.average}</span>
                  <span className="text-[10px] text-text-muted">({product.rating.count} {t('reviews', 'مراجعة')})</span>
                </div>

                {/* Micro specification description lists */}
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <span
                      key={key}
                      className="inline-flex items-center px-2 py-1 bg-surface border border-border-main rounded-md text-[10px] text-text-muted font-medium"
                    >
                      <span className="capitalize font-bold text-text-main pr-1 rtl:pr-0 rtl:pl-1">{key}:</span>
                      {String(value)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Far Right: Pricing & Actions Container */}
            <div className="sm:w-56 p-5 border-t sm:border-t-0 sm:border-l rtl:sm:border-l-0 rtl:sm:border-r border-border-main flex flex-col justify-between bg-surface/20 shrink-0 text-left rtl:text-right">
              {/* Pricing section */}
              <div className="space-y-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  {t('Price Breakdown', 'سعر السلعة')}
                </span>
                <div className="flex items-baseline gap-2">
                  {hasDiscount ? (
                    <>
                      <span className="text-2xl font-display font-black text-accent leading-none">
                        ${product.discountPrice?.toFixed(2)}
                      </span>
                      <span className="text-xs line-through text-text-muted leading-none">
                        ${product.price.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-display font-black text-text-main leading-none">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                {/* Stock Tag indicator */}
                <div className="pt-2">
                  {product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 dark:text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      {t(`In Stock (${product.stock})`, `متوفر في المخزن (${product.stock})`)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      {t('Out of Stock', 'نفذت الكمية')}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-border-main sm:border-t-0 sm:pt-0">
                <Button
                  variant="primary"
                  fullWidth
                  size="sm"
                  onClick={handleAddToCartClick}
                  disabled={isOutOfStock}
                  isLoading={isAdding}
                  leftIcon={<ShoppingCart className="w-3.5 h-3.5" />}
                >
                  {t('Add to Cart', 'أضف للسلة')}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onQuickView && onQuickView(product)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    className="py-1"
                  >
                    {t('Details', 'تفاصيل')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleWishlistClick(product.id, !isWishlisted)}
                    leftIcon={<Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'text-red-500 fill-red-500' : ''}`} />}
                    className="py-1"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

ProductGrid.displayName = 'ProductGrid';
