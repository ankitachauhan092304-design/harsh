'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Shield, ArrowUpRight, Lock, BadgeCheck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const loanLinks = [
    { name: 'Personal Loan', href: '/services/personal-loan' },
    { name: 'Business Loan', href: '/services/business-loan' },
    { name: 'Home Loan', href: '/services/home-loan' },
    { name: 'Loan Against Property', href: '/services/loan-against-property' },
    { name: 'Project Loan', href: '/services/project-loan' },
    { name: 'Top-up Loan', href: '/services/top-up-loan' },
    { name: 'Credit Cards', href: '/services/credit-card' },
  ];

  const calcLinks = [
    { name: 'EMI Calculator', href: '/calculators/emi' },
    { name: 'Credit Score Estimator', href: '/calculators/credit-score' },
    { name: 'Eligibility Checker', href: '/calculators/eligibility' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/legal/privacy-policy' },
    { name: 'Terms of Use', href: '/legal/terms-and-conditions' },
    { name: 'Disclaimer', href: '/legal/disclaimer' },
    { name: 'Refund Policy', href: '/legal/refund-policy' },
    { name: 'Cookie Policy', href: '/legal/cookie-policy' },
  ];

  const trustBadges = [
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="11" width="14" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      label: '256-bit SSL',
      sub: 'Encrypted',
      color: 'from-emerald-500 to-green-600',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      label: 'RBI Compliant',
      sub: 'Guidelines',
      color: 'from-blue-500 to-[#0B4F9C]',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4l3 3"/>
        </svg>
      ),
      label: 'No Hidden',
      sub: 'Charges',
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>
      ),
      label: 'Data Privacy',
      sub: 'Protected',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const socialLinks = [
    {
      label: 'Facebook',
      href: 'https://facebook.com',
      icon: (
        <svg className="w-[17px] h-[17px] fill-current" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: (
        <svg className="w-[17px] h-[17px] fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
    },
    {
      label: 'X / Twitter',
      href: 'https://twitter.com',
      icon: (
        <svg className="w-[17px] h-[17px] fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.634 5.903-5.634zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: 'https://instagram.com',
      icon: (
        <svg className="w-[17px] h-[17px] fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/919824975488',
      icon: (
        <svg className="w-[17px] h-[17px] fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#0B132B] text-slate-300 font-inter pt-16 pb-8 border-t border-slate-800/60 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0B4F9C]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#00A86B]/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── TRUST BADGES STRIP ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {trustBadges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 group"
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                {badge.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white leading-tight">{badge.label}</p>
                <p className="text-[10px] text-slate-500 font-medium">{badge.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── MAIN COLUMNS ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2.5 group w-fit">
            <img 
              src="/logo.svg" 
              alt="Whitestone Fincorp Logo" 
              className="h-14 md:h-18 w-auto object-contain group-hover:scale-105 transition-transform duration-300 brightness-0 invert"
            />
          </Link>

          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            Whitestone Fincorp provides premium financial consulting and facilitates access to credit through India&apos;s leading banks and financial institutions. We enable you to compare, optimize, and secure credit with complete security and trust.
          </p>

          {/* Social icons */}
          <div className="flex gap-2.5">
            {socialLinks.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-[#0B4F9C] text-slate-400 hover:text-white flex items-center justify-center transition-colors duration-300 border border-slate-700/50 hover:border-[#0B4F9C]"
              >
                {s.icon}
              </motion.a>
            ))}
          </div>

          {/* Security certificates */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40">
              <Lock size={11} className="text-emerald-400" />
              <span className="text-[10px] font-bold text-slate-400">SSL Secured</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40">
              <BadgeCheck size={11} className="text-blue-400" />
              <span className="text-[10px] font-bold text-slate-400">Verified Business</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40">
              <Shield size={11} className="text-violet-400" />
              <span className="text-[10px] font-bold text-slate-400">RBI Compliant</span>
            </div>
          </div>
        </div>

        {/* Loan Services */}
        <div className="flex flex-col gap-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins border-b border-slate-800 pb-2">
            Loans Facilitated
          </span>
          <div className="flex flex-col gap-3 text-sm">
            {loanLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-400 hover:text-white flex items-center gap-1 group/link transition-all duration-200 hover:translate-x-0.5"
              >
                <ArrowUpRight size={12} className="opacity-0 group-hover/link:opacity-100 text-[#00A86B] shrink-0 -ml-4 group-hover/link:ml-0 transition-all duration-200" />
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="flex flex-col gap-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins border-b border-slate-800 pb-2">
            Resources
          </span>
          <div className="flex flex-col gap-3 text-sm">
            {calcLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-400 hover:text-white flex items-center gap-1 group/link transition-all duration-200 hover:translate-x-0.5"
              >
                <ArrowUpRight size={12} className="opacity-0 group-hover/link:opacity-100 text-[#00A86B] shrink-0 -ml-4 group-hover/link:ml-0 transition-all duration-200" />
                {link.name}
              </Link>
            ))}
            <Link href="/blog" className="text-slate-400 hover:text-white transition-colors duration-200 hover:translate-x-0.5 block">
              Insights &amp; Blog
            </Link>
            <Link href="/about" className="text-slate-400 hover:text-white transition-colors duration-200 hover:translate-x-0.5 block">
              About Company
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins border-b border-slate-800 pb-2">
            Corporate Office
          </span>
          <div className="flex flex-col gap-4 text-sm text-slate-400">
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="text-[#00A86B] shrink-0 mt-0.5" />
              <span className="leading-relaxed text-xs">
                207/21 WHITESTONE FINCORP,<br />
                Opp. ADC Bank, RAKHIAL,<br />
                AHMEDABAD – 380023
              </span>
            </div>
            <a
              href="tel:+919824975488"
              className="flex items-center gap-2.5 hover:text-white transition-colors duration-200 group/phone"
            >
              <Phone size={15} className="text-[#00A86B] group-hover/phone:scale-110 transition-transform shrink-0" />
              <span>+91 98249 75488</span>
            </a>
            <a
              href="mailto:info@whitestonefincorp.com"
              className="flex items-center gap-2.5 hover:text-white transition-colors duration-200 group/mail text-xs"
            >
              <Mail size={15} className="text-[#00A86B] group-hover/mail:scale-110 transition-transform shrink-0" />
              <span>info@whitestonefincorp.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-14 pt-8 border-t border-slate-800/60 flex flex-col gap-6">
        {/* Legal links */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-500">
          {legalLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-slate-300 transition-colors">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/60 text-[11px] leading-relaxed text-slate-500 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-slate-400 font-bold">
            <Shield size={13} className="text-[#00A86B]" />
            <span>FACILITATION &amp; ADVISORY NOTICE</span>
          </div>
          <p>
            Whitestone Fincorp is a financial services consulting company. We are NOT a registered bank, Non-Banking Financial Company (NBFC), Micro Finance Institution (MFI), or direct lender. We do NOT provide loans, credit lines, or direct financing. All credit facilitation, approvals, interest rates, and loan disbursements are subject to the sole discretion and terms of our lending partners (banks, financial institutions, and registered NBFCs).
          </p>
          <p>
            Any calculations provided by our EMI calculator, Credit Score estimator, or Eligibility checker are for educational and estimation purposes only and do not constitute a formal loan offer or credit agreement.
          </p>
        </div>

        {/* Copyright row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-500">
          <span>&copy; {currentYear} Whitestone Fincorp. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Lock size={10} className="text-emerald-500" />
              256-bit SSL Protected
            </span>
            <span className="hidden sm:block text-slate-700">|</span>
            <span className="flex items-center gap-1.5">
              <BadgeCheck size={10} className="text-blue-400" />
              Designed for Trust &amp; Security
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
