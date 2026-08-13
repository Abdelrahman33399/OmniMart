import React from 'react';
import { mockCategories } from '../../utils/mockData';
import { ArrowRight, Tag } from 'lucide-react';

export interface CategoryMegaMenuProps {
  lang?: 'en' | 'ar';
}

export const CategoryMegaMenu: React.FC<CategoryMegaMenuProps> = ({ lang = 'en' }) => {
  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  // Static mock subcategories representing detailed categories
  const getSubcategories = (catId: string) => {
    switch (catId) {
      case 'cat_electronics':
        return [
          { name: t('Laptops & Computers', 'أجهزة الكمبيوتر والمحمول'), link: '#laptops' },
          { name: t('Smartphones & Tablets', 'الهواتف الذكية والأجهزة اللوحية'), link: '#phones' },
          { name: t('Audio & Headphones', 'الصوتيات وسماعات الرأس'), link: '#audio' },
          { name: t('Smart Wearables', 'الأجهزة الذكية القابلة للارتداء'), link: '#wearables' },
          { name: t('Smart TV & Displays', 'أجهزة تلفزيون وشاشات ذكية'), link: '#tv' },
          { name: t('Power Banks & Chargers', 'شواحن وبطاريات احتياطية'), link: '#chargers' },
        ];
      case 'cat_fashion':
        return [
          { name: t('Mens Apparel', 'ملابس رجالية'), link: '#men' },
          { name: t('Womens Apparel', 'ملابس نسائية'), link: '#women' },
          { name: t('Watches & Jewelry', 'الساعات والمجوهرات'), link: '#accessories' },
          { name: t('Footwear Collection', 'مجموعة الأحذية'), link: '#shoes' },
          { name: t('Bags & Backpacks', 'حقائب وشنط الظهر'), link: '#bags' },
          { name: t('Sunglasses & Eyewear', 'نظارات شمسية'), link: '#eyewear' },
        ];
      case 'cat_home':
        return [
          { name: t('Office & Study Furniture', 'أثاث المكاتب والدراسة'), link: '#study' },
          { name: t('Kitchen Appliances', 'أجهزة المطبخ'), link: '#kitchen' },
          { name: t('Cookware & Knives', 'أواني الطهي والسكاكين'), link: '#cookware' },
          { name: t('Air Purifiers', 'منقيات الهواء'), link: '#purifiers' },
          { name: t('Smart Lighting', 'الإضاءة الذكية'), link: '#lighting' },
          { name: t('Home Accessories', 'إكسسوارات المنزل'), link: '#home-acc' },
        ];
      case 'cat_beauty':
        return [
          { name: t('Skincare & Serums', 'العناية بالبشرة والسيرومات'), link: '#skincare' },
          { name: t('Hair Care & Styling', 'العناية بالشعر والتصفيف'), link: '#haircare' },
          { name: t('Personal Care Tools', 'أدوات العناية الشخصية'), link: '#tools' },
          { name: t('Oral Hygiene', 'صحة الفم والأسنان'), link: '#oral' },
          { name: t('Massage & Recovery', 'التدليك والتعافي'), link: '#massage' },
          { name: t('Vitamins & Supplements', 'الفيتامينات والمكملات'), link: '#supplements' },
        ];
      case 'cat_sports':
        return [
          { name: t('Yoga & Fitness Mats', 'متسابق اليوغا واللياقة'), link: '#yoga' },
          { name: t('Weights & Kettlebells', 'الأثقال والكيتل بيل'), link: '#weights' },
          { name: t('Camping & Hiking', 'التخييم والتنزه'), link: '#camping' },
          { name: t('Hydration & Nutrition', 'الترطيب والتغذية'), link: '#nutrition' },
          { name: t('Running & Trail Gear', 'معدات الجري والمسالك'), link: '#running' },
          { name: t('Outdoor Adventure', 'مغامرات الهواء الطلق'), link: '#outdoor' },
        ];
      default:
        return [
          { name: t('New Arrivals', 'وصلنا حديثاً'), link: '#new' },
          { name: t('Best Sellers', 'الأكثر مبيعاً'), link: '#best' },
        ];
    }
  };

  // Static promos per category
  const getPromo = (catId: string) => {
    switch (catId) {
      case 'cat_electronics':
        return {
          title: t('Up to 20% Off Smart Tech', 'خصم يصل إلى 20٪ على التقنية الذكية'),
          cta: t('Shop Electronics', 'تسوق الإلكترونيات'),
          img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=300&q=80',
        };
      case 'cat_fashion':
        return {
          title: t('Buy 1 Get 1 Summer Wear', 'اشتري 1 واحصل على 1 ملابس صيفية'),
          cta: t('Explore Outfits', 'اكتشف الأزياء'),
          img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80',
        };
      case 'cat_home':
        return {
          title: t('Home Refresh Deals', 'عروض تجديد منزلك'),
          cta: t('View Home & Kitchen', 'عرض المنزل والمطبخ'),
          img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80',
        };
      case 'cat_beauty':
        return {
          title: t('Glow Up This Season', 'تألقي هذا الموسم بأجمل العروض'),
          cta: t('Shop Beauty', 'تسوق الجمال والصحة'),
          img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=300&q=80',
        };
      case 'cat_sports':
        return {
          title: t('Train Harder, Recover Better', 'تدرب بشكل أقوى وتعاف بشكل أسرع'),
          cta: t('Shop Sports', 'تسوق الرياضة'),
          img: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=300&q=80',
        };
      default:
        return {
          title: t('Exclusive Flash Deals', 'عروض حصرية لفترة محدودة'),
          cta: t('Browse All Deals', 'تصفح جميع العروض'),
          img: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=300&q=80',
        };
    }
  };

  return (
    <nav
      className="hidden md:block bg-card text-text-main border-b border-border-main text-sm font-semibold transition-colors duration-300 relative z-30"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Horizontal Navigation List */}
        <div className="flex items-center gap-1">
          {mockCategories.map((category) => {
            const subs = getSubcategories(category.id);
            const promo = getPromo(category.id);

            return (
              <div key={category.id} className="group relative">
                {/* Category Header Link */}
                <a
                  href={`#${category.slug}`}
                  className="inline-flex items-center gap-1.5 px-4.5 py-3.5 hover:text-secondary group-hover:bg-surface border-b-2 border-transparent group-hover:border-secondary transition-all duration-200"
                >
                  <span>{t(category.name.en, category.name.ar)}</span>
                </a>

                {/* Dropdown Mega Menu (Pure CSS Group-Hover) */}
                <div className="absolute top-full left-0 rtl:left-auto rtl:right-0 mt-0.5 w-[580px] bg-card border border-border-main shadow-2xl rounded-b-2xl p-6 hidden group-hover:grid grid-cols-3 gap-6 animate-fade-in z-50">
                  {/* Column 1: Subcategories List */}
                  <div className="col-span-2 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted pb-1.5 border-b border-border-main">
                      {t('Categories & Brands', 'الفئات والماركات')}
                    </h4>
                    <ul className="grid grid-cols-2 gap-3 text-xs">
                      {subs.map((sub, idx) => (
                        <li key={idx}>
                          <a
                            href={sub.link}
                            className="text-text-main hover:text-secondary hover:underline flex items-center gap-1.5"
                          >
                            <span className="w-1 h-1 rounded-full bg-border-main" />
                            {sub.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 2: Promo Card */}
                  <div className="col-span-1 bg-surface border border-border-main rounded-xl p-3 flex flex-col justify-between overflow-hidden relative">
                    <div className="aspect-video w-full rounded-lg overflow-hidden relative">
                      <img
                        src={promo.img}
                        alt="Promo image"
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/30" />
                    </div>
                    <div className="space-y-1.5 pt-2">
                      <p className="font-display font-bold text-xs leading-snug text-text-main">
                        {promo.title}
                      </p>
                      <a
                        href="#promo"
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-secondary hover:underline cursor-pointer"
                      >
                        <span>{promo.cta}</span>
                        <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tag line/Promotion */}
        <div className="flex items-center gap-1.5 text-xs text-accent font-bold">
          <Tag className="w-3.5 h-3.5 fill-accent/20" />
          <span>{t('Hot Deals: Up to 50% Off Everything', 'العروض الساخنة: خصومات تصل إلى 50٪')}</span>
        </div>
      </div>
    </nav>
  );
};

CategoryMegaMenu.displayName = 'CategoryMegaMenu';
