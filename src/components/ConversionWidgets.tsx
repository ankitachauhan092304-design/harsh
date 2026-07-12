'use client';

import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, X, ArrowRight, Clock, HelpCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ConversionWidgets() {
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackName, setCallbackName] = useState('');
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showMobileCta, setShowMobileCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show mobile sticky bottom CTA after scrolling past hero
      if (window.scrollY > 400) {
        setShowMobileCta(true);
      } else {
        setShowMobileCta(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone.trim() || !callbackName.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: callbackName,
          phone: callbackPhone,
          email: 'callback@whitestonefincorp.com',
          city: 'Request Callback',
          employmentType: 'SALARIED',
          monthlyIncome: 30000,
          loanType: 'PERSONAL',
          loanAmount: 100000,
          remarks: 'Requested instant callback via floating widget.',
          source: 'CALLBACK_WIDGET',
        }),
      });

      if (res.ok) {
        setCallbackSubmitted(true);
        setTimeout(() => {
          setShowCallbackModal(false);
          setCallbackSubmitted(false);
          setCallbackPhone('');
          setCallbackName('');
        }, 3000);
      } else {
        alert('Failed to submit callback request. Please try again.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Buttons Group (Desktop & Mobile) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
        {/* WhatsApp Pulsing Button */}
        <a
          href="https://wa.me/919824975488?text=Hi%2C%20I%20am%20interested%20in%20loan%20consultation%20with%20Whitestone%20Fincorp."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer"
        >
          {/* Pulse Waves */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" />
          <MessageCircle size={24} className="relative z-10" />
          {/* Tooltip */}
          <span className="absolute right-14 bg-slate-900 text-white text-[10px] md:text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md whitespace-nowrap hidden sm:block border border-slate-800">
            Chat on WhatsApp
          </span>
        </a>

        {/* Callback Support Button */}
        <button
          onClick={() => setShowCallbackModal(true)}
          aria-label="Request Instant Call"
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0B4F9C] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer relative"
        >
          <span className="absolute inset-0 rounded-full bg-[#0B4F9C] opacity-30 animate-pulse" />
          <Phone size={20} />
          {/* Tooltip */}
          <span className="absolute right-14 bg-slate-900 text-white text-[10px] md:text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md whitespace-nowrap hidden sm:block border border-slate-800">
            Request Callback
          </span>
        </button>
      </div>

      {/* Sticky Mobile Bottom CTA (Slides in on scroll) */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-100 p-3 flex gap-3 z-30 transition-all duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] sm:hidden ${
          showMobileCta ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <a
          href="tel:+919824975488"
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl active:bg-slate-50 transition-colors"
        >
          <Phone size={14} />
          Call Support
        </a>
        <Link
          href="/contact"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0B4F9C] text-white text-xs font-bold rounded-xl active:bg-[#083c78] shadow-md transition-colors"
        >
          Apply Now
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Callback Request Modal Dialog */}
      {showCallbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 border border-slate-100 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowCallbackModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {!callbackSubmitted ? (
              <form onSubmit={handleCallbackSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B4F9C] flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 font-poppins mt-2">Request Call In 10 Mins</h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Leave your details below and a certified loan consultant from Whitestone Fincorp will reach out shortly.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Name</label>
                    <input
                      type="text"
                      required
                      value={callbackName}
                      onChange={(e) => setCallbackName(e.target.value)}
                      placeholder="e.g. Rahul Patel"
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0B4F9C] focus:bg-white outline-none rounded-xl text-xs font-semibold transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      pattern="^[6-9]\d{9}$"
                      maxLength={10}
                      value={callbackPhone}
                      onChange={(e) => setCallbackPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile number"
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0B4F9C] focus:bg-white outline-none rounded-xl text-xs font-semibold transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#0B4F9C] hover:bg-[#083c78] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {submitting ? 'Scheduling call...' : 'Get Callback Now'}
                  {!submitting && <ArrowRight size={14} />}
                </button>

                <div className="flex items-center gap-1.5 justify-center text-[10px] text-slate-400 font-bold">
                  <HelpCircle size={12} />
                  <span>Your number is safe and shared only for verification.</span>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 gap-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center animate-bounce">
                  <CheckCircle size={32} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-slate-800 font-poppins">Call Request Scheduled!</h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    We have successfully captured your callback request. Our loan executive will dial you shortly.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
