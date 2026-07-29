'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConversionWidgets from '@/components/ConversionWidgets';

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === '/admin' || pathname?.startsWith('/admin');

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
