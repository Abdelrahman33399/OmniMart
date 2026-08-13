import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base styles with smooth transition
    const baseStyles = 'inline-flex items-center justify-center font-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer';

    // Variant configurations
    const variants = {
      primary:
        'bg-primary text-white hover:bg-slate-800 dark:bg-accent dark:text-primary dark:hover:bg-amber-400 focus:ring-accent/50 border border-transparent shadow-sm hover:shadow',
      secondary:
        'bg-secondary text-white hover:bg-blue-600 dark:bg-secondary dark:hover:bg-blue-500 focus:ring-secondary/50 border border-transparent shadow-sm hover:shadow',
      outline:
        'bg-transparent text-text-main border border-border-main hover:bg-surface focus:ring-secondary/50',
      ghost:
        'bg-transparent text-text-main hover:bg-surface border border-transparent focus:ring-secondary/50',
      danger:
        'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus:ring-red-500/50 border border-transparent shadow-sm hover:shadow',
    };

    // Size configurations
    const sizes = {
      sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5 h-8',
      md: 'px-4 py-2 text-sm font-semibold rounded-lg gap-2 h-10',
      lg: 'px-6 py-3 text-base font-bold rounded-xl gap-2.5 h-12',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        type={type}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span className="truncate">{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
