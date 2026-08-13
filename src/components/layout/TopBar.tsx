import React from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { Sun, Moon, Globe, HelpCircle } from 'lucide-react';

export interface TopBarProps {
  currentLang: 'en' | 'ar';
  onLangChange: (lang: 'en' | 'ar') => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentLang, onLangChange }) => {
  const { theme, toggleTheme } = useThemeStore();

  const t = (en: string, ar: string) => (currentLang === 'en' ? en : ar);

  return (
    <div className="bg-primary text-white py-2 px-4 text-xs font-medium border-b border-white/5 dark:bg-slate-950 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Announcement Ticker */}
        <div className="text-center sm:text-left flex items-center gap-1.5 animate-pulse">
          <span className="text-accent font-bold">⚡</span>
          <span>
            {t(
              'Flash Sale: Free Shipping on orders over $50 | Code: OMNI2026',
              'تخفيضات كبرى: شحن مجاني للطلبات فوق 50 دولاراً | الكود: OMNI2026'
            )}
          </span>
        </div>

        {/* Utility Controls */}
        <div className="flex items-center gap-4.5">
          {/* Support Link */}
          <a
            href="#support"
            className="flex items-center gap-1 hover:text-accent transition-colors duration-200"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('Help & Support', 'المساعدة والدعم')}</span>
          </a>

          <span className="w-px h-3 bg-white/20" />

          {/* Language Selector */}
          <button
            onClick={() => onLangChange(currentLang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1 hover:text-accent transition-colors duration-200 cursor-pointer"
            aria-label="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-secondary" />
            <span>{currentLang === 'en' ? 'العربية' : 'English'}</span>
          </button>

          <span className="w-px h-3 bg-white/20" />

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1 hover:text-accent transition-colors duration-200 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-accent" />
                <span>{t('Light Mode', 'الوضع الفاتح')}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span>{t('Dark Mode', 'الوضع الداكن')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

TopBar.displayName = 'TopBar';
