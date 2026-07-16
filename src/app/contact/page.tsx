'use client';

import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen pb-24">
      {/* Hero */}
      <section className="relative pt-8 lg:pt-12 pb-16 bg-gradient-to-br from-slate-50 to-blue-50/20 text-center overflow-hidden">
        {/* Soft Background Blobs */}
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-[#0B4F9C]/5 blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-[#00A86B]/5 blur-3xl -z-10 pointer-events-none" />

        {/* Background Network Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%230B4F9C\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="max-w-4xl mx-auto px-6 flex flex-col gap-4 relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A86B] font-poppins">Get In Touch</span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight font-poppins">
            Contact Loan Advisory
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed max-w-xl mx-auto">
            Get 1-on-1 consultation regarding Personal, Business, Home Loans, and LAP. Our office handles direct submissions to India&apos;s top 25+ lenders.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6 items-start">
        {/* Contact details & Map */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col gap-6">
            <h2 className="text-lg font-bold text-slate-800 font-poppins pb-3 border-b border-slate-100">Corporate Directory</h2>
            
            <div className="flex flex-col gap-5 text-sm text-slate-600 font-semibold">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-[#00A86B] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-slate-800 font-bold">Office Address</span>
                  <span className="text-xs text-slate-500 mt-1 leading-relaxed">
                    207/21 WHITESTONE FINCORP, Opp. ADC Bank, RAKHIAL, AHMEDABAD – 380023
                  </span>
                </div>
              </div>

              <a href="tel:+919824975488" className="flex items-start gap-3 hover:text-[#0B4F9C] transition-colors group">
                <Phone size={20} className="text-[#00A86B] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-slate-800 font-bold group-hover:text-[#0B4F9C]">Phone Support</span>
                  <span className="text-xs text-slate-500 mt-0.5">+91 98249 75488</span>
                </div>
              </a>

              <a href="mailto:info@whitestonefincorp.com" className="flex items-start gap-3 hover:text-[#0B4F9C] transition-colors group">
                <Mail size={20} className="text-[#00A86B] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-slate-800 font-bold group-hover:text-[#0B4F9C]">Email Support</span>
                  <span className="text-xs text-slate-500 mt-0.5">info@whitestonefincorp.com</span>
                </div>
              </a>

              <div className="flex items-start gap-3">
                <Clock size={20} className="text-[#00A86B] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-slate-800 font-bold">Operating Hours</span>
                  <span className="text-xs text-slate-500 mt-0.5">Mon - Sat: 10:00 AM - 7:00 PM (Sunday Closed)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-slate-200 h-[220px] rounded-3xl overflow-hidden border border-slate-300 relative shadow-inner">
            {/* SVG mock map for a clean, expensive styled lookup */}
            <div className="absolute inset-0 bg-[#E2E8F0] flex flex-col items-center justify-center p-6 text-center select-none">
              <MapPin size={32} className="text-[#0B4F9C] animate-bounce mb-2" />
              <span className="text-xs font-bold text-slate-700">Rakhial District - Ahmedabad Office</span>
              <span className="text-[10px] text-slate-500 font-semibold mt-1">GTM Tag Verification Active</span>
              <div className="mt-4 px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-[10px] font-extrabold text-[#0B4F9C]">
                OPEN IN GOOGLE MAPS
              </div>
            </div>
          </div>
        </div>

        {/* Lead capturing form */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
