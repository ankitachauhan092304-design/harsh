'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calculator } from 'lucide-react';

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal sticky CTA after scrolling down 600px
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 shadow-2xl py-4"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col text-center sm:text-left">
              <span className="text-sm font-bold text-slate-800 font-poppins">
                Ready to find your best loan option?
              </span>
              <span className="text-xs text-slate-500 font-inter">
                Consult with 20+ trusted bank partners for free.
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/calculators/eligibility"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
              >
                <Calculator size={14} className="text-[#0B4F9C]" />
                Check Eligibility
              </Link>
              <Link
                href="/contact?type=apply"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-5 py-2.5 rounded-xl bg-gradient-premium hover:bg-gradient-premium-hover text-white text-xs font-bold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all"
              >
                Apply Now
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
