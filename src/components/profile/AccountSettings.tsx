import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import {
  User as UserIcon,
  Phone,
  Lock,
  Mail,
  CheckCircle,
  AlertCircle,
  KeyRound
} from 'lucide-react';

export interface AccountSettingsProps {
  lang?: 'en' | 'ar';
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ lang = 'en' }) => {
  const { currentUser, updateProfileInfo, sendPasswordReset, isLoading, authError } = useAuthStore();
  
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [infoSuccess, setInfoSuccess] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  // Initialize form fields
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName);
      setPhoneNumber(currentUser.phoneNumber || currentUser.phone || '');
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoSuccess(false);
    setValidationError('');

    if (!fullName.trim()) {
      setValidationError(t('Full name cannot be empty.', 'الاسم الكامل لا يمكن أن يكون فارغاً.'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setValidationError(t('Please enter a valid email address.', 'يرجى إدخال بريد إلكتروني صالح.'));
      return;
    }

    try {
      await updateProfileInfo(fullName, phoneNumber, email);
      setInfoSuccess(true);
      setTimeout(() => setInfoSuccess(false), 4000); // hide success alert after 4s
    } catch (err) {
      // Handled by store authError
    }
  };

  const handleResetClick = async () => {
    setPwdSuccess(false);
    try {
      await sendPasswordReset();
      setPwdSuccess(true);
      setTimeout(() => setPwdSuccess(false), 5000);
    } catch (err) {
      // Handled by store authError
    }
  };

  return (
    <div className="space-y-8 text-left rtl:text-right animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="border-b border-border-main pb-4">
        <h3 className="font-display font-black text-xl text-text-main">{t('Account Profile Settings', 'إعدادات الملف الشخصي')}</h3>
        <p className="text-xs text-text-muted mt-0.5">
          {t('Update your personal details and manage account credentials.', 'تحديث معلوماتك الشخصية وإدارة إعدادات الأمان الخاصة بك.')}
        </p>
      </div>

      {/* Main Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Personal Details Form */}
        <div className="lg:col-span-2 bg-card border border-border-main p-6 rounded-2xl shadow-main space-y-6">
          <h4 className="font-display font-bold text-sm text-text-main flex items-center gap-2 border-b border-border-main pb-3">
            <UserIcon className="w-4 h-4 text-secondary" />
            {t('Personal Profile Information', 'المعلومات الشخصية')}
          </h4>

          {/* Success / Error Banners */}
          {infoSuccess && (
            <div className="flex items-start gap-2.5 p-3.5 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-xl text-xs font-semibold">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{t('Your personal details have been updated successfully!', 'تم تحديث معلوماتك الشخصية بنجاح!')}</span>
            </div>
          )}

          {(validationError || authError) && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{validationError || authError}</span>
            </div>
          )}

          <form onSubmit={handleInfoSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('Full Name', 'الاسم الكامل')}
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Rodriguez"
                leftIcon={<UserIcon className="w-3.5 h-3.5" />}
                disabled={isLoading}
              />
              <Input
                label={t('Phone Number (Optional)', 'رقم الهاتف')}
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 019-2834"
                leftIcon={<Phone className="w-3.5 h-3.5" />}
                disabled={isLoading}
              />
            </div>

            <Input
              label={t('Registered Email Address', 'البريد الإلكتروني المسجل')}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.developer@omnimart.com"
              leftIcon={<Mail className="w-3.5 h-3.5" />}
              disabled={isLoading}
            />

            <div className="flex justify-end pt-4 border-t border-border-main">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="font-bold cursor-pointer"
              >
                {t('Save Changes', 'حفظ التعديلات')}
              </Button>
            </div>
          </form>
        </div>

        {/* Security / Password Reset */}
        <div className="bg-card border border-border-main p-6 rounded-2xl shadow-main space-y-6">
          <h4 className="font-display font-bold text-sm text-text-main flex items-center gap-2 border-b border-border-main pb-3">
            <Lock className="w-4 h-4 text-secondary" />
            {t('Login Security', 'أمان تسجيل الدخول')}
          </h4>

          {pwdSuccess && (
            <div className="flex items-start gap-2.5 p-3.5 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-xl text-xs font-semibold">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{t('Verification link dispatched! Please check your email.', 'تم إرسال رابط التحقق! يرجى مراجعة بريدك الإلكتروني.')}</span>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-xs text-text-muted leading-relaxed">
              {t(
                'To change your active account credentials, fire a password reset email. You will receive a verification link containing steps to set a new password.',
                'لتغيير كلمة مرور حسابك، يمكنك طلب إرسال بريد إلكتروني لإعادة تعيينها. ستتلقى رابطاً يحتوي على خطوات إعداد كلمة المرور الجديدة.'
              )}
            </p>

            <Button
              variant="outline"
              fullWidth
              onClick={handleResetClick}
              isLoading={isLoading}
              leftIcon={<KeyRound className="w-4 h-4 text-accent" />}
              className="font-bold cursor-pointer text-xs"
            >
              {t('Send Reset Email', 'إرسال بريد إعادة التعيين')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

AccountSettings.displayName = 'AccountSettings';
