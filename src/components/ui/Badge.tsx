import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'amber' | 'navy' | 'blue' | 'success' | 'danger';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'navy',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans tracking-wide leading-none font-bold uppercase';

  const variants = {
    amber: 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20',
    navy: 'bg-primary/10 text-primary dark:bg-accent/25 dark:text-accent border border-primary/10 dark:border-accent/25',
    blue: 'bg-secondary/15 text-secondary dark:bg-secondary/20 dark:text-blue-400 border border-secondary/20',
    success: 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20',
    danger: 'bg-red-500/15 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] tracking-wider rounded-md',
    md: 'px-2.5 py-1 text-[11px] tracking-wide rounded-full',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
