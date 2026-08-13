import React, { useState, useEffect } from 'react';
import { useNavigationStore } from '../store/useNavigationStore';
import { useAuthStore } from '../store/useAuthStore';
import {
  useCartStore,
  selectSubtotal,
  selectDiscountAmount,
  selectShippingFee,
  selectGrandTotal
} from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { mockProducts } from '../utils/mockData';
import type { Order, OrderItem, Address, CustomerInfo } from '../types';
import {
  MapPin,
  CreditCard,
  Check,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  FileText,
  Lock,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export interface CheckoutPageProps {
  lang?: 'en' | 'ar';
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ lang = 'en' }) => {
  const { setActiveTab } = useNavigationStore();
  const { currentUser } = useAuthStore();
  const { items: cartItems, clearCart } = useCartStore();
  const { placeOrder, isLoading: isOrderPlacing } = useOrderStore();

  const subtotal = useCartStore(selectSubtotal);
  const discount = useCartStore(selectDiscountAmount);
  const shippingFee = useCartStore(selectShippingFee);
  const grandTotal = useCartStore(selectGrandTotal);

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  const [step, setStep] = useState(1);

  // Step 1 Form: Shipping Details
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [stateName, setStateName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  // Step 2 Form: Payment Method Selection
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Error validations
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill from currentUser
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName);
      setPhoneNumber(currentUser.phoneNumber || currentUser.phone || '');
      
      const defaultAddress = currentUser.addresses.find(a => a.isDefault) || currentUser.addresses[0];
      if (defaultAddress) {
        setCity(defaultAddress.city);
        setStreet(defaultAddress.street);
        setBuilding(defaultAddress.building || '');
        setStateName(defaultAddress.state);
        setZipCode(defaultAddress.zipCode);
      }
    }
  }, [currentUser]);

  // Card Input Masking
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formatted.substring(0, 19));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    setExpiry(formatted.substring(0, 5));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvv(value.substring(0, 4)); // support 3 or 4 digits
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!fullName.trim()) newErrors.fullName = t('Full name is required.', 'الاسم الكامل مطلوب.');
      if (!phoneNumber.trim()) newErrors.phoneNumber = t('Phone number is required.', 'رقم الهاتف مطلوب.');
      if (!street.trim()) newErrors.street = t('Street address is required.', 'اسم الشارع مطلوب.');
      if (!city.trim()) newErrors.city = t('City is required.', 'المدينة مطلوبة.');
      if (!stateName.trim()) newErrors.stateName = t('State/Region is required.', 'الولاية/المنطقة مطلوبة.');
      if (!zipCode.trim()) {
        newErrors.zipCode = t('Zip Code is required.', 'الرمز البريدي مطلوب.');
      } else if (!/^\d{4,8}$/.test(zipCode.trim())) {
        newErrors.zipCode = t('Please enter a valid Zip Code (4-8 digits).', 'يرجى إدخال رمز بريدي صالح (٤-٨ أرقام).');
      }
    }

    if (currentStep === 2 && paymentMethod === 'card') {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = t('Please enter a valid 16-digit card number.', 'يرجى إدخال رقم بطاقة صالح مكون من ١٦ رقماً.');
      }
      if (!cardHolder.trim()) newErrors.cardHolder = t('Cardholder name is required.', 'اسم صاحب البطاقة مطلوب.');
      
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expiry.trim() || !expiryRegex.test(expiry)) {
        newErrors.expiry = t('Expiry must be MM/YY.', 'تاريخ الانتهاء يجب أن يكون بصيغة شهر/سنة (MM/YY).');
      } else {
        const [month, year] = expiry.split('/').map(Number);
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          newErrors.expiry = t('Card has expired.', 'البطاقة منتهية الصلاحية.');
        }
      }

      if (!cvv.trim() || cvv.length < 3) {
        newErrors.cvv = t('Please enter a valid 3 or 4-digit CVV.', 'يرجى إدخال رمز CVV صالح مكون من ٣ أو ٤ أرقام.');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    try {
      // 1. Generate Order ID: ORD-2026-XXXX (4-character alphanumeric string)
      const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let randomPart = '';
      for (let i = 0; i < 4; i++) {
        randomPart += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
      }
      const orderId = `ORD-2026-${randomPart}`;

      // 2. Build Address Object
      const shippingAddress: Address = {
        id: `addr_checkout_${Date.now()}`,
        title: t('Checkout Address', 'عنوان الدفع'),
        recipientName: fullName,
        recipientPhone: phoneNumber,
        street,
        building,
        city,
        state: stateName,
        country: t('United States', 'الولايات المتحدة الأمريكية'),
        zipCode,
        isDefault: false,
      };

      // 3. Build Customer Info
      const customerInfo: CustomerInfo = {
        fullName,
        email: currentUser?.email || 'guest@omnimart.com',
        phoneNumber
      };

      // 4. Build Order Items
      const items: OrderItem[] = cartItems.map((item) => {
        const product = mockProducts.find((p) => p.id === item.productId);
        return {
          productId: item.productId,
          title: product ? product.title : { en: 'Product Name', ar: 'اسم المنتج' },
          quantity: item.quantity,
          selectedAttributes: item.selectedAttributes || {},
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity
        };
      });

      // 5. Build Final Order Document
      const finalOrder: Order = {
        orderId,
        userId: currentUser?.uid || null,
        customerInfo,
        items,
        shippingAddress,
        pricing: {
          subtotal,
          shippingFee,
          discount,
          total: grandTotal
        },
        paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending',
        paymentMethod: paymentMethod,
        orderStatus: 'pending',
        createdAt: new Date().toISOString()
      };

      // 6. Save using Store
      await placeOrder(finalOrder);

      // 7. Reset and Route
      clearCart();
      setActiveTab('order-success');
    } catch (err) {
      alert(t('Error placing your order. Please try again.', 'خطأ أثناء تسجيل الطلب. يرجى المحاولة مرة أخرى.'));
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 bg-card border border-border-main rounded-2xl shadow-main space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-surface border border-border-main flex items-center justify-center text-text-muted">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h2 className="font-display font-black text-2xl text-text-main">{t('Checkout is Empty', 'الدفع فارغ')}</h2>
          <p className="text-xs text-text-muted">
            {t('You must add items to your cart before proceeding to the checkout wizard.', 'يجب إضافة منتجات إلى السلة قبل التوجه إلى صفحة الدفع.')}
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={() => setActiveTab('shop')}>
          {t('Explore Storefront', 'استكشف المنتجات')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-text-main text-left rtl:text-right" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Page Header */}
      <div>
        <h2 className="font-display font-black text-2xl tracking-tight">{t('Secure Checkout', 'إتمام الدفع الآمن')}</h2>
        <p className="text-xs text-text-muted mt-0.5">
          {t('Complete your order parameters in 3 simple phases.', 'أكمل عملية الشراء في ٣ خطوات بسيطة.')}
        </p>
      </div>

      {/* Responsive Progress Stepper Wizard */}
      <div className="flex items-center justify-center max-w-lg mx-auto mb-10 font-display">
        <div className="flex items-center w-full">
          {/* Step 1 */}
          <div className="flex flex-col items-center relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
              step >= 1 ? 'bg-secondary text-white' : 'bg-card border border-border-main text-text-muted'
            }`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider mt-2 text-text-main">
              {t('Shipping', 'الشحن')}
            </span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
            step >= 2 ? 'bg-secondary' : 'bg-border-main'
          }`} />
          
          {/* Step 2 */}
          <div className="flex flex-col items-center relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
              step >= 2 ? 'bg-secondary text-white' : 'bg-card border border-border-main text-text-muted'
            }`}>
              {step > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider mt-2 text-text-main">
              {t('Payment', 'الدفع')}
            </span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
            step >= 3 ? 'bg-secondary' : 'bg-border-main'
          }`} />
          
          {/* Step 3 */}
          <div className="flex flex-col items-center relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
              step === 3 ? 'bg-secondary text-white' : 'bg-card border border-border-main text-text-muted'
            }`}>
              3
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider mt-2 text-text-main">
              {t('Review', 'المراجعة')}
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Active Step Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border-main rounded-2xl p-6 shadow-main animate-fade-in">
            
            {/* Step 1 Panel: Shipping Address */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="border-b border-border-main pb-4">
                  <h3 className="text-lg font-display font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-secondary" />
                    {t('Shipping Address Details', 'تفاصيل عنوان الشحن')}
                  </h3>
                  <p className="text-xs text-text-muted mt-1">
                    {t('Enter your recipient information and physical destination address.', 'أدخل معلومات المستلم وتفاصيل العنوان الفعلي للشحن.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={t('Full Name', 'الاسم الكامل')}
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('Alex Rodriguez', 'ألكس رودريغيز')}
                    error={errors.fullName}
                  />
                  <Input
                    label={t('Phone Number', 'رقم الهاتف')}
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    error={errors.phoneNumber}
                  />
                </div>

                <Input
                  label={t('Street Address', 'عنوان الشارع / الحي')}
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder={t('742 Evergreen Terrace', '٧٤٢ إيفرجرين تيراس')}
                  error={errors.street}
                />

                <Input
                  label={t('Building / Suite (Optional)', 'المبنى / الشقة')}
                  type="text"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder={t('e.g., Apt 12B, Bldg 3', 'مثال: شقة 12B، مبنى 3')}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label={t('City', 'المدينة')}
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Springfield"
                    error={errors.city}
                  />
                  <Input
                    label={t('State / Region', 'الولاية / المنطقة')}
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="IL"
                    error={errors.stateName}
                  />
                  <Input
                    label={t('Zip / Postal Code', 'الرمز البريدي')}
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="62704"
                    error={errors.zipCode}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-main flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-text-muted" />
                    {t('Special Delivery Instructions (Optional)', 'تعليمات خاصة بالتوصيل (اختياري)')}
                  </label>
                  <textarea
                    rows={3}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="block w-full rounded-lg border border-border-main bg-card text-text-main text-sm p-3 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all placeholder:text-text-muted/50"
                    placeholder={t('e.g., Leave package at front door, ring doorbell...', 'مثال: اترك الطرد عند الباب الأمامي، رن الجرس...')}
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-border-main">
                  <Button
                    variant="primary"
                    onClick={handleNextStep}
                    rightIcon={lang === 'en' ? <ChevronRight className="w-4 h-4" /> : undefined}
                    leftIcon={lang === 'ar' ? <ChevronLeft className="w-4 h-4" /> : undefined}
                    className="font-bold cursor-pointer"
                  >
                    {t('Continue to Payment', 'المتابعة للدفع')}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2 Panel: Payment Method Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="border-b border-border-main pb-4">
                  <h3 className="text-lg font-display font-bold flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-secondary" />
                    {t('Payment Method Selection', 'طريقة الدفع')}
                  </h3>
                  <p className="text-xs text-text-muted mt-1">
                    {t('Choose your preferred method and complete payment credentials.', 'اختر طريقة الدفع المفضلة وأدخل البيانات اللازمة.')}
                  </p>
                </div>

                {/* Method selector buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('card');
                      setErrors({});
                    }}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left rtl:text-right cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-secondary bg-secondary/5 ring-1 ring-secondary'
                        : 'border-border-main hover:bg-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'card' ? 'border-secondary bg-secondary' : 'border-text-muted'
                      }`}>
                        {paymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-main">{t('Credit / Debit Card', 'بطاقة ائتمانية / دفع')}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">{t('Pay securely with Visa, MasterCard, etc.', 'ادفع بأمان عبر فيزا، ماستركارد، إلخ.')}</p>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-text-muted shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('cod');
                      setErrors({});
                    }}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left rtl:text-right cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-secondary bg-secondary/5 ring-1 ring-secondary'
                        : 'border-border-main hover:bg-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'cod' ? 'border-secondary bg-secondary' : 'border-text-muted'
                      }`}>
                        {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-main">{t('Cash on Delivery (COD)', 'الدفع عند الاستلام')}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">{t('Pay with cash when order arrives.', 'ادفع نقداً عند استلام الطلب مباشرة.')}</p>
                      </div>
                    </div>
                    <ShoppingBag className="w-5 h-5 text-text-muted shrink-0" />
                  </button>
                </div>

                {/* Card input details form */}
                {paymentMethod === 'card' ? (
                  <div className="space-y-4 border border-border-main p-4 rounded-xl bg-surface animate-fade-in">
                    <Input
                      label={t('Cardholder Name', 'اسم صاحب البطاقة')}
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Alex Rodriguez"
                      error={errors.cardHolder}
                    />

                    <Input
                      label={t('Card Number', 'رقم البطاقة')}
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="0000 0000 0000 0000"
                      error={errors.cardNumber}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label={t('Expiration Date', 'تاريخ الانتهاء')}
                        type="text"
                        required
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        error={errors.expiry}
                      />
                      <Input
                        label="CVV"
                        type="password"
                        required
                        value={cvv}
                        onChange={handleCvvChange}
                        placeholder="123"
                        error={errors.cvv}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-surface border border-border-main rounded-xl text-xs text-text-muted flex items-start gap-3 animate-fade-in">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-text-main">{t('Cash Payment Terms Selected', 'تم اختيار الدفع النقدي')}</p>
                      <p className="mt-1 leading-relaxed">
                        {t(
                          'An additional COD handling fee may be added by carriers. Please make sure to have the exact amount ready upon physical courier delivery.',
                          'قد تضيف شركة الشحن رسوماً إضافية لمعالجة الدفع النقدي. يرجى توفير المبلغ المحدد للمندوب عند استلام الطرد.'
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border-main">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    leftIcon={lang === 'en' ? <ChevronLeft className="w-4 h-4" /> : undefined}
                    rightIcon={lang === 'ar' ? <ChevronLeft className="w-4 h-4" /> : undefined}
                    className="font-bold cursor-pointer"
                  >
                    {t('Back to Shipping', 'العودة للشحن')}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleNextStep}
                    rightIcon={lang === 'en' ? <ChevronRight className="w-4 h-4" /> : undefined}
                    leftIcon={lang === 'ar' ? <ChevronLeft className="w-4 h-4" /> : undefined}
                    className="font-bold cursor-pointer"
                  >
                    {t('Review Order', 'مراجعة الطلب')}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3 Panel: Review & Confirm */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="border-b border-border-main pb-4">
                  <h3 className="text-lg font-display font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-secondary" />
                    {t('Order Review & Confirmation', 'مراجعة وتأكيد الطلب')}
                  </h3>
                  <p className="text-xs text-text-muted mt-1">
                    {t('Verify all information details below before finalizing your transaction.', 'يرجى مراجعة تفاصيل الطلب أدناه وتأكيدها قبل إتمام الشراء.')}
                  </p>
                </div>

                {/* Shipping & Payment Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Address Summary */}
                  <div className="border border-border-main rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('Shipping Destination', 'عنوان التوصيل')}</span>
                      <button onClick={() => setStep(1)} className="text-xs text-secondary hover:underline cursor-pointer font-semibold">{t('Edit', 'تعديل')}</button>
                    </div>
                    <div className="text-xs space-y-1 text-text-main font-medium">
                      <p className="font-bold text-sm">{fullName}</p>
                      <p>{phoneNumber}</p>
                      <p className="text-text-muted">{street}, {city}, {stateName}, {zipCode}</p>
                      {specialInstructions.trim() && (
                        <p className="text-[10px] text-accent font-bold mt-1 bg-accent/5 p-1.5 rounded-lg">
                          {t('Instruction:', 'ملاحظة:')} {specialInstructions}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="border border-border-main rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('Payment Method', 'طريقة الدفع')}</span>
                      <button onClick={() => setStep(2)} className="text-xs text-secondary hover:underline cursor-pointer font-semibold">{t('Edit', 'تعديل')}</button>
                    </div>
                    <div className="text-xs space-y-2">
                      {paymentMethod === 'card' ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <CreditCard className="w-3 h-3" />
                            {t('Credit / Debit Card', 'بطاقة ائتمانية')}
                          </span>
                          <p className="font-bold text-text-main mt-1">
                            Visa/MasterCard &bull;&bull;&bull;&bull; {cardNumber.slice(-4)}
                          </p>
                          <p className="text-[10px] text-text-muted">{t('Cardholder:', 'اسم المالك:')} {cardHolder}</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-600 dark:text-green-400">
                            <ShoppingBag className="w-3 h-3" />
                            {t('Cash on Delivery (COD)', 'الدفع عند الاستلام')}
                          </span>
                          <p className="text-text-muted mt-1 leading-relaxed">{t('Pay with cash upon physical courier arrival.', 'سيتم دفع المبلغ نقداً للمندوب عند استلام الشحنة.')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Checkout Summary Table */}
                <div className="border border-border-main rounded-xl overflow-hidden">
                  <div className="bg-surface px-4 py-2 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border-main">
                    {t('Itemized Order Summary', 'تفاصيل المنتجات')}
                  </div>
                  <div className="divide-y divide-border-main">
                    {cartItems.map((item, idx) => {
                      const product = mockProducts.find((p) => p.id === item.productId);
                      return (
                        <div key={idx} className="flex items-center justify-between gap-4 p-4 text-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={product?.images[0]}
                              alt={product ? t(product.title.en, product.title.ar) : ''}
                              className="w-10 h-10 rounded-lg object-cover border border-border-main shrink-0"
                            />
                            <div>
                              <h4 className="font-bold text-text-main">
                                {product ? t(product.title.en, product.title.ar) : t('Unknown Product', 'منتج غير معروف')}
                              </h4>
                              <div className="flex flex-wrap gap-x-2 text-[10px] text-text-muted mt-0.5">
                                {Object.entries(item.selectedAttributes || {}).map(([k, v]) => (
                                  <span key={k}>
                                    <span className="capitalize">{k}</span>: {v}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right whitespace-nowrap">
                            <p className="font-bold text-text-main">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                            <p className="text-[10px] text-text-muted">
                              {item.quantity} x ${item.unitPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Buttons block */}
                <div className="flex items-center justify-between pt-4 border-t border-border-main">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    leftIcon={lang === 'en' ? <ChevronLeft className="w-4 h-4" /> : undefined}
                    rightIcon={lang === 'ar' ? <ChevronLeft className="w-4 h-4" /> : undefined}
                    disabled={isOrderPlacing}
                    className="font-bold cursor-pointer"
                  >
                    {t('Back to Payment', 'العودة للدفع')}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handlePlaceOrder}
                    isLoading={isOrderPlacing}
                    leftIcon={<Lock className="w-4 h-4" />}
                    className="font-bold bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:ring-green-500/50 cursor-pointer"
                  >
                    {t('Place Order & Pay', 'تأكيد ودفع الطلب')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-card border border-border-main rounded-2xl p-6 shadow-main space-y-4">
            <h3 className="font-display font-bold text-base border-b border-border-main pb-3">
              {t('Summary & Pricing', 'ملخص الحساب')}
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-text-muted">
                <span>{t('Subtotal', 'المجموع الفرعي')}</span>
                <span className="font-medium text-text-main">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>{t('Shipping Fee', 'رسوم الشحن')}</span>
                <span className="font-medium text-text-main">
                  {shippingFee === 0 ? t('FREE', 'مجاني') : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span className="flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    {t('Discount Applied', 'الخصم المطبق')}
                  </span>
                  <span className="font-bold">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border-main pt-3 flex justify-between text-sm font-bold text-text-main">
                <span>{t('Total Price Paid', 'السعر الإجمالي')}</span>
                <span className="text-accent text-base">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border-main rounded-2xl p-4.5 text-[11px] text-text-muted flex items-start gap-3">
            <Lock className="w-4 h-4 text-green-500 shrink-0" />
            <div>
              <p className="font-bold text-text-main">{t('SSL Secure Payments', 'مدفوعات آمنة SSL')}</p>
              <p className="mt-0.5 leading-relaxed">
                {t(
                  'Your credentials are fully hashed via PCI-DSS standards. We never record complete card numbers on servers.',
                  'بياناتك مشفرة تماماً عبر معايير PCI-DSS. لا نقوم بحفظ تفاصيل بطاقتك الائتمانية على خوادمنا.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CheckoutPage.displayName = 'CheckoutPage';
