import React, { useState, useEffect } from 'react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AlertCircle, ShoppingBag, LogIn, UserPlus } from 'lucide-react';

export interface AuthModalProps {
  lang?: 'en' | 'ar';
}

export const AuthModal: React.FC<AuthModalProps> = ({ lang = 'en' }) => {
  const { isAuthModalOpen, toggleAuthModal } = useNavigationStore();
  const {
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    authError,
    isLoading,
    clearError,
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const t = (en: string, ar: string) => (lang === 'en' ? en : ar);

  // Clear errors when opening modal or changing tabs
  useEffect(() => {
    if (isAuthModalOpen) {
      clearError();
      setValidationErrors({});
    }
  }, [isAuthModalOpen, activeTab, clearError]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      errors.email = t('Email address is required.', 'البريد الإلكتروني مطلوب.');
    } else if (!emailRegex.test(email)) {
      errors.email = t('Please enter a valid email address.', 'يرجى إدخال بريد إلكتروني صالح.');
    }

    if (!password) {
      errors.password = t('Password is required.', 'كلمة المرور مطلوبة.');
    } else if (password.length < 6) {
      errors.password = t('Password must be at least 6 characters.', 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.');
    }

    if (activeTab === 'register') {
      if (!fullName.trim()) {
        errors.fullName = t('Full name is required.', 'الاسم الكامل مطلوب.');
      }
      if (password !== confirmPassword) {
        errors.confirmPassword = t('Passwords do not match.', 'كلمتا المرور غير متطابقتين.');
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (activeTab === 'signin') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, fullName);
      }
      toggleAuthModal(false);
      // Reset form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
    } catch (err) {
      // Error handled by store authError
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      toggleAuthModal(false);
    } catch (err) {
      // Error handled by store authError
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => toggleAuthModal(false)}
      title={t('OmniMart Account Access', 'حساب أومني مارت')}
      size="sm"
    >
      <div className="space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {/* Logo and Greeting */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <p className="text-xs text-text-muted">
            {t(
              'Access your personal dashboard to track orders, manage addresses, and checkout securely.',
              'ادخل إلى لوحة التحكم الخاصة بك لمتابعة الطلبات، وإدارة العناوين، والدفع بأمان.'
            )}
          </p>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-border-main">
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            {t('Sign In', 'تسجيل الدخول')}
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            {t('Create Account', 'إنشاء حساب جديد')}
          </button>
        </div>

        {/* Auth Errors Display */}
        {authError && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* Auth Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'register' && (
            <Input
              label={t('Full Name', 'الاسم الكامل')}
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t('Alex Rodriguez', 'ألكس رودريغيز')}
              error={validationErrors.fullName}
              disabled={isLoading}
            />
          )}

          <Input
            label={t('Email Address', 'البريد الإلكتروني')}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            error={validationErrors.email}
            disabled={isLoading}
          />

          <Input
            label={t('Password', 'كلمة المرور')}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            error={validationErrors.password}
            disabled={isLoading}
          />

          {activeTab === 'register' && (
            <Input
              label={t('Confirm Password', 'تأكيد كلمة المرور')}
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              error={validationErrors.confirmPassword}
              disabled={isLoading}
            />
          )}

          {activeTab === 'signin' && (
            <div className="flex items-center justify-between text-[11px] text-text-muted pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-border-main text-secondary focus:ring-secondary focus:ring-offset-0"
                />
                <span>{t('Remember me', 'تذكرني')}</span>
              </label>
              <button
                type="button"
                onClick={() => alert(t('Password recovery simulation...', 'محاكاة استعادة كلمة المرور...'))}
                className="hover:text-secondary hover:underline cursor-pointer"
              >
                {t('Forgot password?', 'نسيت كلمة المرور؟')}
              </button>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isLoading}
            className="mt-2 font-bold cursor-pointer"
          >
            {activeTab === 'signin' ? (
              <>
                <LogIn className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                {t('Sign In', 'تسجيل الدخول')}
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                {t('Register Account', 'إنشاء الحساب')}
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-border-main"></div>
          <span className="flex-shrink mx-4 text-[10px] text-text-muted uppercase font-bold tracking-widest bg-card">
            {t('Or continue with', 'أو الاستمرار عبر')}
          </span>
          <div className="flex-grow border-t border-border-main"></div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2.5 px-4 h-11 border border-border-main hover:bg-surface text-text-main font-semibold rounded-xl text-xs transition active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          {/* Google Full Color SVG Logo */}
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>Google</span>
        </button>
      </div>
    </Modal>
  );
};

AuthModal.displayName = 'AuthModal';
