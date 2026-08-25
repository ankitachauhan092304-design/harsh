'use client';

import React, { useState, useEffect } from 'react';
import { Eye, TrendingUp } from 'lucide-react';
import { clientDbService } from '@/lib/clientDbService';

interface VisitorCounterBadgeProps {
  variant?: 'floating' | 'inline' | 'header' | 'footer';
  className?: string;
}

export default function VisitorCounterBadge({ variant = 'floating', className = '' }: VisitorCounterBadgeProps) {
  const [pageviews, setPageviews] = useState<number>(1240);
  const [visitorsToday, setVisitorsToday] = useState<number>(34);

  useEffect(() => {
    let isMounted = true;

    const updateCounts = async () => {
      try {
        const storedTotal = parseInt(localStorage.getItem('wf_total_site_pageviews') || '1240', 10);
        const analytics = await clientDbService.getVisitorAnalytics();
        if (isMounted) {
          const remoteCount = analytics?.totalPageviews || 0;
          const finalCount = Math.max(storedTotal, remoteCount, 1240);
          const today = Math.max(analytics?.visitorsToday || 0, 34);
          setPageviews(finalCount);
          setVisitorsToday(today);
        }
      } catch (e) {
        if (isMounted) {
          const storedTotal = parseInt(localStorage.getItem('wf_total_site_pageviews') || '1240', 10);
          setPageviews(storedTotal);
        }
      }
    };

    updateCounts();

    const handleCustomUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.count) {
        setPageviews(customEvent.detail.count);
      } else {
        updateCounts();
      }
    };

    window.addEventListener('wf_visitor_updated', handleCustomUpdate);
    window.addEventListener('storage', updateCounts);
    const interval = setInterval(updateCounts, 2000);

    return () => {
      isMounted = false;
      window.removeEventListener('wf_visitor_updated', handleCustomUpdate);
      window.removeEventListener('storage', updateCounts);
      clearInterval(interval);
    };
  }, []);

  if (variant === 'header') {
    return (
      <div className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200/80 text-[11px] font-bold text-slate-700 ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <Eye size={12} className="text-[#0B4F9C]" />
        <span>{pageviews.toLocaleString('en-IN')}+ Live Views</span>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300 ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <Eye size={14} className="text-emerald-400" />
        <span>Website Visits: <strong className="text-white font-mono font-bold">{pageviews.toLocaleString('en-IN')}</strong> ({visitorsToday} Today)</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0B4F9C] text-xs font-bold ${className}`}>
        <Eye size={14} />
        <span>{pageviews.toLocaleString('en-IN')} Total Website Visits</span>
        <TrendingUp size={12} className="text-emerald-600" />
      </div>
    );
  }

  // Floating bottom-left widget
  return (
    <div className={`fixed bottom-5 left-5 z-40 hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-lg text-xs font-bold text-slate-800 transition-all hover:scale-105 ${className}`}>
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </span>
      <Eye size={15} className="text-[#0B4F9C]" />
      <span>Website Views: <span className="font-mono text-[#0B4F9C] font-black">{pageviews.toLocaleString('en-IN')}</span></span>
    </div>
  );
}
