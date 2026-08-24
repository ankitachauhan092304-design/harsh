'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConversionWidgets from '@/components/ConversionWidgets';
import { trackVisitorPageView } from '@/lib/visitorTracker';

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === '/admin' || pathname?.startsWith('/admin');

  useEffect(() => {
    if (!isAdmin) {
      trackVisitorPageView(pathname || '/');
    }
  }, [pathname, isAdmin]);

  if (isAdmin) {
    return <main className="flex-grow min-h-screen bg-slate-100">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-grow pt-[84px] md:pt-[116px]">{children}</main>
      <Footer />
      <ConversionWidgets />
    </>
  );
}
