'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, Calculator, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const headerRef = React.useRef<HTMLElement>(null);

  // Measure header height and set CSS variable
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    updateHeaderHeight();
    
    // Create an observer to watch for resizing (e.g. window resize)
    const resizeObserver = new ResizeObserver(() => updateHeaderHeight());
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on path change
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
      setActiveDropdown(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
  ];

  const services = [
    { name: 'Personal Loan', href: '/services/personal-loan', desc: 'Custom unsecured loans for your personal needs' },
    { name: 'Business Loan', href: '/services/business-loan', desc: 'Collateral-free funding for MSMEs and enterprises' },
    { name: 'Home Loan', href: '/services/home-loan', desc: 'Affordable rates to buy your dream property' },
    { name: 'Loan Against Property', href: '/services/loan-against-property', desc: 'Leverage your property value for maximum liquidity' },
    { name: 'Project Loan', href: '/services/project-loan', desc: 'Large-scale infrastructure and industrial project funding' },
    { name: 'Top-up Loan', href: '/services/top-up-loan', desc: 'Additional low-cost capital over your active loan' },
    { name: 'Credit Cards', href: '/services/credit-card', desc: 'Compare and apply for premium rewards cards' },
  ];

  const calculators = [
    { name: 'EMI Calculator', href: '/calculators/emi', desc: 'Calculate your monthly loan payments', icon: Calculator },
    { name: 'Credit Score Estimator', href: '/calculators/credit-score', desc: 'Check your estimated score & tips', icon: ShieldCheck },
    { name: 'Eligibility Checker', href: '/calculators/eligibility', desc: 'Determine your loan borrowing capacity', icon: ArrowRight },
  ];

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'glassmorphism py-1.5 md:py-2 shadow-md'
          : 'bg-transparent py-3 md:py-4.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img 
            src="/logo.svg" 
            alt="Whitestone Fincorp Logo" 
            className="h-14 md:h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 font-inter">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-semibold hover:text-[#0B4F9C] transition-colors duration-200 py-1.5 ${
                  active ? 'text-[#0B4F9C]' : 'text-[#1E293B]'
                }`}
              >
                <span>{link.name}</span>
                {active && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-[-18px] left-0 right-0 h-[3px] bg-[#00A86B] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Services Dropdown */}
          <div className="relative group" onMouseLeave={() => setActiveDropdown(null)}>
            <button
              onClick={() => toggleDropdown('services')}
              onMouseEnter={() => setActiveDropdown('services')}
              className={`relative text-sm font-semibold flex items-center gap-1 hover:text-[#0B4F9C] transition-colors duration-200 py-1.5 cursor-pointer ${
                pathname.startsWith('/services') ? 'text-[#0B4F9C]' : 'text-[#1E293B]'
              }`}
            >
              Services <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
              {pathname.startsWith('/services') && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute bottom-[-18px] left-0 right-0 h-[3px] bg-[#00A86B] rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            <AnimatePresence>
              {activeDropdown === 'services' && (
                <div className="absolute left-0 top-full pt-2 w-80 z-20">
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-full"
                  >
                    <div className="grid gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3">Products & Solutions</span>
                      {services.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex flex-col p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200 group"
                        >
                          <span className="text-sm font-bold text-slate-800 group-hover:text-[#0B4F9C] transition-colors duration-200">
                            {item.name}
                          </span>
                          <span className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {item.desc}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Calculators Dropdown */}
          <div className="relative group" onMouseLeave={() => setActiveDropdown(null)}>
            <button
              onClick={() => toggleDropdown('calculators')}
              onMouseEnter={() => setActiveDropdown('calculators')}
              className={`relative text-sm font-semibold flex items-center gap-1 hover:text-[#0B4F9C] transition-colors duration-200 py-1.5 cursor-pointer ${
                pathname.startsWith('/calculators') ? 'text-[#0B4F9C]' : 'text-[#1E293B]'
              }`}
            >
              Calculators <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'calculators' ? 'rotate-180' : ''}`} />
              {pathname.startsWith('/calculators') && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute bottom-[-18px] left-0 right-0 h-[3px] bg-[#00A86B] rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            <AnimatePresence>
              {activeDropdown === 'calculators' && (
                <div className="absolute left-0 top-full pt-2 w-80 z-20">
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-full"
                  >
                  <div className="grid gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3">Interactive Utilities</span>
                    {calculators.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200 group"
                        >
                          <div className="p-2 rounded-lg bg-blue-50 text-[#0B4F9C] group-hover:bg-[#0B4F9C] group-hover:text-white transition-colors duration-200 mt-0.5">
                            <Icon size={16} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 group-hover:text-[#0B4F9C] transition-colors duration-200">
                              {item.name}
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                              {item.desc}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            )}
            </AnimatePresence>
          </div>

          <Link
            href="/blog"
            className={`relative text-sm font-semibold hover:text-[#0B4F9C] transition-colors duration-200 py-1.5 ${
              pathname === '/blog' ? 'text-[#0B4F9C]' : 'text-[#1E293B]'
            }`}
          >
            <span>Blog</span>
            {pathname === '/blog' && (
              <motion.span
                layoutId="activeNavIndicator"
                className="absolute bottom-[-18px] left-0 right-0 h-[3px] bg-[#00A86B] rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
          <Link
            href="/contact"
            className={`relative text-sm font-semibold hover:text-[#0B4F9C] transition-colors duration-200 py-1.5 ${
              pathname === '/contact' ? 'text-[#0B4F9C]' : 'text-[#1E293B]'
            }`}
          >
            <span>Contact</span>
            {pathname === '/contact' && (
              <motion.span
                layoutId="activeNavIndicator"
                className="absolute bottom-[-18px] left-0 right-0 h-[3px] bg-[#00A86B] rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="tel:+919824975488"
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#0B4F9C] transition-colors duration-200"
          >
            <Phone size={16} className="text-[#00A86B]" />
            +91 98249 75488
          </a>
          <Link
            href="/contact?type=apply"
            className="px-5 py-2.5 rounded-xl bg-gradient-premium hover:bg-gradient-premium-hover text-white text-sm font-semibold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300"
          >
            Apply Now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="lg:hidden w-full bg-white border-t border-slate-100 overflow-hidden shadow-lg"
          >
            <div className="px-6 py-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
              <Link href="/" className="text-base font-bold text-slate-800 py-1.5 border-b border-slate-50">Home</Link>
              <Link href="/about" className="text-base font-bold text-slate-800 py-1.5 border-b border-slate-50">About</Link>
              
              {/* Mobile Services */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Our Services</span>
                {services.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-semibold text-slate-700 pl-3 py-1.5 hover:text-[#0B4F9C]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Calculators */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Calculators</span>
                {calculators.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-semibold text-slate-700 pl-3 py-1.5 hover:text-[#0B4F9C]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <Link href="/blog" className="text-base font-bold text-slate-800 py-1.5 border-b border-slate-50 mt-2">Blog</Link>
              <Link href="/contact" className="text-base font-bold text-slate-800 py-1.5 border-b border-slate-50">Contact</Link>
              
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-100">
                <a
                  href="tel:+919824975488"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 text-slate-800 font-bold text-sm"
                >
                  <Phone size={18} className="text-[#00A86B]" />
                  Call Support
                </a>
                <Link
                  href="/contact?type=apply"
                  className="w-full text-center px-4 py-3 rounded-xl bg-gradient-premium text-white font-bold text-sm shadow-md"
                >
                  Apply for Loan
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
