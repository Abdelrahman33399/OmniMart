import React, { useState, useEffect } from 'react';
import { useFilterStore } from '../store/useFilterStore';
import { useCartStore } from '../store/useCartStore';
import { mockProducts } from '../utils/mockData';
import { ProductFilterSidebar } from '../components/products/ProductFilterSidebar';
import { ProductSortBar } from '../components/products/ProductSortBar';
import { ActiveFilterChips } from '../components/products/ActiveFilterChips';
import { ProductGrid } from '../components/products/ProductGrid';
import { Drawer } from '../components/ui/Drawer';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import type { Product } from '../types';
import { Star, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';

export interface ProductListingPageProps {
  lang?: 'en' | 'ar';
}

export const ProductListingPage: React.FC<ProductListingPageProps> = ({ lang = 'en' }) => {
  const {
    selectedCategories,
    selectedBrands,
    priceRange,
    minRating,
    inStockOnly,
    sortBy,
    searchQuery,
  } = useFilterStore();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<Product | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  // REAL-TIME FILTER LOGIC
  const filteredProducts = mockProducts.filter((product) => {
    // 1. Category Filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.categoryId)) {
      return false;
    }
    // 2. Brand Filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }
    // 3. Price Filter
    const effectivePrice =
      product.discountPrice !== null && product.discountPrice !== undefined
        ? product.discountPrice
        : product.price;
    if (effectivePrice < priceRange[0] || effectivePrice > priceRange[1]) {
      return false;
    }
    // 4. Rating Filter
    if (product.rating.average < minRating) {
      return false;
    }
    // 5. Stock Status Filter
    if (inStockOnly && product.stock === 0) {
      return false;
    }
    // 6. Search Query Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesEn = product.title.en.toLowerCase().includes(q);
      const matchesAr = product.title.ar.toLowerCase().includes(q);
      const matchesBrand = product.brand.toLowerCase().includes(q);
      const matchesSku = product.sku.toLowerCase().includes(q);
      if (!matchesEn && !matchesAr && !matchesBrand && !matchesSku) {
        return false;
      }
    }
    return true;
  });

  // REAL-TIME SORT LOGIC
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice !== null && a.discountPrice !== undefined ? a.discountPrice : a.price;
    const priceB = b.discountPrice !== null && b.discountPrice !== undefined ? b.discountPrice : b.price;

    switch (sortBy) {
      case 'price-low-high':
        return priceA - priceB;
      case 'price-high-low':
        return priceB - priceA;
      case 'rating':
        return b.rating.average - a.rating.average;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'featured':
      default:
        // Featured keeps product order or matches rating
        return b.isFeatured ? 1 : a.isFeatured ? -1 : 0;
    }
  });

  // Reset pagination page to 1 when filters update
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedBrands, priceRange, minRating, inStockOnly, sortBy, searchQuery]);

  // PAGINATION CALCULATIONS
  const totalItems = sortedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const addItem = useCartStore((state) => state.addItem);

  // Cart click handler
  const handleAddToCart = async (product: Product) => {
    // Micro loading delay for great UX feedback
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    // Auto-extract attributes tags for nice cart details
    const selectedAttributes: Record<string, string> = {};
    if (product.attributes) {
      Object.entries(product.attributes).forEach(([key, val]) => {
        if (typeof val === 'string') {
          selectedAttributes[key] = val;
        } else if (Array.isArray(val) && val.length > 0) {
          selectedAttributes[key] = val[0];
        } else {
          selectedAttributes[key] = String(val);
        }
      });
    }

    addItem(product, 1, selectedAttributes);
  };

  return (
    <div id="product-catalog" className="scroll-mt-20 space-y-6 text-text-main" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Search Header Info */}
      {searchQuery && (
        <div className="bg-card p-4 rounded-xl border border-border-main text-xs font-semibold text-text-muted">
          {t('Search Results for:', 'نتائج البحث عن:')} <span className="text-secondary font-black">"{searchQuery}"</span>
        </div>
      )}

      {/* Grid: Sidebar (Desktop) + Main PLP Listing Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar (inline, hidden on mobile) */}
        <div className="col-span-1 sticky top-20 hidden md:block">
          <ProductFilterSidebar lang={lang} />
        </div>

        {/* List Content Area */}
        <div className="col-span-1 md:col-span-3 space-y-6">
          {/* Sorting Bar */}
          <ProductSortBar
            totalCount={mockProducts.length}
            filteredCount={totalItems}
            lang={lang}
            onMobileFilterOpen={() => setIsMobileFilterOpen(true)}
          />

          {/* Active Filter Chips */}
          <ActiveFilterChips lang={lang} />

          {/* Product Cards Container Grid */}
          <ProductGrid
            products={paginatedProducts}
            lang={lang}
            onQuickView={(p) => setSelectedQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
          />

          {/* Pagination Controls bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border-main pt-6">
              <p className="text-xs font-semibold text-text-muted">
                {t(
                  `Showing ${startIndex + 1} to ${Math.min(startIndex + itemsPerPage, totalItems)} of ${totalItems} entries`,
                  `عرض ${startIndex + 1} إلى ${Math.min(startIndex + itemsPerPage, totalItems)} من أصل ${totalItems} مدخلات`
                )}
              </p>
              
              <div className="flex items-center gap-1.5">
                {/* Prev Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  leftIcon={<ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />}
                >
                  {t('Previous', 'السابق')}
                </Button>

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  const isCurrent = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`
                        w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer
                        ${
                          isCurrent
                            ? 'bg-secondary text-white shadow-sm'
                            : 'bg-card border border-border-main text-text-main hover:bg-surface'
                        }
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />}
                >
                  {t('Next', 'التالي')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER DRAWER PORTAL */}
      <Drawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title={t('Filter Products', 'تصفية المنتجات')}
        position="right"
      >
        <ProductFilterSidebar
          lang={lang}
          isMobile
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />
      </Drawer>

      {/* QUICK VIEW PRODUCT DETAIL MODAL PORTAL */}
      <Modal
        isOpen={selectedQuickViewProduct !== null}
        onClose={() => setSelectedQuickViewProduct(null)}
        title={
          selectedQuickViewProduct
            ? t(selectedQuickViewProduct.title.en, selectedQuickViewProduct.title.ar)
            : ''
        }
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setSelectedQuickViewProduct(null)}>
              {t('Close', 'إغلاق')}
            </Button>
            <Button
              variant="primary"
              disabled={selectedQuickViewProduct?.stock === 0}
              onClick={() => selectedQuickViewProduct && handleAddToCart(selectedQuickViewProduct)}
              leftIcon={<ShoppingBag className="w-4 h-4" />}
            >
              {t('Add to Cart', 'أضف إلى السلة')}
            </Button>
          </>
        }
      >
        {selectedQuickViewProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left rtl:text-right">
            <div className="aspect-square rounded-xl bg-surface overflow-hidden border border-border-main">
              <img
                src={selectedQuickViewProduct.images[0]}
                alt={t(selectedQuickViewProduct.title.en, selectedQuickViewProduct.title.ar)}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary dark:bg-accent/20 dark:text-accent border border-primary/10">
                  {selectedQuickViewProduct.brand}
                </span>
                {selectedQuickViewProduct.stock > 0 ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-600 dark:text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {t(`In Stock (${selectedQuickViewProduct.stock})`, `متوفر (${selectedQuickViewProduct.stock})`)}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {t('Out Of Stock', 'غير متوفر')}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs text-text-muted">SKU: {selectedQuickViewProduct.sku}</p>
                <div className="flex items-center gap-1.5 text-xs text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-text-main">
                    {selectedQuickViewProduct.rating.average}
                  </span>
                  <span className="text-text-muted">
                    ({selectedQuickViewProduct.rating.count} {t('reviews', 'تقييم')})
                  </span>
                </div>
              </div>

              {/* Attributes mapping */}
              <div className="space-y-2 border-t border-b border-border-main py-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  {t('Product Specifications', 'مواصفات المنتج')}
                </h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedQuickViewProduct.attributes).map(([key, val]) => (
                    <div key={key} className="flex flex-col p-2 bg-surface rounded-lg">
                      <span className="capitalize text-text-muted font-medium">{key}</span>
                      <span className="text-text-main font-bold mt-0.5 truncate">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price block */}
              <div className="flex items-baseline gap-2 pt-2">
                {selectedQuickViewProduct.discountPrice ? (
                  <>
                    <span className="text-2xl font-display font-black text-accent">
                      ${selectedQuickViewProduct.discountPrice.toFixed(2)}
                    </span>
                    <span className="text-sm line-through text-text-muted">
                      ${selectedQuickViewProduct.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-display font-black text-text-main">
                    ${selectedQuickViewProduct.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

ProductListingPage.displayName = 'ProductListingPage';
