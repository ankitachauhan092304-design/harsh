'use client';

import React from 'react';
import { ShieldCheck, Target, Building2 } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const leadership = [
    { name: 'Devraj Sharma', role: 'Managing Director & Founder', desc: 'Over 20+ years of banking experience at HDFC and ICICI credit risk departments.', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop' },
    { name: 'Ankita Deshmukh', role: 'Chief of Loan Operations', desc: 'Expert in MSME credit policies, underwriting systems, and bank relationship portfolios.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' },
    { name: 'Sanjay Nair', role: 'Head of Retail Advisory', desc: 'Dedicated to optimizing retail loan eligibility metrics and customized debt consolidations.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-inter">
      {/* Hero */}
      <section className="relative pt-8 lg:pt-12 pb-16 bg-gradient-to-br from-slate-50 to-blue-50/20 text-center overflow-hidden">
        {/* Soft Background Blobs */}
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-[#0B4F9C]/5 blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-[#00A86B]/5 blur-3xl -z-10 pointer-events-none" />

        {/* Background Network Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%230B4F9C\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="max-w-4xl mx-auto px-6 flex flex-col gap-4 relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A86B] font-poppins">Our Identity</span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight font-poppins">
            About Whitestone Fincorp
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed max-w-xl mx-auto">
            We are India&apos;s premier loan facilitation consultancy. We do not directly lend money; instead, we bridge the gap between borrowers and 25+ trusted financial institutions.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col gap-4">
            <div className="p-3.5 rounded-2xl bg-blue-50 text-[#0B4F9C] w-max">
              <Target size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 font-poppins">Our Mission</h2>
            <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed">
              To empower individuals and businesses with optimal credit matches through financial literacy, state-of-the-art calculators, and objective, transparent comparison of banking institutions.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-[#00A86B] w-max">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 font-poppins">Our Commitment</h2>
            <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed">
              We stand for 100% data integrity, secure document transfer, zero upfront commissions, and finding the absolute lowest possible rate matching the borrower&apos;s unique credit rating.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col gap-12">
          <div className="text-center flex flex-col gap-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A86B] font-poppins">Advisory Board</span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 font-poppins">Our Leadership Team</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((lead, idx) => (
              <div key={idx} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col gap-4 hover-lift">
                <Image
                  src={lead.img}
                  alt={lead.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-2xl object-cover shadow-sm bg-slate-100"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-base font-bold text-slate-800 font-poppins">{lead.name}</span>
                  <span className="text-[10px] text-[#0B4F9C] font-bold uppercase tracking-widest">{lead.role}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  {lead.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Notice */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center flex flex-col gap-6 items-center">
          <div className="p-3.5 rounded-2xl bg-blue-50 text-[#0B4F9C]">
            <Building2 size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 font-poppins">Official Banking Facilitators</h2>
          <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed max-w-2xl">
            Whitestone Fincorp operates under corporate advisory agreements with India&apos;s leading banking institutions including HDFC Bank, ICICI Bank, Axis Bank, SBI, Kotak Mahindra, and leading retail NBFCs. We verify parameters before submission to ensure your application gets approved without creating redundant credit inquiries.
          </p>
        </div>
      </section>
    </div>
  );
}
