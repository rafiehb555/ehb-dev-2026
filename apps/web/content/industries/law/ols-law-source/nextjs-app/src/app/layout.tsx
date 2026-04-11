import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import EHBAI from '@/components/EHB_AI';
import DemoModeBanner from '@/components/DemoModeBanner';
import DemoNotifications from '@/components/DemoNotifications';
import GuidedDemoMode from '@/components/GuidedDemoMode';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'EHB Law Services Hub',
  description: 'AI-Powered Legal Services Platform - Find verified lawyers, get legal assistance, and manage your cases.',
  keywords: ['legal services', 'lawyer', 'AI legal assistant', 'law firm', 'legal consultation'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen min-h-dvh pb-20 bg-[#020617] text-white overflow-x-hidden">
        <Navbar />
        {/* Demo Mode Banner - Shows on all pages */}
        <DemoModeBanner />
        {/* Add padding to account for navbar + demo banner */}
        <div className="pt-20">
          {children}
        </div>
        {/* Footer - Shows on all pages */}
        <Footer />
        {/* EHB AI Floating Assistant - Available on all pages */}
        <EHBAI />
        {/* Demo Notifications */}
        <DemoNotifications />
        {/* Guided Demo Mode for Investors */}
        <GuidedDemoMode />
      </body>
    </html>
  );
}
