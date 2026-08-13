import React, { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { Tag, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export interface CartPromoInputProps {
  lang?: 'en' | 'ar';
}

export const CartPromoInput: React.FC<CartPromoInputProps> = ({ lang = 'en' }) => {
  const { promoCode, discountPercentage, applyPromoCode, removePromoCode } = useCartStore();
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const res = applyPromoCode(code);
    setFeedback({ success: res.success, message: res.message });

    if (res.success) {
      setCode('');
    }
  };

  const handleRemove = () => {
    removePromoCode();
    setFeedback(null);
  };

  return (
    <div className="space-y-2.5 text-text-main text-left rtl:text-right" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* If code is already active, show details tag info */}
      {promoCode ? (
        <div className="flex items-center justify-between p-3.5 bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-900/30 rounded-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <Tag className="w-4.5 h-4.5 text-green-600 dark:text-green-400" />
            <div className="text-xs">
              <span className="font-extrabold text-green-700 dark:text-green-300">{promoCode}</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {' '}
                ({discountPercentage}% {t('Discount Applied', 'خصم مطبق')})
              </span>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-1 rounded-lg text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition cursor-pointer"
            aria-label="Remove Promo Code"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (feedback) setFeedback(null);
            }}
            placeholder={t('Promo code (OMNI2026)', 'رمز الترويج (OMNI2026)')}
            className="flex-1 px-3 py-2 border border-border-main bg-card text-text-main font-bold rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            disabled={!code.trim()}
            className="px-4 py-2 font-bold cursor-pointer"
          >
            {t('Apply', 'تطبيق')}
          </Button>
        </form>
      )}

      {/* Validation Message Alerts */}
      {feedback && !promoCode && (
        <div
          className={`flex items-start gap-1.5 text-[10px] font-bold ${
            feedback.success ? 'text-green-600' : 'text-red-500'
          } animate-fade-in`}
        >
          {feedback.success ? (
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
};

CartPromoInput.displayName = 'CartPromoInput';
