'use client';

import React, { useEffect } from 'react';

export type DrawerWidth = 'md' | 'lg' | 'xl';

export interface DrawerPanelProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: DrawerWidth;
}

const widthClasses: Record<DrawerWidth, string> = {
  md: 'w-96',
  lg: 'w-[480px]',
  xl: 'w-[640px]',
};

export const DrawerPanel = React.forwardRef<HTMLDivElement, DrawerPanelProps>(
  ({ open, onClose, title, children, width = 'lg' }, ref) => {
    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [open]);

    if (!open) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-200"
          onClick={onClose}
        />

        {/* Drawer Panel */}
        <div
          ref={ref}
          className={`
            fixed
            right-0
            top-0
            bottom-0
            ${widthClasses[width]}
            bg-[#13162A]
            border-l border-[rgba(255,255,255,0.08)]
            backdrop-blur-md
            z-50
            transform transition-transform duration-300
            ${open ? 'translate-x-0' : 'translate-x-full'}
            flex flex-col
            shadow-2xl
          `.trim()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.07)]">
            {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
            <button
              onClick={onClose}
              className="
                ml-auto
                p-2
                rounded-lg
                hover:bg-[rgba(255,255,255,0.1)]
                transition-all duration-200
                text-[rgba(255,255,255,0.6)]
                hover:text-white
              "
              aria-label="Close drawer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </>
    );
  }
);

DrawerPanel.displayName = 'DrawerPanel';
