'use client';

import React from 'react';
import Link from 'next/link';
import { Wallet, Briefcase, Home, Landmark, CreditCard, CheckCircle } from 'lucide-react';

export default function ServicesPage() {
  const serviceList = [
    {
      name: 'Personal Loan',
      slug: 'personal-loan',
      desc: 'Unsecured customized credit for personal emergencies, education, travel, or weddings.',
      icon: Wallet,
      rates: '10.49% p.a. onwards',
      amount: 'Up to ₹40 Lakhs',
      duration: '1 to 7 Years',
    },
    {
      name: 'Business Loan',
      slug: 'business-loan',
      desc: 'Collateral-free business capital to fuel expansions, procure inventory, or resolve cash flows.',
      icon: Briefcase,
      rates: '13.99% p.a. onwards',
      amount: 'Up to ₹75 Lakhs',
      duration: '1 to 5 Years',
    },
    {
      name: 'Home Loan',
      slug: 'home-loan',
      desc: 'Get matched with lowest interest rates to acquire your dream apartment, villa, or land.',
      icon: Home,
      rates: '8.40% p.a. onwards',
      amount: 'Up to 90% property value',
      duration: '5 to 30 Years',
    },
    {
      name: 'Loan Against Property',
      slug: 'loan-against-property',
      desc: 'Unlock the hidden equity in your residential or commercial property for maximum liquidity.',
      icon: Landmark,
      rates: '9.00% p.a. onwards',
      amount: 'Up to ₹15 Crores',
      duration: '5 to 20 Years',
    },
    {
      name: 'Credit Cards',
      slug: 'credit-card',
      desc: 'Compare and apply for top rewards, cashback, travel, and metal credit cards across bank partners.',
      icon: CreditCard,
      rates: 'Multiple options',
      amount: 'Instant approval path',
      duration: 'N/A',
    },
  ];

  return (
    <div className="flex flex-col w-full bg-slate-50">
      {/* Hero */}
      <section className="relative pt-8 lg:pt-12 pb-16 bg-gradient-to-br from-slate-50 to-blue-50/20 text-center overflow-hidden">
        {/* Soft Background Blobs */}
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-[#0B4F9C]/5 blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-[#00A86B]/5 blur-3xl -z-10 pointer-events-none" />

        {/* Background Network Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%230B4F9C\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="max-w-4xl mx-auto px-6 flex flex-col gap-4 relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A86B] font-poppins">Portfolio</span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight font-poppins">
            Financial Facilitation Products
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed max-w-xl mx-auto">
            We partner with 25+ leading banks & NBFCs to facilitate optimal credit limits at competitive interest rates. Find product details below.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceList.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-slate-50 rounded-3xl border border-slate-100 p-6 md:p-8 flex flex-col gap-6 hover-lift justify-between">
                  <div className="flex flex-col gap-4">
                    <div className="p-3 rounded-2xl bg-white text-[#0B4F9C] w-max shadow-sm">
                      <Icon size={24} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-bold text-slate-800 font-poppins">{item.name}</h3>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-3">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-slate-200/50">
                    <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold text-slate-600">
                      <div>
                        <span className="text-slate-400 text-[9px] uppercase tracking-wider block font-bold">Rates From</span>
                        <span className="text-slate-800 font-bold font-dmsans">{item.rates}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[9px] uppercase tracking-wider block font-bold">Max Limit</span>
                        <span className="text-slate-800 font-bold font-dmsans">{item.amount}</span>
                      </div>
                    </div>

                    <Link
                      href={`/services/${item.slug}`}
                      className="w-full text-center py-3 rounded-xl border border-slate-200 hover:border-[#0B4F9C] hover:text-[#0B4F9C] text-xs font-bold transition-all text-slate-700 mt-2 block"
                    >
                      View Eligibility Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Notice */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col gap-6 items-center">
          <h2 className="text-2xl font-bold text-slate-800 font-poppins">Transparent Facilitation Rules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left w-full mt-4">
            {[
              'Direct submissions into bank corporate desk panels.',
              'No redundant files or duplicate credit inquiries.',
              'Detailed compliance checks prior to sharing document sets.',
              'Instant escalation matrices with senior bank underwriters.',
            ].map((rule, idx) => (
              <div key={idx} className="flex gap-2 items-center p-3.5 bg-white border border-slate-100 rounded-xl">
                <CheckCircle size={16} className="text-[#00A86B] shrink-0" />
                <span className="text-xs font-semibold text-slate-600">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
