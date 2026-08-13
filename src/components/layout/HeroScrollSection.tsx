import React, { useEffect, useState } from 'react';
import { useNavigationStore } from '../../store/useNavigationStore';
import {
  ChevronRight,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Shield,
  Truck,
  RefreshCw,
  Star,
  ArrowRight,
} from 'lucide-react';

export interface HeroScrollSectionProps {
  lang?: 'en' | 'ar';
}

const HERO_SLIDES = [
  {
    badge: { en: 'New Season Collection', ar: 'مجموعة الموسم الجديد' },
    title: { en: 'Shop the Future,\nToday.', ar: 'تسوّق المستقبل\nاليوم.' },
    subtitle: {
      en: 'Discover thousands of premium products curated just for you — electronics, fashion, home essentials, and more.',
      ar: 'اكتشف آلاف المنتجات المتميزة المختارة بعناية لك — إلكترونيات، أزياء، مستلزمات المنزل والمزيد.',
    },
    cta: { en: 'Shop Now', ar: 'تسوّق الآن' },
    bg: 'from-[#0F172A] via-[#1E3A5F] to-[#0F172A]',
    accent: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    tag: { en: 'Up to 40% OFF', ar: 'خصم يصل إلى 40%' },
  },
  {
    badge: { en: 'Tech Deals Week', ar: 'أسبوع عروض التقنية' },
    title: { en: 'Power Your\nWorld.', ar: 'انطلق مع أحدث\nالتقنيات.' },
    subtitle: {
      en: 'Latest smartphones, laptops, wearables — all at unbeatable prices. Limited-time flash deals await.',
      ar: 'أحدث الهواتف الذكية والحواسيب المحمولة والأجهزة القابلة للارتداء — بأسعار لا تُقاوم.',
    },
    cta: { en: 'Explore Electronics', ar: 'استكشف الإلكترونيات' },
    bg: 'from-[#1E1B4B] via-[#312E81] to-[#1E1B4B]',
    accent: '#3B82F6',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80',
    tag: { en: 'Flash Sale', ar: 'تخفيضات مؤقتة' },
  },
  {
    badge: { en: 'Home & Lifestyle', ar: 'المنزل ونمط الحياة' },
    title: { en: 'Create Your\nDream Home.', ar: 'صمّم منزل\nأحلامك.' },
    subtitle: {
      en: 'From smart lighting to premium cookware — everything your home deserves, delivered to your door.',
      ar: 'من الإضاءة الذكية إلى أدوات الطهي الفاخرة — كل ما يستحقه منزلك، يُوصَّل إلى بابك.',
    },
    cta: { en: 'Shop Home', ar: 'تسوّق المنزل' },
    bg: 'from-[#064E3B] via-[#065F46] to-[#064E3B]',
    accent: '#10B981',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    tag: { en: 'Free Shipping', ar: 'شحن مجاني' },
  },
];

const TRUST_BADGES = [
  { icon: Truck, en: 'Free Delivery', ar: 'توصيل مجاني', sub: { en: 'On orders over $50', ar: 'للطلبات فوق 50$' } },
  { icon: Shield, en: 'Secure Payment', ar: 'دفع آمن', sub: { en: '100% Protected', ar: 'محمي 100%' } },
  { icon: RefreshCw, en: 'Easy Returns', ar: 'إرجاع سهل', sub: { en: '30-day returns', ar: 'إرجاع خلال 30 يوم' } },
  { icon: Star, en: 'Top Rated', ar: 'الأعلى تقييماً', sub: { en: '4.9 / 5 stars', ar: '4.9 / 5 نجوم' } },
];

export const HeroScrollSection: React.FC<HeroScrollSectionProps> = ({ lang = 'en' }) => {
  const { setActiveTab } = useNavigationStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);
  const slide = HERO_SLIDES[currentSlide];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((s) => (s + 1) % HERO_SLIDES.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (idx: number) => {
    if (idx === currentSlide) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(idx);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="space-y-6 mb-10">
      {/* ── Main Hero Banner ── */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${slide.bg} shadow-2xl min-h-[420px] md:min-h-[500px] flex items-center transition-all duration-500`}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Background decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 bg-accent pointer-events-none" style={{ background: slide.accent }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10 bg-white pointer-events-none" />

        {/* Grid layout: text left, image right */}
        <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center px-8 md:px-12 py-10">
          {/* Left: Text Content */}
          <div
            className={`space-y-5 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}
          >
            {/* Badge row */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-white/20"
                style={{ background: `${slide.accent}30`, color: slide.accent }}
              >
                <Sparkles className="w-3 h-3" />
                {t(slide.badge.en, slide.badge.ar)}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-white/10 text-white border border-white/10 backdrop-blur-sm">
                {t(slide.tag.en, slide.tag.ar)}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight tracking-tight whitespace-pre-line">
              {t(slide.title.en, slide.title.ar)}
            </h1>

            {/* Subtitle */}
            <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-md">
              {t(slide.subtitle.en, slide.subtitle.ar)}
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 flex-wrap pt-2">
              <button
                onClick={() => setActiveTab('shop')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-primary transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                style={{ background: slide.accent }}
              >
                <ShoppingBag className="w-4 h-4" />
                {t(slide.cta.en, slide.cta.ar)}
              </button>
              <button
                onClick={() => setActiveTab('shop')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white border border-white/20 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              >
                {t('Browse All', 'تصفّح الكل')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Rating strip */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white/30 bg-white/10 flex items-center justify-center text-[9px] text-white font-bold">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-xs text-white/70">
                <span className="font-bold text-white">4.9★</span> {t('from 12,000+ reviews', 'من +12,000 تقييم')}
              </div>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div
            className={`hidden md:flex items-center justify-center transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
          >
            <div className="relative">
              <div
                className="absolute inset-0 rounded-2xl blur-2xl opacity-30 scale-110"
                style={{ background: slide.accent }}
              />
              <img
                src={slide.image}
                alt={t(slide.title.en, slide.title.ar)}
                className="relative w-72 h-72 lg:w-80 lg:h-80 rounded-2xl object-cover shadow-2xl border border-white/10"
              />
              {/* Floating stat card */}
              <div className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2.5 shadow-xl">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" style={{ color: slide.accent }} />
                  <div>
                    <p className="text-[10px] text-white/60 uppercase tracking-wider">{t('This Week', 'هذا الأسبوع')}</p>
                    <p className="text-sm font-bold text-white">+2,400 {t('orders', 'طلب')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === currentSlide
                  ? 'w-6 h-2 bg-white'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
        <button
          onClick={() => goToSlide((currentSlide + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Trust Badges Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TRUST_BADGES.map(({ icon: Icon, en, ar, sub }) => (
          <div
            key={en}
            className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border-main shadow-main hover:shadow-md transition-shadow"
          >
            <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-main">{t(en, ar)}</p>
              <p className="text-[11px] text-text-muted">{t(sub.en, sub.ar)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

HeroScrollSection.displayName = 'HeroScrollSection';
