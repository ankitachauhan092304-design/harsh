'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="w-full min-h-[75vh] bg-slate-50 flex items-center justify-center font-inter py-16">
      <div className="max-w-md w-full px-6 flex flex-col items-center text-center gap-6">
        {/* Error icon */}
        <div className="w-20 h-20 rounded-full bg-blue-50 text-[#0B4F9C] flex items-center justify-center shadow-inner relative">
          <Compass size={36} className="animate-spin-slow text-[#0B4F9C]" />
          <AlertTriangle size={16} className="text-amber-500 absolute bottom-1 right-1" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-black text-slate-800 font-dmsans">404</h1>
          <h2 className="text-xl font-bold text-slate-700 font-poppins">Resource Not Found</h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            The page you are looking for has been relocated, deleted, or does not exist. Use the button below to navigate back to the main console.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-premium hover:bg-gradient-premium-hover text-white text-xs font-bold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Contact Advisor
          </Link>
        </div>
      </div>
    </div>
  );
}
