import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Address } from '../../types';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Home,
  Briefcase,
  Check,
  Building
} from 'lucide-react';

export interface AddressBookProps {
  lang?: 'en' | 'ar';
}

export const AddressBook: React.FC<AddressBookProps> = ({ lang = 'en' }) => {
  const { currentUser, updateUserAddresses, isLoading } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Form error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);
  const addresses = currentUser?.addresses || [];

  const openAddModal = () => {
    setEditingAddress(null);
    setTitle('');
    setRecipientName(currentUser?.fullName || '');
    setRecipientPhone(currentUser?.phoneNumber || currentUser?.phone || '');
    setStreet('');
    setBuilding('');
    setCity('');
    setStateName('');
    setZipCode('');
    setIsDefault(addresses.length === 0); // default if first address
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setTitle(addr.title);
    setRecipientName(addr.recipientName || currentUser?.fullName || '');
    setRecipientPhone(addr.recipientPhone || '');
    setStreet(addr.street);
    setBuilding(addr.building || '');
    setCity(addr.city);
    setStateName(addr.state);
    setZipCode(addr.zipCode);
    setIsDefault(addr.isDefault);
    setErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = t('Label/Title is required (e.g. Home, Office).', 'العنوان مطلوب (مثال: المنزل، العمل).');
    if (!recipientName.trim()) errs.recipientName = t('Recipient full name is required.', 'اسم المستلم الكامل مطلوب.');
    if (!recipientPhone.trim()) errs.recipientPhone = t('Recipient phone number is required.', 'رقم هاتف المستلم مطلوب.');
    if (!street.trim()) errs.street = t('Street address is required.', 'اسم الشارع مطلوب.');
    if (!city.trim()) errs.city = t('City is required.', 'المدينة مطلوبة.');
    if (!stateName.trim()) errs.stateName = t('State/Region is required.', 'الولاية/المنطقة مطلوبة.');
    if (!zipCode.trim()) {
      errs.zipCode = t('Zip Code is required.', 'الرمز البريدي مطلوب.');
    } else if (!/^\d{4,8}$/.test(zipCode.trim())) {
      errs.zipCode = t('Please enter a valid Zip Code (4-8 digits).', 'يرجى إدخال رمز بريدي صالح (٤-٨ أرقام).');
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let updatedAddresses = [...addresses];

    const addressData: Address = {
      id: editingAddress ? editingAddress.id : `addr_${Date.now()}`,
      title,
      recipientName,
      recipientPhone,
      street,
      building,
      city,
      state: stateName,
      country: t('United States', 'الولايات المتحدة'),
      zipCode,
      isDefault
    };

    // If setting as default, clear default status from other addresses
    if (isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }

    if (editingAddress) {
      const idx = updatedAddresses.findIndex((a) => a.id === editingAddress.id);
      if (idx > -1) {
        updatedAddresses[idx] = addressData;
      }
    } else {
      updatedAddresses.push(addressData);
    }

    // Double check if there's only one address, make it default
    if (updatedAddresses.length === 1) {
      updatedAddresses[0].isDefault = true;
    }

    try {
      await updateUserAddresses(updatedAddresses);
      setIsModalOpen(false);
    } catch (err) {
      alert(t('Failed to save address details.', 'فشل حفظ تفاصيل العنوان.'));
    }
  };

  const handleDelete = async (addressId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!window.confirm(t('Are you sure you want to delete this address?', 'هل أنت متأكد من حذف هذا العنوان؟'))) return;

    let updatedAddresses = addresses.filter((a) => a.id !== addressId);
    
    // If we deleted the default address, promote another to default
    const deletedAddress = addresses.find((a) => a.id === addressId);
    if (deletedAddress?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }

    try {
      await updateUserAddresses(updatedAddresses);
    } catch (err) {
      alert(t('Failed to delete address.', 'فشل حذف العنوان.'));
    }
  };

  const getAddressIcon = (lbl: string) => {
    const l = lbl.toLowerCase();
    if (l.includes('home') || l.includes('بيت') || l.includes('منزل')) return <Home className="w-4 h-4 text-secondary" />;
    if (l.includes('work') || l.includes('office') || l.includes('عمل') || l.includes('مكتب')) return <Briefcase className="w-4 h-4 text-emerald-500" />;
    return <MapPin className="w-4 h-4 text-text-muted" />;
  };

  return (
    <div className="space-y-6 text-left rtl:text-right animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header and Trigger */}
      <div className="flex items-center justify-between border-b border-border-main pb-4">
        <div>
          <h3 className="font-display font-black text-xl text-text-main">{t('Your Delivery Address Book', 'دفتر عناوين التوصيل')}</h3>
          <p className="text-xs text-text-muted mt-0.5">
            {t('Manage your delivery destinations for checkout pre-filling.', 'إدارة وتحديث عناوين التوصيل الخاصة بك لتسهيل الدفع.')}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={openAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold cursor-pointer"
        >
          {t('Add New Address', 'إضافة عنوان جديد')}
        </Button>
      </div>

      {/* Grid of Addresses */}
      {addresses.length === 0 ? (
        <div className="bg-card border border-border-main rounded-2xl p-12 text-center shadow-main space-y-4">
          <div className="mx-auto w-12 h-12 rounded-xl bg-surface border border-border-main flex items-center justify-center text-text-muted">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="font-display font-bold text-sm text-text-main">{t('No Saved Addresses', 'لا توجد عناوين مسجلة')}</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              {t(
                'You have not added any delivery addresses to your account book yet.',
                'لم تقم بإضافة أي عناوين توصيل لحسابك حتى الآن.'
              )}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={openAddModal}>
            {t('Register First Address', 'سجل عنوانك الأول')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => openEditModal(addr)}
              className={`bg-card border p-5 rounded-2xl flex flex-col justify-between gap-4 cursor-pointer hover:shadow-md transition-all relative ${
                addr.isDefault
                  ? 'border-secondary ring-1 ring-secondary/35'
                  : 'border-border-main'
              }`}
            >
              <div className="space-y-3">
                {/* Title and default badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getAddressIcon(addr.title)}
                    <span className="font-display font-bold text-sm text-text-main">{addr.title}</span>
                  </div>
                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-green-500/10 text-green-600 dark:text-green-400">
                      <Check className="w-2.5 h-2.5" />
                      {t('Default', 'الرئيسي')}
                    </span>
                  )}
                </div>

                {/* Recipient Details */}
                <div className="text-xs space-y-1 font-medium text-text-muted">
                  <p className="font-bold text-text-main">{addr.recipientName || currentUser?.fullName}</p>
                  <p>{addr.recipientPhone}</p>
                  <p className="leading-relaxed mt-1">
                    {addr.building && `${t('Bldg', 'مبنى')} ${addr.building}, `}
                    {addr.street}, {addr.city}, {addr.state}, {addr.zipCode}
                  </p>
                </div>
              </div>

              {/* Edit and Delete Actions */}
              <div className="flex items-center justify-end gap-2 border-t border-border-main pt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(addr);
                  }}
                  className="p-2 text-text-muted hover:text-secondary hover:bg-surface rounded-xl transition cursor-pointer"
                  aria-label={t('Edit Address', 'تعديل العنوان')}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => handleDelete(addr.id, e)}
                  className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/5 rounded-xl transition cursor-pointer"
                  aria-label={t('Delete Address', 'حذف العنوان')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Dialog Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAddress ? t('Update Address Details', 'تحديث تفاصيل العنوان') : t('Create New Delivery Address', 'إضافة عنوان شحن جديد')}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('Address Tag Title', 'تسمية العنوان')}
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('e.g., Home, Work, Parents', 'مثال: المنزل، العمل، الوالدين')}
              error={errors.title}
              disabled={isLoading}
            />
            <Input
              label={t('Recipient Name', 'اسم المستلم الكامل')}
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Alex Rodriguez"
              error={errors.recipientName}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('Recipient Phone', 'رقم هاتف المستلم')}
              type="tel"
              required
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              placeholder="+1 (555) 019-2834"
              error={errors.recipientPhone}
              disabled={isLoading}
            />
            <Input
              label={t('Building / Suite (Optional)', 'المبنى / الشقة')}
              type="text"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              placeholder={t('e.g., Bldg 42, Suite 3B', 'مثال: مبنى ٤٢، شقة ٣ب')}
              leftIcon={<Building className="w-3.5 h-3.5" />}
              disabled={isLoading}
            />
          </div>

          <Input
            label={t('Street Name / Location', 'اسم الشارع / الحي')}
            type="text"
            required
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder={t('742 Evergreen Terrace', '٧٤٢ إيفرجرين تيراس')}
            error={errors.street}
            disabled={isLoading}
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
              disabled={isLoading}
            />
            <Input
              label={t('State / Region', 'الولاية / المنطقة')}
              type="text"
              required
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              placeholder="IL"
              error={errors.stateName}
              disabled={isLoading}
            />
            <Input
              label={t('Zip / Postal Code', 'الرمز البريدي')}
              type="text"
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="62704"
              error={errors.zipCode}
              disabled={isLoading}
            />
          </div>

          {/* Set as default checkbox */}
          <div className="flex items-center gap-2 pt-2 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer font-bold select-none text-text-main">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                disabled={isLoading || (editingAddress?.isDefault && addresses.length > 1)} // cannot uncheck default if multiple exist
                className="rounded border-border-main text-secondary focus:ring-secondary focus:ring-offset-0 cursor-pointer"
              />
              <span>{t('Mark as default delivery address', 'تعيين كعنوان توصيل رئيسي')}</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border-main">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
              className="font-bold cursor-pointer"
            >
              {t('Cancel', 'إلغاء')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="font-bold cursor-pointer"
            >
              {t('Save Address', 'حفظ العنوان')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

AddressBook.displayName = 'AddressBook';
