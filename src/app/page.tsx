'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building2,
  Award,
  Wallet,
  Clock,
  ChevronDown,
  TrendingUp,
  Lock,
  Star
} from 'lucide-react';
import EMICalculator from '@/components/calculators/EMICalculator';
import CreditScoreEstimator from '@/components/calculators/CreditScoreEstimator';
import EligibilityCalculator from '@/components/calculators/EligibilityCalculator';
import ContactForm from '@/components/ContactForm';
import Counter from '@/components/Counter';

// Premium counters statistics
const STATS = [
  { label: 'Happy Customers', rawVal: 2, prefix: '', suffix: 'K+', icon: Users },
  { label: 'Loans Facilitated', rawVal: 5, prefix: '₹', suffix: ' Cr+', icon: Wallet },
  { label: 'Partner Banks, NBFCs & Financial Institutions', rawVal: 180, prefix: '', suffix: '+', icon: Building2 },
  { label: 'Years of Experience', rawVal: 5, prefix: '', suffix: '+', icon: Award },
];

// 7 Loan Products
const PRODUCTS = [
  {
    name: 'Personal Loan',
    slug: 'personal-loan',
    desc: 'Unsecured customized credit for personal emergencies, education, travel, or weddings.',
    rates: '10.49% p.a. onwards',
    amount: 'Up to ₹40 Lakhs',
  },
  {
    name: 'Business Loan',
    slug: 'business-loan',
    desc: 'Collateral-free business capital to fuel expansions, procure inventory, or resolve cash flows.',
    rates: '13.99% p.a. onwards',
    amount: 'Up to ₹75 Lakhs',
  },
  {
    name: 'Home Loan',
    slug: 'home-loan',
    desc: 'Get matched with lowest interest rates to acquire your dream apartment, villa, or land.',
    rates: '8.40% p.a. onwards',
    amount: 'Up to 90% property value',
  },
  {
    name: 'Loan Against Property',
    slug: 'loan-against-property',
    desc: 'Unlock the hidden equity in your residential or commercial property for maximum liquidity.',
    rates: '9.00% p.a. onwards',
    amount: 'Up to ₹15 Crores',
  },
  {
    name: 'Project Loan',
    slug: 'project-loan',
    desc: 'Customized funding for large-scale infrastructure, real estate, manufacturing, or commercial setup.',
    rates: '9.50% p.a. onwards',
    amount: 'Up to ₹100 Crores',
  },
  {
    name: 'Top-up Loan',
    slug: 'top-up-loan',
    desc: 'Additional low-cost liquidity over your existing home or property loan with minimal paperwork.',
    rates: '8.65% p.a. onwards',
    amount: 'Up to ₹1 Crore',
  },
  {
    name: 'Credit Cards',
    slug: 'credit-card',
    desc: 'Compare and apply for top rewards, cashback, travel, and metal credit cards across bank partners.',
    rates: 'Multiple options',
    amount: 'Instant approval path',
  },
];

// Why choose us (5 feature cards)
const WHY_CHOOSE_US = [
  {
    title: 'High Approval Rates',
    desc: 'We map your credit file to banks whose underwriting policy matches your specific profile.',
    icon: ShieldCheck,
  },
  {
    title: '180+ Banking Partners',
    desc: 'Access financing through 180+ leading Private Banks, Government Banks, NBFCs, and Financial Institutions with competitive interest rates and flexible loan options.',
    icon: Building2,
  },
  {
    title: 'Secure Document Vault',
    desc: 'Your documents are shared only with selected banking partners via highly encrypted paths.',
    icon: Award,
  },
  {
    title: 'Dedicated Credit Expert',
    desc: 'Get an assigned loan consultant to manage your document pickup, verify eligibility, and represent your file.',
    icon: Users,
  },
  {
    title: 'Fast-Track Processing',
    desc: 'Skip long queues. We leverage direct integration links with bank underwriting teams.',
    icon: Clock,
  },
];

// Timeline steps
const PROCESS_STEPS = [
  { step: '01', title: 'Consultation & Matching', desc: 'Fill your parameters online. Our credit engine maps you to eligible banking partners.' },
  { step: '02', title: 'Documentation Setup', desc: 'Our dedicated expert collects and compiles required payslips, ITRs, and bank statements.' },
  { step: '03', title: 'Underwriting Review', desc: 'Lenders review the structured file, perform property or physical checks, and grant approval.' },
  { step: '04', title: 'Sanction & Disbursement', desc: 'Loan agreement is signed, and the sanction amount is credited directly to your bank account.' },
];

