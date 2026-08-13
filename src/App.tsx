import { useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { ProductListingPage } from './pages/ProductListingPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { useNavigationStore } from './store/useNavigationStore';
import { useDocumentTitle } from './hooks/useDocumentTitle';

function App() {
  const [lang, setLang] = useState<'en' | 'ar'>('ar');
  const { activeTab } = useNavigationStore();

  // Call the dynamic document title synchronization hook
  useDocumentTitle(lang);

  return (
    <MainLayout lang={lang} onLangChange={setLang}>
      {activeTab === 'cart' ? (
        <CartPage lang={lang} />
      ) : activeTab === 'checkout' ? (
        <CheckoutPage lang={lang} />
      ) : activeTab === 'order-success' ? (
        <OrderSuccessPage lang={lang} />
      ) : activeTab === 'orders' ? (
        <OrdersPage lang={lang} />
      ) : activeTab === 'profile' ? (
        <ProfilePage lang={lang} />
      ) : (
        <ProductListingPage lang={lang} />
      )}
    </MainLayout>
  );
}

export default App;