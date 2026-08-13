import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  style,
  ...props
}) => {
  const baseStyles = 'animate-pulse bg-slate-200 dark:bg-slate-800';

  const customStyle: React.CSSProperties = {
    width,
    height,
    ...style,
  };

  if (variant === 'card') {
    return (
      <div
        className={`rounded-2xl border border-border-main bg-card p-5 space-y-4 shadow-sm w-full ${className}`}
        style={style}
        {...props}
      >
        {/* Mock Image aspect-square */}
        <div className="aspect-square w-full rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        {/* Brand */}
        <div className="h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        {/* Title */}
        <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        {/* Rating */}
        <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        {/* Price & Action */}
        <div className="flex justify-between items-center pt-2 border-t border-border-main">
          <div className="h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-8 w-1/4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
      </div>
    );
  }

  const variants = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: '', // Handled above
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={customStyle}
      {...props}
    />
  );
};

Skeleton.displayName = 'Skeleton';
