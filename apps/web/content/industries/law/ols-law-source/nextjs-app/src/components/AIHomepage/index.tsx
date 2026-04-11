'use client';

import React from 'react';
import { AIProvider } from './AIContext';
import AIAssistantHub from './AIAssistantHub';

export default function AIHomepage() {
  return (
    <AIProvider>
      <div className="w-full max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Main AI Assistant Hub - CENTER OF HOMEPAGE */}
        <AIAssistantHub />
      </div>
    </AIProvider>
  );
}

export { AIProvider, useAI, LANGUAGES } from './AIContext';
export { default as AIAssistantHub } from './AIAssistantHub';
