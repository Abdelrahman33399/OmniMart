import React from 'react';
import { useCartStore, selectSubtotal, selectFreeShippingRemaining } from '../../store/useCartStore';

export interface FreeShippingBarProps {
  lang?: 'en' | 'ar';
}

export const FreeShippingBar: React.FC<FreeShippingBarProps> = ({ lang = 'en' }) => {
  const subtotal = useCartStore(selectSubtotal);
  const remaining = useCartStore(selectFreeShippingRemaining);
  const threshold = useCartStore((state) => state.freeShippingThreshold);

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  if (subtotal === 0) return null;

  // Percentage calculation
  const percentage = Math.min(100, Math.round((subtotal / threshold) * 100));
  const isUnlocked = subtotal >= threshold;

  return (
    <div className="space-y-2 text-text-main" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Visual Bar Container */}
      <div className="flex items-center justify-between text-xs font-bold">
        <span>
          {isUnlocked ? (
            <span className="text-green-600 dark:text-green-400">
              {t('🎉 You unlocked FREE Shipping!', '🎉 لقد حصلت على شحن مجاني!')}
            </span>
          ) : (
            <span className="text-text-muted">
              {t('Add ', 'أضف ')}
              <span className="text-secondary font-black">${remaining.toFixed(2)}</span>
              {t(' more for FREE Shipping!', ' أكثر للحصول على شحن مجاني!')}
            </span>
          )}
        </span>
        <span className="text-[10px] text-text-muted bg-surface px-1.5 py-0.5 rounded border border-border-main">
          {percentage}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="relative w-full h-2 rounded-full bg-border-main overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${
            isUnlocked ? 'bg-green-500' : 'bg-gradient-to-r from-secondary to-accent'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

FreeShippingBar.displayName = 'FreeShippingBar';