// Partner bank logos names
const PARTNERS = [
  'HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra', 'Bajaj Finserv',
  'Tata Capital', 'IDFC FIRST Bank', 'L&T Finance', 'Aditya Birla Capital'
];

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const homeFaqs = [
    { q: 'How does Whitestone Fincorp facilitate loans?', a: 'We act as an official corporate advisor and facilitator. When you fill out an application, our expert advisor evaluates your parameters, maps your profile against the underwriting criteria of 25+ banks, compiles your documents, and submits your file directly to the bank which offers the lowest rates and highest approval chances.' },
    { q: 'Are there any fees for using Whitestone Fincorp services?', a: 'No. Our loan consultation, matching, and document collation services are 100% free of charge to the borrower. We do not charge commissions. Processing fees, if any, are paid directly to the disbursing bank.' },
    { q: 'What is the benefit of applying through Whitestone instead of directly at a bank?', a: 'Applying directly limits you to one bank\'s policies. If they reject or offer high interest rates, you have to apply elsewhere, generating multiple hard credit inquiries which dips your credit score. Whitestone compares all banks, checks eligibility dynamically, and represents your file at the right place, protecting your credit score and finding the cheapest deal.' },
    { q: 'How secure are my uploaded financial documents?', a: 'Extremely secure. We use industry-standard document protection protocols. Your bank statements and income tax records are encrypted and shared exclusively with the single partner bank where your file is approved, ensuring absolute privacy.' },
  ];

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-start justify-center pt-8 lg:pt-12 pb-16 bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100/50 overflow-hidden">
        {/* Soft Background Blobs */}
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-[#0B4F9C]/5 blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-[#00A86B]/5 blur-3xl -z-10 pointer-events-none" />

        {/* Background Network Pattern */}
        <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full relative z-10">
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left h-full">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 text-[#0B4F9C] text-xs font-bold mx-auto lg:mx-0 w-max shadow-xs"
            >
              <ShieldCheck size={14} className="text-[#00A86B]" />
              Trusted Loan Advisory & Facilitation
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight font-poppins leading-[1.1]"
            >
              Securing High-Value Loans <br />
              <span className="text-gradient">Made Effortless.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-semibold"
            >
              Compare interest rates, verify eligibility, and secure customized credit limits up to ₹15 Crores from India&apos;s top banking partners with the help of dedicated credit experts.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
            >
              <Link
                href="#contact"
                className="px-8 py-3.5 rounded-2xl bg-gradient-premium hover:bg-gradient-premium-hover text-white text-sm font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 active:scale-[0.98] hover:scale-[1.02] transition-all btn-shine"
              >
                Apply Now
              </Link>
              <Link
                href="#emi-calc"
                className="px-8 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 text-sm font-bold shadow-sm transition-all"
              >
                Calculate EMI
              </Link>
              <Link
                href="#eligibility"
                className="px-8 py-3.5 rounded-2xl bg-emerald-50 text-[#00A86B] border border-emerald-100 hover:bg-emerald-100/50 active:scale-[0.98] text-sm font-bold transition-all text-center"
              >
                Check Eligibility
              </Link>
            </motion.div>

            {/* ── Premium Trust Badge Row ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white shadow-xl shadow-blue-900/5 flex flex-wrap gap-4 items-center mx-auto lg:mx-0 relative w-fit"
            >
              {/* Optional soft background glow for the container */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-emerald-50/50 rounded-2xl -z-10" />
              
              <div className="flex items-center gap-2.5">
                <div className="bg-blue-100 p-1.5 rounded-full">
                  <Lock size={12} className="text-[#0B4F9C]" />
                </div>
                <span className="text-[11px] font-extrabold text-slate-700 tracking-wide uppercase">256-Bit SSL</span>
              </div>
              <div className="w-px h-6 bg-slate-200/60 hidden sm:block"></div>
              <div className="flex items-center gap-2.5">
                <div className="bg-emerald-100 p-1.5 rounded-full">
                  <ShieldCheck size={12} className="text-[#00A86B]" />
                </div>
                <span className="text-[11px] font-extrabold text-slate-700 tracking-wide uppercase">Data Privacy</span>
              </div>
              <div className="w-px h-6 bg-slate-200/60 hidden sm:block"></div>
              <div className="flex items-center gap-2.5">
                <div className="bg-blue-100 p-1.5 rounded-full">
                  <Award size={12} className="text-[#0B4F9C]" />
                </div>
                <span className="text-[11px] font-extrabold text-slate-700 tracking-wide uppercase">RBI Compliant</span>
              </div>
            </motion.div>

            {/* Space-filling Premium Fintech Vector Illustration for Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="hidden lg:flex flex-col mt-auto pt-8 w-full max-w-xl"
            >
              <div className="relative w-full h-56 rounded-3xl bg-white border border-slate-100 shadow-2xl shadow-blue-900/5 overflow-hidden flex items-center justify-center p-6">
                
                {/* Background grid texture */}
                <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center opacity-10" />

                {/* Main Abstract Graphic Area */}
                <div className="relative w-full h-full flex flex-col justify-end">
                  {/* Subtle bar charts in background */}
                  <div className="absolute bottom-0 left-0 w-full flex items-end justify-between px-4 opacity-20">
                    <div className="w-8 h-12 bg-[#0B4F9C] rounded-t-sm" />
                    <div className="w-8 h-20 bg-[#0B4F9C] rounded-t-sm" />
                    <div className="w-8 h-16 bg-[#00A86B] rounded-t-sm" />
                    <div className="w-8 h-28 bg-[#0B4F9C] rounded-t-sm" />
                    <div className="w-8 h-24 bg-[#0B4F9C] rounded-t-sm" />
                    <div className="w-8 h-36 bg-[#00A86B] rounded-t-sm" />
                  </div>

                  {/* Smooth curved trendline SVG */}
                  <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 drop-shadow-xl z-10">
                    <path d="M0,160 C80,160 120,90 200,100 C280,110 320,50 400,60 C450,65 480,30 500,20 L500,200 L0,200 Z" fill="url(#heroTrendGradient)" />
                    <defs>
                      <linearGradient id="heroTrendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00A86B" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#00A86B" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,160 C80,160 120,90 200,100 C280,110 320,50 400,60 C450,65 480,30 500,20" fill="none" stroke="#00A86B" strokeWidth="3" />
                    
                    {/* Glowing point at the top */}
                    <circle cx="500" cy="20" r="6" fill="#00A86B" />
                    <circle cx="500" cy="20" r="12" fill="#00A86B" opacity="0.3" />
                  </svg>
                </div>

                {/* Floating summary card 1: Analytics */}
                <motion.div 
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute right-4 top-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl shadow-blue-900/10 border border-slate-100 flex items-center gap-3 z-20"
                >
                  <div className="bg-blue-50 text-[#0B4F9C] p-2.5 rounded-xl border border-blue-100">
                    <TrendingUp size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Credit Potential</p>
                    <p className="text-sm font-black text-slate-800 tracking-tight">₹15 Cr+</p>
                  </div>
                </motion.div>

                {/* Floating summary card 2: Security */}
                <motion.div 
                  animate={{ y: [4, -4, 4] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-4 bottom-6 bg-slate-800 backdrop-blur-md rounded-2xl p-3 shadow-xl shadow-slate-900/20 border border-slate-700 flex items-center gap-3 z-20"
                >
                  <div className="bg-emerald-500/20 text-emerald-400 p-2.5 rounded-xl border border-emerald-500/30">
                    <ShieldCheck size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Data Vault</p>
                    <p className="text-sm font-black text-white tracking-tight">Encrypted</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Hero Premium Illustration / Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute inset-0 bg-blue-400/10 rounded-3xl filter blur-3xl -z-10" />
            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* 2. Trusted Numbers */}
      <section className="py-10 lg:py-12 bg-white relative">
        {/* Subtle bottom separator */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-60" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center p-5 rounded-3xl hover:bg-slate-50/50 transition-all duration-300 group"
              >
                <div className="p-3.5 rounded-2xl bg-slate-50 text-[#0B4F9C] group-hover:bg-[#0B4F9C] group-hover:text-white transition-all duration-300 mb-3 shadow-xs">
                  <Icon size={24} />
                </div>
                <span className="text-3xl md:text-4xl font-extrabold text-slate-800 font-dmsans tracking-tight">
                  {stat.prefix}
                  <Counter value={stat.rawVal} suffix={stat.suffix} />
                </span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2 group-hover:text-[#0B4F9C] transition-colors duration-200">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Services Section */}
      <section id="services" className="py-16 lg:py-20 bg-slate-50/50 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col gap-12">
          <div className="text-center flex flex-col gap-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A86B] font-poppins">Our Solutions</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight font-poppins">
              Premium Financial Facilitation
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
              We leverage direct partnerships with leading lenders to offer custom limits and optimized interest rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((prod, idx) => {
              // Custom parameters mapping
              const getParams = (slug: string) => {
                switch (slug) {
                  case 'personal-loan':
                    return { processing: '24 Hours', eligibility: 'Salary ≥ ₹15K/mo' };
                  case 'business-loan':
                    return { processing: '48 Hours', eligibility: 'Turnover Based' };
                  case 'home-loan':
                    return { processing: '3-5 Days', eligibility: 'Salary ≥ ₹15K/mo' };
                  case 'loan-against-property':
                    return { processing: '5-7 Days', eligibility: 'Property Collateral' };
                  case 'project-loan':
                    return { processing: '7-10 Days', eligibility: 'Project Profile Based' };
                  case 'top-up-loan':
                    return { processing: '48 Hours', eligibility: 'Active Loan Track' };
                  default:
                    return { processing: 'Instant Path', eligibility: 'CIBIL Score 700+' };
                }
              };
              const { processing, eligibility } = getParams(prod.slug);

              return (
                <motion.div
                  key={prod.slug}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2 p-6 md:p-8 flex flex-col justify-between gap-6 transition-all duration-500 group relative overflow-hidden"
                >
                  {/* Subtle top border gradient */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#0B4F9C]/10 to-transparent group-hover:via-[#0B4F9C] transition-all duration-500" />
                  
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-bold text-slate-800 font-poppins group-hover:text-[#0B4F9C] transition-colors duration-200">{prod.name}</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-3">
                      {prod.desc}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 py-4 border-y border-slate-50 text-xs font-semibold">
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Interest Rate</span>
                      <span className="text-slate-800 font-bold font-dmsans mt-0.5">{prod.rates}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Max Amount</span>
                      <span className="text-slate-800 font-bold font-dmsans mt-0.5">{prod.amount}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Processing Time</span>
                      <span className="text-[#0B4F9C] font-bold font-dmsans mt-0.5">{processing}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Min Eligibility</span>
                      <span className="text-[#00A86B] font-bold font-dmsans mt-0.5">{eligibility}</span>
                    </div>
                  </div>

                  <Link
                    href={`/services/${prod.slug}`}
                    className="flex items-center justify-between text-xs font-bold text-[#0B4F9C] group/link"
                  >
                    <span>Explore Product Details</span>
                    <ArrowRight size={14} className="group-hover/link:translate-x-1.5 transition-transform" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="py-16 lg:py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col gap-12">
          <div className="text-center flex flex-col gap-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A86B] font-poppins">The Whitestone Advantage</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight font-poppins">
              Why Smart Borrowers Partner With Us
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
              We replace tedious manual applications with a streamlined multi-bank comparison engine and expert advisory.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {WHY_CHOOSE_US.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] p-6 md:p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:border-blue-100 hover:bg-gradient-to-b hover:from-white hover:to-blue-50/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex gap-4 items-start group"
                >
                  <div className="p-3.5 rounded-2xl bg-emerald-50 text-[#00A86B] group-hover:bg-[#00A86B] group-hover:text-white shadow-sm shrink-0 transition-all duration-500">
                    <Icon size={22} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-bold text-slate-800 font-poppins group-hover:text-[#0B4F9C] transition-colors duration-200">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Loan Process Timeline */}
      <section className="py-16 lg:py-20 bg-slate-50/50 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col gap-16">
          <div className="text-center flex flex-col gap-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A86B] font-poppins">Seamless Journey</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight font-poppins">
              Our 4-Step Process Flow
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
              From online estimation to bank disbursement, we manage the heavy lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line on desktop with scroll animation */}
            <div className="hidden lg:block absolute top-[28px] left-[12%] right-[12%] h-1 bg-slate-200/50 rounded-full -z-10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="h-full bg-gradient-premium"
              />
            </div>

            {PROCESS_STEPS.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="flex flex-col items-center text-center gap-5 relative group"
              >
                <div className="w-14 h-14 rounded-full border-4 border-slate-50 bg-white group-hover:border-blue-100 flex items-center justify-center text-[#0B4F9C] font-black font-dmsans text-xl shadow-lg shadow-slate-200/50 group-hover:bg-gradient-premium group-hover:shadow-blue-500/20 transition-all duration-300 z-10">
                  {step.step}
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-bold text-slate-800 font-poppins">{step.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Interactive EMI Calculator Section */}
      <section id="emi-calc" className="py-16 lg:py-20 bg-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/40 via-white to-white pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col gap-12">
          <div className="text-center flex flex-col gap-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A86B] font-poppins">Pre-Plan Repayments</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight font-poppins">
              Interactive EMI Calculator
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
              Simulate loan tenures and rates to estimate your monthly payouts, interest split, and download a report.
            </p>
          </div>
          <EMICalculator />
        </div>
      </section>

      {/* 7. Interactive Credit Score Section */}
      <section id="credit-check" className="py-16 lg:py-20 bg-slate-50/50 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col gap-12">
          <div className="text-center flex flex-col gap-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A86B] font-poppins">Credit Health Check</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight font-poppins">
              Credit Score Checker
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
              Analyze your parameters, identify credit bottlenecks, and discover how to cross 750+ quickly.
            </p>
          </div>
          <CreditScoreEstimator />
        </div>
      </section>

      {/* 8. Interactive Eligibility Section */}
      <section id="eligibility" className="py-16 lg:py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col gap-12">
          <div className="text-center flex flex-col gap-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A86B] font-poppins">Know Your Limits</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight font-poppins">
              Loan Eligibility Checker
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
              Calculate your maximum loan availability based on income, location, age, and existing debts.
            </p>
          </div>
          <EligibilityCalculator />
        </div>
      </section>

      {/* 9. Banking Partners (Logo Slider) */}
      <section className="py-16 bg-slate-50 overflow-hidden border-y border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col items-center gap-8">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
            OUR PREFERRED BANKING PARTNERS
          </span>
          <div className="w-full relative overflow-hidden select-none">
            <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="logo-slider-track">
              {/* Double array for seamless loop */}
              {[...PARTNERS, ...PARTNERS].map((bank, index) => (
                <div key={index} className="mx-6 bg-white border border-slate-200/60 py-3.5 px-6 rounded-2xl flex items-center justify-center font-poppins font-black text-slate-400 hover:text-[#0B4F9C] hover:border-[#0B4F9C]/30 hover:shadow-md transition-all duration-300 whitespace-nowrap cursor-default">
                  {bank}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. Testimonials */}
      <section className="py-16 lg:py-20 bg-slate-50/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col gap-12">
          <div className="text-center flex flex-col gap-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A86B] font-poppins">Success Stories</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight font-poppins">
              What Our Customers Say
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
              Read how our tailored consulting helped business owners and individuals secure clean credit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Aditya Ranade',
                role: 'Founder, Ranade Tech Solutions',
                quote: 'Whitestone Fincorp helped us secure a business loan of ₹45 Lakhs when other banks were stalling due to collateral requirements. Their team guided us to the right partner bank, managed the entire documentation, and got it approved in 4 days. Excellent consulting!',
                rating: 5,
                initials: 'AR',
                bg: 'bg-blue-500'
              },
              {
                name: 'Sneha Kulkarni',
                role: 'Senior Software Engineer, Capgemini',
                quote: 'I was looking for a home loan for my new apartment. Whitestone compared interest rates across 6 top banks and found me an offer that was 0.4% lower than my salary bank. That saved me lakhs in interest over the tenure. Highly recommended!',
                rating: 5,
                initials: 'SK',
                bg: 'bg-emerald-500'
              },
              {
                name: 'Vikram Singh Rathore',
                role: 'Proprietor, Rathore Logistics',
                quote: 'Securing capital for our fleet expansion was seamless. The consultant assigned to us, Ananya, was extremely professional. She understood our cash flows and mapped us to a bank that offered a flexible repayment schedule. Very trustworthy team.',
                rating: 5,
                initials: 'VR',
                bg: 'bg-purple-500'
              },
            ].map((test, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 flex flex-col justify-between gap-5 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col gap-4">
                  {/* Google Reviews Badge style */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: test.rating }).map((_, i) => (
                        <Star key={i} size={15} className="fill-amber-400 stroke-none" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 py-0.5 px-2 rounded-full border border-emerald-100">
                      <ShieldCheck size={11} /> Verified Borrower
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-600 leading-relaxed italic">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100/50">
                  <div className={`w-9 h-9 rounded-full ${test.bg} text-white flex items-center justify-center text-xs font-bold font-dmsans shrink-0`}>
                    {test.initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-800 font-poppins truncate">{test.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider truncate">{test.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ Accordion */}
      <section id="faq" className="py-16 lg:py-20 bg-white relative">
        <div className="max-w-4xl mx-auto px-6 md:px-8 flex flex-col gap-12">
          <div className="text-center flex flex-col gap-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A86B] font-poppins">Got Questions?</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight font-poppins">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
              Find transparent answers regarding our facilitation model, documentation, and banks.
            </p>
          </div>

          <div className="grid gap-4">
            {homeFaqs.map((faq, idx) => {
              const isActive = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 shadow-xs ${
                    isActive ? 'border-[#0B4F9C]/30 bg-gradient-to-r from-blue-50/20 to-transparent' : 'bg-white border-slate-100'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left py-5 px-6 font-bold text-slate-800 flex justify-between items-center cursor-pointer hover:bg-slate-50/50 transition-colors"
                  >
                    <span className={`text-sm md:text-base font-poppins transition-colors duration-200 ${isActive ? 'text-[#0B4F9C]' : ''}`}>{faq.q}</span>
                    <ChevronDown size={18} className={`text-slate-400 transition-all duration-300 ${isActive ? 'rotate-180 text-[#0B4F9C]' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5 px-6 text-xs md:text-sm text-slate-500 leading-relaxed font-semibold border-t border-slate-50 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. Blogs Grid */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col gap-12">
          <div className="text-center flex flex-col gap-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A86B] font-poppins">Insights & Guides</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight font-poppins">
              Latest From Our Blog
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
              Stay updated with financial strategies, policy alterations, and credit advice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '5 Crucial Tips to Boost Your Credit Score Fast',
                slug: 'boost-credit-score-fast',
                summary: 'Struggling with a low credit score? Learn actionable tips to improve your score from 600 to 750+ within a few months and qualify for the best loan rates.',
                category: 'Credit Score',
                date: 'Jul 3, 2026',
                author: 'By Amit Mehta',
                readTime: '4 Min Read'
              },
              {
                title: 'A Complete Guide to Home Loan Eligibility in India',
                slug: 'home-loan-eligibility-guide',
                summary: 'Understand the key factors that banks consider when assessing your home loan eligibility, including FOIR, LTV, credit history, and employment type.',
                category: 'Home Loan',
                date: 'Jul 2, 2026',
                author: 'By Ritu Sharma',
                readTime: '5 Min Read'
              },
              {
                title: 'How Small Businesses Can Secure Unsecured Loans',
                slug: 'unsecured-business-loans-msme',
                summary: 'Unsecured business loans are a powerful tool for MSMEs to manage cash flow and fuel expansion. Learn the documentation and criteria needed to secure approval.',
                category: 'Business Loan',
                date: 'Jul 1, 2026',
                author: 'By Rajesh Patel',
                readTime: '6 Min Read'
              },
            ].map((blog, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-2 transition-all duration-500 group relative"
              >
                {/* Visual Featured Image Placeholder Container */}
                <div className="h-36 bg-gradient-to-br from-[#0B4F9C]/10 to-[#1E88E5]/5 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay group-hover:scale-105 transition-transform duration-500" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 bg-white/90 backdrop-blur-sm py-1.5 px-3 rounded-full shadow-sm z-10 border border-slate-100/50">
                    {blog.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col gap-4 flex-grow">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>{blog.author}</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 font-poppins leading-snug group-hover:text-[#0B4F9C] transition-colors">
                    <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold line-clamp-3">
                    {blog.summary}
                  </p>
                </div>
                <div className="py-4 px-6 md:px-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{blog.date}</span>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-xs font-bold text-[#0B4F9C] flex items-center gap-1.5 hover:text-[#083c78] group/link"
                  >
                    Read Article <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Contact Consultation Form Section */}
      <section id="contact" className="py-16 lg:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0B4F9C]/5 -z-10" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6 text-center lg:text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A86B] font-poppins">Get in Touch</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight font-poppins leading-[1.2]">
              Let Our Loan Consultants <br />
              <span className="text-gradient">Do The Hard Work.</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed max-w-md mx-auto lg:mx-0">
              Submit your inquiry and upload relevant files. Our advisor will run eligibility checks across our 25+ banking partners and contact you within 2 working hours.
            </p>
            <div className="flex flex-col gap-3 font-semibold text-xs text-slate-600 mt-2">
              <div className="flex gap-2 items-center justify-center lg:justify-start">
                <CheckCircle2 size={16} className="text-[#00A86B]" />
                <span>Confidential Document Transfer Protocols</span>
              </div>
              <div className="flex gap-2 items-center justify-center lg:justify-start">
                <CheckCircle2 size={16} className="text-[#00A86B]" />
                <span>Direct Underwriting Submissions</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
