import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  position?: 'right' | 'left';
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  position = 'right',
  children,
}) => {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const drawerPositionClasses = {
    right: 'right-0 top-0 bottom-0 h-full w-full max-w-md border-l border-border-main rounded-l-2xl animate-slide-in-right',
    left: 'left-0 top-0 bottom-0 h-full w-full max-w-md border-r border-border-main rounded-r-2xl animate-slide-in-left',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Slide-over Panel */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'drawer-title' : undefined}
          className={`
            fixed pointer-events-auto bg-card text-text-main flex flex-col shadow-2xl transition-all duration-300
            ${drawerPositionClasses[position]}
          `}
          style={{
            animation: `slide-in-${position} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards`
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border-main">
            {title ? (
              <h3
                id="drawer-title"
                className="text-lg font-display font-bold text-text-main"
              >
                {title}
              </h3>
            ) : (
              <div />
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:bg-surface hover:text-text-main transition-colors cursor-pointer"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>

      {/* Embedded slide animations inside drawer layout */}
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slide-in-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>,
    document.body
  );
};

Drawer.displayName = 'Drawer';
