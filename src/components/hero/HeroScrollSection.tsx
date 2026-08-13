import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ShoppingBag } from 'lucide-react';

interface HeroScrollSectionProps {
  lang?: 'en' | 'ar';
}

// Editable configuration variables
const TOTAL_FRAMES = 41;
const FRAME_EXTENSION = 'png';
const FRAME_DIRECTORY = '/frames';

export const HeroScrollSection: React.FC<HeroScrollSectionProps> = ({ lang = 'ar' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isPreloading, setIsPreloading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  // 1. Frame Preloading Logic
  useEffect(() => {
    let active = true;
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    let failed = false;

    const handleImageLoad = () => {
      if (!active) return;
      loadedCount++;
      setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));

      if (loadedCount === TOTAL_FRAMES && !failed) {
        setImages(loadedImages);
        setIsPreloading(false);
      }
    };

    const handleImageError = () => {
      if (!active) return;
      // If any image fails (e.g. 404 missing frames), fallback gracefully
      failed = true;
      setLoadFailed(true);
      setIsPreloading(false);
      console.warn('HeroScrollSection: Image frame sequence failed to load. Falling back to animated dynamic gradient hero.');
    };

    // Preload frame by frame
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `${FRAME_DIRECTORY}/${i}.${FRAME_EXTENSION}`;
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      loadedImages.push(img);
    }

    return () => {
      active = false;
    };
  }, []);

  // 2. Scroll Scrubbing and Rendering Logic
  useEffect(() => {
    if (isPreloading || loadFailed || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Helper to draw image cover-fit style
    const drawImageProp = (context: CanvasRenderingContext2D, img: HTMLImageElement) => {
      const cw = context.canvas.width;
      const ch = context.canvas.height;
      const iw = img.width;
      const ih = img.height;
      const r = Math.max(cw / iw, ch / ih);
      const nw = iw * r;
      const nh = ih * r;
      const cx = (cw - nw) / 2;
      const cy = (ch - nh) / 2;

      context.clearRect(0, 0, cw, ch);
      context.drawImage(img, cx, cy, nw, nh);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderCurrentFrame();
    };

    const renderCurrentFrame = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollHeight = rect.height - window.innerHeight;
      
      // Calculate scroll progress (0 to 1) specifically inside this container
      let progress = -rect.top / scrollHeight;
      progress = Math.max(0, Math.min(1, progress));

      // Calculate corresponding image frame index
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progress * TOTAL_FRAMES)
      );

      const img = images[frameIndex];
      if (img && img.complete) {
        drawImageProp(ctx, img);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(renderCurrentFrame);
    };

    // Set initial size and draw first frame
    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPreloading, loadFailed, images]);

  // Smooth scroll handler to the main shop listing
  const handleScrollToShop = () => {
    const target = document.getElementById('product-catalog');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const useFallback = isPreloading || loadFailed;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[250vh] bg-surface select-none"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Pinned Sticky Section */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* HTML5 Canvas for Scroll scrubbing */}
        {!useFallback ? (
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 opacity-100"
          />
        ) : (
          /* Sleek fallback animated gradient background */
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-neutral-950 animate-gradient-bg flex items-center justify-center">
            {/* Ambient glowing orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse duration-[6000ms]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse duration-[8000ms]" />
          </div>
        )}

        {/* Visual Fog & Gradient Overlays (Blending Hero to Shop) */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface pointer-events-none" />

        {/* Overlay Content Box */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6 md:space-y-8 flex flex-col items-center">
          
          {/* Tagline / Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold tracking-wider bg-accent/10 border border-accent/30 text-accent animate-bounce">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            <span>{t('⚡ Exclusive Season 2026 Offers', '⚡ عروض موسم 2026 الحصرية')}</span>
          </div>

          {/* Typography Copy */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl md:text-6xl font-display font-black tracking-tight leading-tight text-white drop-shadow-md">
              {t('OmniMart - Next-Gen Interactive Shopping', 'أومني مارت - تجربة تسوق تفاعلية سريعة ومبتكرة')}
            </h1>
            <p className="text-sm md:text-xl font-medium text-slate-200/90 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              {t(
                'Immerse yourself in a fluid web space. Discover high-quality products curated with passion and delivered instantly.',
                'انغمس في عالم تسوق مرئي تفاعلي وسلس. اكتشف منتجات متميزة مختارة بعناية فائقة لتلائم أسلوب حياتك العصري.'
              )}
            </p>
          </div>

          {/* Action CTA Button */}
          <button
            onClick={handleScrollToShop}
            className="group flex items-center gap-3 px-8 py-4 rounded-full text-sm font-black text-white bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/35 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 animate-pulse" />
            <span>{t('Shop Now', 'تسوق الآن')}</span>
          </button>

          {/* Mouse / Scroll indicator */}
          <div 
            onClick={handleScrollToShop}
            className="absolute bottom-10 flex flex-col items-center gap-2 cursor-pointer opacity-75 hover:opacity-100 transition-opacity"
          >
            <span className="text-[10px] md:text-xs font-bold text-slate-300 tracking-widest uppercase">
              {t('Scroll Down to Explore', 'انزل للأسفل لاستكشاف المنتجات')}
            </span>
            <div className="p-1 rounded-full border border-slate-400 animate-bounce duration-[1800ms]">
              <ArrowDown className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </div>

        {/* Loading Indicator for Frames Preloader */}
        {isPreloading && (
          <div className="absolute bottom-5 left-5 z-20 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/50 text-[10px] font-black text-slate-300">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
            <span>{t(`Loading interactive experience: ${loadProgress}%`, `جاري تحميل التجربة التفاعلية: ${loadProgress}%`)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

HeroScrollSection.displayName = 'HeroScrollSection';
