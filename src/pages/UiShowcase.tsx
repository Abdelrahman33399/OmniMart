import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Drawer } from '../components/ui/Drawer';
import { Skeleton } from '../components/ui/Skeleton';
import { ProductCard } from '../components/common/ProductCard';
import { mockProducts } from '../utils/mockData';
import { useCartStore } from '../store/useCartStore';
import type { Product } from '../types';
import {
  Send,
  Search,
  User,
  Mail,
  Lock,
  Trash2,
  ShoppingBag,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Star,
} from 'lucide-react';


export const UiShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [demoLang, setDemoLang] = useState<'en' | 'ar'>('en');

  // Input states
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [country, setCountry] = useState('');
  const [countryError, setCountryError] = useState('');

  const t = (en: string, ar: string) => (demoLang === 'en' ? en : ar);

  const triggerUsernameValidation = (val: string) => {
    setUsername(val);
    if (val.length < 3) {
      setUsernameError('Username must be at least 3 characters.');
    } else {
      setUsernameError('');
    }
  };

  const triggerCountryValidation = (val: string) => {
    setCountry(val);
    if (!val) {
      setCountryError('Please select a country.');
    } else {
      setCountryError('');
    }
  };

  // Mock handlers
  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async (product: Product) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Choose some attributes for cart visualizer
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

  const handleWishlistToggle = (id: string, isFav: boolean) => {
    console.log(`Product ${id} wishlist toggled: ${isFav}`);
  };

  return (
    <div className="space-y-12" dir={demoLang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Component Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-main">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-text-main flex items-center gap-2">
            <Sliders className="w-8 h-8 text-secondary" />
            {t('Atomic UI Components Library', 'مكتبة مكونات واجهة المستخدم الذرية')}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {t(
              'Showcasing production-ready, accessible, and theme-synchronized components for OmniMart.',
              'استعراض المكونات الجاهزة للإنتاج، سهلة الوصول، والمتوافقة مع المظهر العام لأومني مارت.'
            )}
          </p>
        </div>
        <button
          onClick={() => setDemoLang(demoLang === 'en' ? 'ar' : 'en')}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-surface border border-border-main hover:bg-card text-text-main transition-colors cursor-pointer self-start md:self-auto"
        >
          <span>{demoLang === 'en' ? 'إظهار باللغة العربية' : 'Switch Showcase to English'}</span>
        </button>
      </div>

      {/* Buttons Showcase Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-display font-extrabold text-text-main border-l-4 border-secondary pl-3 rtl:border-l-0 rtl:border-r-4 rtl:pr-3">
          {t('1. Button Variants & Sizes', '١. متغيرات وأحجام الأزرار')}
        </h2>
        <div className="bg-card rounded-2xl border border-border-main p-6 space-y-6 shadow-main">
          {/* Button Sizes Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              {t('Button Sizes', 'أحجام الأزرار')}
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="sm">
                {t('Small Size (sm)', 'حجم صغير (sm)')}
              </Button>
              <Button variant="primary" size="md">
                {t('Medium Size (md)', 'حجم متوسط (md)')}
              </Button>
              <Button variant="primary" size="lg">
                {t('Large Size (lg)', 'حجم كبير (lg)')}
              </Button>
            </div>
          </div>

          {/* Button Styles Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              {t('Button Variants', 'متغيرات الأزرار')}
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">{t('Primary Navy/Amber', 'رئيسي كحلي/أمبر')}</Button>
              <Button variant="secondary">{t('Secondary Indigo', 'ثانوي إنديجو')}</Button>
              <Button variant="outline">{t('Outline Border', 'إطار خارجي')}</Button>
              <Button variant="ghost">{t('Ghost Style', 'شفاف بدون حدود')}</Button>
              <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}>
                {t('Danger Action', 'إجراء خطر')}
              </Button>
            </div>
          </div>

          {/* Button States */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              {t('Special Button States', 'حالات الأزرار الخاصة')}
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" isLoading>
                {t('Loading Spinner', 'جاري التحميل')}
              </Button>
              <Button variant="secondary" disabled>
                {t('Disabled State', 'معطل')}
              </Button>
              <Button variant="outline" rightIcon={<Send className="w-4 h-4" />}>
                {t('With Right Icon', 'مع أيقونة يمين')}
              </Button>
              <Button variant="primary" fullWidth className="max-w-xs">
                {t('Full Width Button', 'زر كامل العرض')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Badges Showcase Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-display font-extrabold text-text-main border-l-4 border-secondary pl-3 rtl:border-l-0 rtl:border-r-4 rtl:pr-3">
          {t('2. Badge Variants & Sizes', '٢. متغيرات وأحجام شارات التنبيه')}
        </h2>
        <div className="bg-card rounded-2xl border border-border-main p-6 space-y-6 shadow-main">
          {/* Sizes and Variants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                {t('Standard Badges (md)', 'شارات التنبيه العادية (md)')}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="navy">Navy Badge</Badge>
                <Badge variant="blue">Blue Badge</Badge>
                <Badge variant="amber">Amber Badge</Badge>
                <Badge variant="success">Success (In Stock)</Badge>
                <Badge variant="danger">Danger (Out of Stock)</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                {t('Micro Badges (sm)', 'شارات التنبيه المصغرة (sm)')}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="navy" size="sm">Navy</Badge>
                <Badge variant="blue" size="sm">Blue</Badge>
                <Badge variant="amber" size="sm">Amber</Badge>
                <Badge variant="success" size="sm">Success</Badge>
                <Badge variant="danger" size="sm">Danger</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Controls Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-display font-extrabold text-text-main border-l-4 border-secondary pl-3 rtl:border-l-0 rtl:border-r-4 rtl:pr-3">
          {t('3. Form Input & Select Controls', '٣. عناصر التحكم في الإدخال والاختيار')}
        </h2>
        <div className="bg-card rounded-2xl border border-border-main p-6 shadow-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Examples */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted pb-2 border-b border-border-main">
                {t('Text Input Fields', 'حقول إدخال النصوص')}
              </h3>

              {/* Standard Input */}
              <Input
                label={t('Email Address', 'عنوان البريد الإلكتروني')}
                placeholder="name@omnimart.com"
                leftIcon={<Mail className="w-4 h-4" />}
                helperText={t('We will never share your email address.', 'لن نشارك بريدك الإلكتروني مع أي أحد.')}
              />

              {/* Validation Input */}
              <Input
                label={t('Choose Username', 'اختر اسم المستخدم')}
                value={username}
                onChange={(e) => triggerUsernameValidation(e.target.value)}
                error={usernameError}
                placeholder="alex_dev"
                leftIcon={<User className="w-4 h-4" />}
              />

              {/* Disabled Input */}
              <Input
                label={t('API Key (Read Only)', 'مفتاح واجهة البرمجيات (للقراءة فقط)')}
                value="omnimart_pk_live_8237bba8d23e8e78f78dce5932822a"
                leftIcon={<Lock className="w-4 h-4" />}
                disabled
              />
            </div>

            {/* Select Examples */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted pb-2 border-b border-border-main">
                {t('Dropdown Selector Fields', 'حقول القوائم المنسدلة')}
              </h3>

              {/* Standard Select */}
              <Select
                label={t('Preferred Currency', 'العملة المفضلة')}
                placeholder={t('Select Currency', 'اختر العملة')}
                options={[
                  { value: 'USD', label: 'US Dollar ($)' },
                  { value: 'EUR', label: 'Euro (€)' },
                  { value: 'SAR', label: 'Saudi Riyal (SAR)' },
                  { value: 'AED', label: 'UAE Dirham (AED)' },
                ]}
              />

              {/* Validation Select */}
              <Select
                label={t('Select Country', 'اختر الدولة')}
                value={country}
                onChange={(e) => triggerCountryValidation(e.target.value)}
                error={countryError}
                options={[
                  { value: 'US', label: 'United States' },
                  { value: 'UK', label: 'United Kingdom' },
                  { value: 'SA', label: 'Saudi Arabia' },
                  { value: 'AE', label: 'United Arab Emirates' },
                ]}
              />

              {/* Full Width Select with Icon */}
              <Select
                label={t('Filter Category', 'تصفية حسب الفئة')}
                leftIcon={<Search className="w-4 h-4" />}
                options={[
                  { value: 'electronics', label: 'Electronics' },
                  { value: 'fashion', label: 'Fashion & Apparel' },
                  { value: 'home', label: 'Home & Living' },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Overlays / Modal & Drawer Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-display font-extrabold text-text-main border-l-4 border-secondary pl-3 rtl:border-l-0 rtl:border-r-4 rtl:pr-3">
          {t('4. Interactive Overlays & Modals', '٤. تراكبات النوافذ المنبثقة والمسحوبات')}
        </h2>
        <div className="bg-card rounded-2xl border border-border-main p-6 space-y-4 shadow-main">
          <p className="text-sm text-text-muted">
            {t(
              'Test background scroll locking, keyboard ESC dismiss, click away triggers, and slide in/out animations.',
              'اختبر قفل التمرير للخلفية، والإغلاق عبر زر ESC، والإغلاق عند الضغط خارج النافذة، وتأثيرات الانزلاق.'
            )}
          </p>
          <div className="flex flex-wrap gap-4">
            {/* Modal Trigger */}
            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
              {t('Open Test Modal', 'فتح النافذة المنبثقة')}
            </Button>

            {/* Drawer Trigger */}
            <Button variant="outline" onClick={() => setIsDrawerOpen(true)}>
              {t('Open Shopping Cart Drawer', 'فتح مسحوب سلة المشتريات')}
            </Button>
          </div>
        </div>
      </section>

      {/* Skeleton Loaders Showcase Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-display font-extrabold text-text-main border-l-4 border-secondary pl-3 rtl:border-l-0 rtl:border-r-4 rtl:pr-3">
          {t('5. Skeleton Loading Placeholders', '٥. هياكل التحميل المؤقتة')}
        </h2>
        <div className="bg-card rounded-2xl border border-border-main p-6 space-y-8 shadow-main">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Text & Circular Skeletons */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                {t('Profile & Text Skeletons', 'شخصية ونصوص مؤقتة')}
              </h3>
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" width="60%" height={16} />
                  <Skeleton variant="text" width="40%" height={12} />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Skeleton variant="text" height={14} />
                <Skeleton variant="text" height={14} />
                <Skeleton variant="text" width="85%" height={14} />
              </div>
            </div>

            {/* Rectangular Skeletons */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                {t('Rectangular Blocks', 'كتل مستطيلة مؤقتة')}
              </h3>
              <Skeleton variant="rectangular" height={120} />
              <div className="flex gap-2">
                <Skeleton variant="rectangular" className="flex-1" height={36} />
                <Skeleton variant="rectangular" className="flex-1" height={36} />
              </div>
            </div>

            {/* Compound Card Skeleton */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                {t('Compound Card Skeleton', 'هيكل بطاقة متكامل')}
              </h3>
              <Skeleton variant="card" />
            </div>
          </div>
        </div>
      </section>

      {/* Shared E-Commerce Product Card Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-extrabold text-text-main border-l-4 border-secondary pl-3 rtl:border-l-0 rtl:border-r-4 rtl:pr-3">
            {t('6. High-Fidelity Product Card Grid', '٦. شبكة بطاقات المنتجات عالية الدقة')}
          </h2>
          <span className="text-xs text-text-muted uppercase tracking-widest font-bold">
            {t('Shared Component', 'مكون مشترك')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={demoLang}
              onQuickView={handleQuickView}
              onAddToCart={handleAddToCart}
              onWishlistToggle={handleWishlistToggle}
              isInitiallyWishlisted={product.id === 'prod_101' || product.id === 'prod_104'}
            />
          ))}
        </div>
      </section>

      {/* Test Modal Render */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('Account Deactivation Warning', 'تحذير إلغاء تنشيط الحساب')}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              {t('Cancel', 'إلغاء')}
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                alert('Deactivating account...');
                setIsModalOpen(false);
              }}
            >
              {t('Confirm Deactivate', 'تأكيد الإلغاء')}
            </Button>
          </>
        }
      >
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-text-main text-base">
              {t('Are you absolutely sure you want to deactivate your account?', 'هل أنت متأكد تماماً من رغبتك في إلغاء تنشيط حسابك؟')}
            </h4>
            <p className="text-text-muted text-xs leading-relaxed">
              {t(
                'This action is irreversible and all your ongoing orders, pending refunds, and custom addresses will be permanently purged from the server databases.',
                'هذا الإجراء لا يمكن التراجع عنه وسيتم مسح جميع طلباتك الجارية واسترداد الأموال المعلقة والعناوين المخصصة بشكل دائم من قواعد بيانات الخادم.'
              )}
            </p>
          </div>
        </div>
      </Modal>

      {/* Test Quick View Modal Render */}
      <Modal
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct ? t(selectedProduct.title.en, selectedProduct.title.ar) : ''}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setSelectedProduct(null)}>
              {t('Close', 'إغلاق')}
            </Button>
            <Button
              variant="primary"
              disabled={selectedProduct?.stock === 0}
              onClick={() => selectedProduct && handleAddToCart(selectedProduct)}
              leftIcon={<ShoppingBag className="w-4 h-4" />}
            >
              {t('Add to Cart', 'أضف إلى السلة')}
            </Button>
          </>
        }
      >
        {selectedProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-square rounded-xl bg-surface overflow-hidden border border-border-main">
              <img
                src={selectedProduct.images[0]}
                alt={t(selectedProduct.title.en, selectedProduct.title.ar)}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="navy">{selectedProduct.brand}</Badge>
                {selectedProduct.stock > 0 ? (
                  <Badge variant="success">In Stock ({selectedProduct.stock})</Badge>
                ) : (
                  <Badge variant="danger">Out Of Stock</Badge>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs text-text-muted">SKU: {selectedProduct.sku}</p>
                <div className="flex items-center gap-1.5 text-xs text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-text-main">{selectedProduct.rating.average}</span>
                  <span className="text-text-muted">({selectedProduct.rating.count} {t('reviews', 'تقييم')})</span>
                </div>
              </div>

              {/* Attributes */}
              <div className="space-y-2 border-t border-b border-border-main py-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('Product Details', 'تفاصيل المنتج')}</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedProduct.attributes).map(([key, val]) => (
                    <div key={key} className="flex flex-col p-2 bg-surface rounded-lg">
                      <span className="capitalize text-text-muted font-medium">{key}</span>
                      <span className="text-text-main font-bold mt-0.5 truncate">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                {selectedProduct.discountPrice ? (
                  <>
                    <span className="text-2xl font-display font-black text-accent">${selectedProduct.discountPrice.toFixed(2)}</span>
                    <span className="text-sm line-through text-text-muted">${selectedProduct.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-2xl font-display font-black text-text-main">${selectedProduct.price.toFixed(2)}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Test Drawer Render */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={t('Shopping Cart (Active)', 'سلة المشتريات (النشطة)')}
        position="right"
      >
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 text-secondary rounded-xl text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>{t('You qualify for FREE shipping!', 'أنت مؤهل للشحن المجاني!')}</span>
              </div>
            </div>

            {/* Sample items inside Drawer */}
            <div className="divide-y divide-border-main">
              <div className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-surface border border-border-main overflow-hidden flex-shrink-0">
                    <img
                      src={mockProducts[0].images[0]}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-text-main text-xs line-clamp-1">
                      {t(mockProducts[0].title.en, mockProducts[0].title.ar)}
                    </h5>
                    <p className="text-[10px] text-text-muted mt-0.5">RAM: 32GB Unified Memory</p>
                    <p className="text-[11px] text-text-main font-semibold mt-1">1 &times; $1,699.99</p>
                  </div>
                </div>
                <button className="text-xs font-semibold text-red-500 hover:underline cursor-pointer">
                  {t('Remove', 'إزالة')}
                </button>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-surface border border-border-main overflow-hidden flex-shrink-0">
                    <img
                      src={mockProducts[1].images[0]}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-text-main text-xs line-clamp-1">
                      {t(mockProducts[1].title.en, mockProducts[1].title.ar)}
                    </h5>
                    <p className="text-[10px] text-text-muted mt-0.5">Conn: Bluetooth 5.3</p>
                    <p className="text-[11px] text-text-main font-semibold mt-1">2 &times; $299.99</p>
                  </div>
                </div>
                <button className="text-xs font-semibold text-red-500 hover:underline cursor-pointer">
                  {t('Remove', 'إزالة')}
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-border-main pt-5 mt-auto space-y-4 bg-card">
            <div className="space-y-1.5 text-xs text-text-muted">
              <div className="flex justify-between">
                <span>{t('Subtotal', 'المجموع الفرعي')}</span>
                <span className="font-bold text-text-main">$2,299.97</span>
              </div>
              <div className="flex justify-between">
                <span>{t('Shipping Fee', 'رسوم الشحن')}</span>
                <span className="font-bold text-green-600 dark:text-green-400">{t('FREE', 'مجاني')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-text-main pt-2 border-t border-border-main">
                <span>{t('Total Estimated', 'الإجمالي التقديري')}</span>
                <span className="text-accent">$2,299.97</span>
              </div>
            </div>
            <Button variant="primary" fullWidth size="lg">
              {t('Proceed to Checkout', 'الذهاب إلى الدفع')}
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
export default UiShowcase;
