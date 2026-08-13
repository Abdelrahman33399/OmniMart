import { useEffect } from 'react';
import { useNavigationStore, type NavTab } from '../store/useNavigationStore';

const TAB_TITLES: Record<NavTab, { en: string; ar: string }> = {
  shop: {
    en: 'OmniMart | Next-Gen Shopping',
    ar: 'أومني مارت | المتجر الرقمي المتكامل',
  },
  cart: {
    en: 'OmniMart | Shopping Cart',
    ar: 'أومني مارت | عربة التسوق',
  },
  checkout: {
    en: 'OmniMart | Secure Checkout',
    ar: 'أومني مارت | إتمام الشراء الآمن',
  },
  'order-success': {
    en: 'OmniMart | Order Completed',
    ar: 'أومني مارت | تم الطلب بنجاح',
  },
  orders: {
    en: 'OmniMart | My Orders',
    ar: 'أومني مارت | طلباتي',
  },
  profile: {
    en: 'OmniMart | My Profile',
    ar: 'أومني مارت | الملف الشخصي',
  },
};

export const useDocumentTitle = (lang: 'en' | 'ar' = 'ar') => {
  const activeTab = useNavigationStore((state) => state.activeTab);

  useEffect(() => {
    const titles = TAB_TITLES[activeTab] || TAB_TITLES.shop;
    document.title = lang === 'en' ? titles.en : titles.ar;
  }, [activeTab, lang]);
};
