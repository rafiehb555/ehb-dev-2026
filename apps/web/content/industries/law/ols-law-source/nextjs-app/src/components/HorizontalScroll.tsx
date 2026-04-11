'use client';

import React from 'react';

interface HorizontalScrollProps {
  children: React.ReactNode;
}

export default function HorizontalScroll({ children }: HorizontalScrollProps) {
  return (
    <div className="overflow-x-auto hide-scrollbar -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="flex gap-3 sm:gap-4 pb-4">
        {children}
      </div>
    </div>
  );
}
