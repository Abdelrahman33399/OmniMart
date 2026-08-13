import React from 'react';
import { Check, Clipboard, Clock, Package, Truck, Home } from 'lucide-react';

export interface OrderStatusTimelineProps {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  lang?: 'en' | 'ar';
}

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  status,
  createdAt,
  lang = 'en',
}) => {
  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  // Map status to active step (1 to 5)
  let activeStep = 1;
  if (status === 'processing') activeStep = 2;
  else if (status === 'shipped') activeStep = 3;
  else if (status === 'delivered') activeStep = 5; // Skip Out for Delivery (step 4) directly to Delivered (step 5) or let's place shipped=3, out-for-delivery=4, delivered=5. If shipped, let's make it step 3. If delivered, let's make it step 5!

  const steps = [
    {
      step: 1,
      label: t('Order Placed', 'تم تقديم الطلب'),
      desc: new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      icon: <Clipboard className="w-4 h-4" />,
    },
    {
      step: 2,
      label: t('Warehouse Processing', 'قيد التجهيز'),
      desc: t('Verification & packing', 'التحقق والتعبئة'),
      icon: <Clock className="w-4 h-4" />,
    },
    {
      step: 3,
      label: t('Shipped / In Transit', 'تم الشحن / بالطريق'),
      desc: t('Carrier: DHL Express', 'الشحن عبر DHL Express'),
      icon: <Truck className="w-4 h-4" />,
    },
    {
      step: 4,
      label: t('Out for Delivery', 'خارج للتوصيل'),
      desc: t('Local courier transit', 'مع المندوب المحلي'),
      icon: <Package className="w-4 h-4" />,
    },
    {
      step: 5,
      label: t('Delivered', 'تم الاستلام'),
      desc: t('Handed to recipient', 'تم التسليم للمستلم'),
      icon: <Home className="w-4 h-4" />,
    },
  ];

  if (status === 'cancelled') {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-semibold" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <XCircle className="w-5 h-5 shrink-0" />
        <div>
          <p className="font-bold text-sm">{t('This order has been Cancelled', 'تم إلغاء هذا الطلب')}</p>
          <p className="font-medium mt-0.5">{t('Fulfillment activities were terminated. Refund processes have been initiated.', 'تم إنهاء عمليات التوصيل للطلب. بدأت إجراءات استرداد الأموال.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Visual Stepper bar */}
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-4 py-4">
        {steps.map((item, index) => {
          const isCompleted = activeStep >= item.step;
          const isActive = activeStep === item.step || (item.step === 4 && activeStep === 3); // out for delivery is active if shipped
          const isLineCompleted = activeStep > item.step;
          
          return (
            <React.Fragment key={item.step}>
              {/* Step item */}
              <div className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 md:text-center text-left rtl:text-right relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 z-10 ${
                  isCompleted
                    ? 'bg-green-500 text-white shadow-sm ring-4 ring-green-500/10'
                    : isActive
                    ? 'bg-secondary text-white shadow-sm ring-4 ring-secondary/10'
                    : 'bg-card border border-border-main text-text-muted'
                }`}>
                  {isCompleted && item.step < activeStep ? <Check className="w-4 h-4" /> : item.icon}
                </div>
                <div className="space-y-0.5">
                  <p className={`text-[11px] font-bold tracking-tight transition-colors ${
                    isCompleted || isActive ? 'text-text-main' : 'text-text-muted'
                  }`}>
                    {item.label}
                  </p>
                  <p className="text-[9px] text-text-muted font-medium">{item.desc}</p>
                </div>
              </div>

              {/* Progress Line Connector */}
              {index < steps.length - 1 && (
                <div className={`hidden md:block flex-1 h-0.5 mx-1.5 transition-colors duration-300 ${
                  isLineCompleted ? 'bg-green-500' : 'bg-border-main'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Carrier Info Details Block if Shipped or Delivered */}
      {(status === 'shipped' || status === 'delivered') && (
        <div className="p-4 bg-surface rounded-xl border border-border-main text-xs space-y-1.5 text-text-muted">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <span className="font-bold text-text-main">{t('Carrier service:', 'شركة الشحن:')}</span>{' '}
              <span className="font-semibold text-text-main">DHL Express Global</span>
            </div>
            <div>
              <span className="font-bold text-text-main">{t('Tracking Number:', 'رقم التتبع:')}</span>{' '}
              <span className="font-mono font-bold text-secondary">OMNI-TRK-2026-{(createdAt.replace(/\D/g, '') || '92837').slice(-4)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { XCircle } from 'lucide-react';
OrderStatusTimeline.displayName = 'OrderStatusTimeline';
