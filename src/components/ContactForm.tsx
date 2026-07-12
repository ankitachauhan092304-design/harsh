'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, CheckCircle, AlertCircle, Loader2,
  X, ShieldAlert, FileText, Lock, Sparkles,
  User, Phone, Mail, MapPin, IndianRupee,
  MessageSquare, ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  buildEnquiryMessage,
  buildWhatsAppUrl,
  DEFAULT_WA_NUMBER,
} from '@/lib/whatsapp';

interface FormProps {
  defaultLoanType?: string;
}

const LOAN_OPTIONS = [
  { value: 'PERSONAL', label: 'Personal Loan' },
  { value: 'BUSINESS', label: 'Business Loan' },
  { value: 'HOME', label: 'Home Loan' },
  { value: 'LAP', label: 'Loan Against Property (LAP)' },
  { value: 'PROJECT_LOAN', label: 'Project Loan' },
  { value: 'TOP_UP_LOAN', label: 'Top-up Loan' },
  { value: 'CREDIT_CARD', label: 'Credit Card Comparison' },
];

export default function ContactForm({ defaultLoanType = 'PERSONAL' }: FormProps) {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', city: '',
    loanType: defaultLoanType, loanAmount: '',
    message: '', consent: false, honeypot: '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpeningWA, setIsOpeningWA] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [savedLeadId, setSavedLeadId] = useState<string>('');
  const [savedLeadNumber, setSavedLeadNumber] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // ── Validation ───────────────────────────────────────────────────────────
  const validateField = useCallback((name: string, value: string | boolean): string => {
    switch (name) {
      case 'name':
        if (!String(value).trim()) return 'Full name is required.';
        if (String(value).trim().length < 3) return 'Name must be at least 3 characters.';
        return '';
      case 'phone':
        if (!String(value).trim()) return 'Mobile number is required.';
        if (!/^[6-9]\d{9}$/.test(String(value))) return 'Enter a valid 10-digit Indian mobile number.';
        return '';
      case 'email':
        if (!String(value).trim()) return 'Email address is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) return 'Enter a valid email address.';
        return '';
      case 'city':
        if (!String(value).trim()) return 'City is required.';
        return '';
      case 'loanAmount':
        if (!String(value).trim()) return 'Loan amount is required.';
        if (isNaN(Number(value)) || Number(value) <= 0) return 'Enter a valid positive amount.';
        return '';
      case 'consent':
        if (!value) return 'Please provide authorization to proceed.';
        return '';
      default: return '';
    }
  }, []);

  const validateAll = useCallback(() => {
    const fields = ['name', 'phone', 'email', 'city', 'loanAmount', 'consent'] as const;
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const val = field === 'consent' ? formData.consent : formData[field];
      const err = validateField(field, val as string | boolean);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const val = name === 'consent' ? formData.consent : (formData as Record<string, unknown>)[name];
    const err = validateField(name, val as string | boolean);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFormData((prev) => ({ ...prev, consent: checked }));
    setTouched((prev) => ({ ...prev, consent: true }));
    setErrors((prev) => ({ ...prev, consent: validateField('consent', checked) }));
  };

  // ── File Handling ────────────────────────────────────────────────────────
  const processFiles = useCallback((selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter((file) => {
      const sizeMb = file.size / (1024 * 1024);
      return sizeMb <= 5 && ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
    });

    validFiles.forEach((file) => {
      const key = `${file.name}-${file.size}`;
      setUploadProgress((prev) => ({ ...prev, [key]: 0 }));
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25 + 10;
        if (progress >= 100) { progress = 100; clearInterval(interval); }
        setUploadProgress((prev) => ({ ...prev, [key]: Math.min(progress, 100) }));
      }, 120);
    });

    setFiles((prev) => {
      const existing = new Set(prev.map((f) => `${f.name}-${f.size}`));
      return [...prev, ...validFiles.filter((f) => !existing.has(`${f.name}-${f.size}`))];
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const removed = prev[index];
      const key = `${removed.name}-${removed.size}`;
      setUploadProgress((p) => { const c = { ...p }; delete c[key]; return c; });
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => {
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  // ── Submit → Save Lead → Open WhatsApp ───────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return;

    setTouched({ name: true, phone: true, email: true, city: true, loanAmount: true, consent: true });
    if (!validateAll()) return;

    const lastSubmission = localStorage.getItem('last_lead_sub');
    if (lastSubmission && Date.now() - Number(lastSubmission) < 60000) {
      setErrors({ general: 'Request already received. Please wait 1 minute before submitting again.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('IDLE');

    try {
      // 1. Save lead to PostgreSQL via existing API
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        loanType: formData.loanType,
        loanAmount: Number(formData.loanAmount),
        employmentType: 'SALARIED',
        monthlyIncome: 0,
        remarks: formData.message,
        source: 'WEBSITE_FORM',
        landingPage: typeof window !== 'undefined' ? window.location.pathname : '/',
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('API submission failed');

      const result = await res.json();
      const leadId = result.leadId as string;
      const leadNumber = result.leadNumber as string;

      // 2. Record the WhatsApp click (non-blocking, fire-and-forget)
      fetch(`/api/leads/${leadId}/whatsapp`, { method: 'POST' }).catch(() => {});

      // 3. Store for UI
      setSavedLeadId(leadId);
      setSavedLeadNumber(leadNumber);
      localStorage.setItem('last_lead_sub', Date.now().toString());

      // 4. Fire confetti
      confetti({
        particleCount: 120, spread: 80,
        origin: { y: 0.55 },
        colors: ['#0B4F9C', '#00A86B', '#6366f1', '#f59e0b'],
      });

      setSubmitStatus('SUCCESS');

      // 5. Auto-open WhatsApp immediately after save
      setIsOpeningWA(true);
      const waMessage = buildEnquiryMessage({
        leadNumber,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        loanType: formData.loanType,
        loanAmount: Number(formData.loanAmount),
        remarks: formData.message,
      });
      setTimeout(() => {
        const waUrl = buildWhatsAppUrl(waMessage, DEFAULT_WA_NUMBER);
        window.location.href = waUrl;
        setIsOpeningWA(false);
      }, 800); // Small delay so success screen renders first

      // 6. Reset form
      setFormData({ name: '', phone: '', email: '', city: '', loanType: defaultLoanType, loanAmount: '', message: '', consent: false, honeypot: '' });
      setFiles([]); setTouched({}); setErrors({});
    } catch (err) {
      console.error(err);
      setSubmitStatus('ERROR');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Manual WhatsApp re-open from success screen ───────────────────────────
  const handleManualWhatsApp = () => {
    if (!savedLeadNumber) return;
    const waMessage = buildEnquiryMessage({
      leadNumber: savedLeadNumber,
      name: formData.name || 'Customer',
      phone: formData.phone || '',
      email: formData.email || '',
      city: formData.city || '',
      loanType: defaultLoanType,
      loanAmount: 0,
    });
    const waUrl = buildWhatsAppUrl(waMessage, DEFAULT_WA_NUMBER);
    window.location.href = waUrl;
    // Track click again
    if (savedLeadId) fetch(`/api/leads/${savedLeadId}/whatsapp`, { method: 'POST' }).catch(() => {});
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  const fieldClass = (name: string) =>
    `w-full px-4 py-3 rounded-xl border bg-white text-sm font-medium outline-none transition-all duration-200 placeholder:text-slate-300 ${
      touched[name] && errors[name]
        ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200 bg-rose-50/20'
        : touched[name] && !errors[name]
        ? 'border-emerald-400 focus:border-emerald-500 ring-1 ring-emerald-100'
        : 'border-slate-200 focus:border-[#0B4F9C] focus:ring-2 focus:ring-[#0B4F9C]/10'
    }`;

  const renderErrorMsg = (name: string) =>
    touched[name] && errors[name] ? (
      <motion.span
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[10px] font-semibold text-rose-500 flex items-center gap-1 mt-0.5"
      >
        <AlertCircle size={10} className="shrink-0" />
        {errors[name]}
      </motion.span>
    ) : null;

  const renderValidMark = (name: string) =>
    touched[name] && !errors[name] && (formData as Record<string, unknown>)[name] ? (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
        <CheckCircle size={15} />
      </motion.div>
    ) : null;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/80 relative overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-[#0B4F9C] via-[#6366f1] to-[#00A86B]" />

      <div className="p-6 md:p-10">
        <AnimatePresence mode="wait">
          {/* ── SUCCESS STATE ──────────────────────────────────────────────── */}
          {submitStatus === 'SUCCESS' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="flex flex-col items-center text-center py-14 gap-6"
            >
              {/* Animated check */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.1 }}
                className="relative"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-[#00A86B] flex items-center justify-center shadow-2xl shadow-emerald-200">
                  <CheckCircle size={36} className="text-white" strokeWidth={2.5} />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute inset-0 rounded-full bg-emerald-400/30"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="text-2xl font-black text-slate-800 font-poppins">Consultation Initiated! 🎉</h3>
                <p className="text-sm text-slate-500 max-w-sm leading-relaxed mt-2">
                  Lead <strong className="text-slate-700 font-mono">{savedLeadNumber}</strong> has been registered in our CRM.
                  Our senior advisor will reach out within <strong className="text-slate-700">2 working hours</strong>.
                </p>
              </motion.div>

              {/* WhatsApp CTA */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-col gap-3 w-full max-w-xs">
                <button
                  onClick={handleManualWhatsApp}
                  disabled={isOpeningWA}
                  className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#22c55e] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-green-200 transition-all cursor-pointer disabled:opacity-70"
                >
                  {isOpeningWA ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  )}
                  Open WhatsApp Chat
                </button>

                <button
                  onClick={() => { setSubmitStatus('IDLE'); setSavedLeadId(''); setSavedLeadNumber(''); }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>

              <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <Lock size={9} className="text-[#00A86B]" />
                Your data is protected · Lead Ref: {savedLeadNumber}
              </p>
            </motion.div>
          ) : (
            /* ── FORM ───────────────────────────────────────────────────── */
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Honeypot */}
              <input type="text" name="honeypot" value={formData.honeypot} onChange={handleInputChange} className="hidden" autoComplete="off" tabIndex={-1} />

              {/* Header */}
              <div className="flex flex-col gap-1 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0B4F9C] to-[#6366f1] flex items-center justify-center">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 font-poppins">Request Free Consultation</h3>
                </div>
                <p className="text-xs text-slate-500 pl-10">
                  Submit your details — we save your enquiry and open WhatsApp instantly.
                </p>
              </div>

              {/* General error */}
              <AnimatePresence>
                {errors.general && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-bold rounded-xl flex gap-2 items-center"
                  >
                    <ShieldAlert size={16} className="text-rose-500 shrink-0" />
                    <span>{errors.general}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Row 1: Name + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <User size={11} /> Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} onBlur={() => handleBlur('name')} placeholder="Enter full legal name" className={fieldClass('name')} />
                    {renderValidMark('name')}
                  </div>
                  {renderErrorMsg('name')}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Phone size={11} /> Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-sm font-bold text-slate-400 select-none pointer-events-none">+91</span>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} onBlur={() => handleBlur('phone')} placeholder="98249 75488" maxLength={10} className={`${fieldClass('phone')} pl-12`} />
                    {touched.phone && !errors.phone && formData.phone && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3 text-emerald-500"><CheckCircle size={15} /></motion.div>
                    )}
                  </div>
                  {renderErrorMsg('phone')}
                </div>
              </div>

              {/* Row 2: Email + City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Mail size={11} /> Email Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={() => handleBlur('email')} placeholder="name@example.com" className={fieldClass('email')} />
                    {renderValidMark('email')}
                  </div>
                  {renderErrorMsg('email')}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <MapPin size={11} /> City <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} onBlur={() => handleBlur('city')} placeholder="e.g. Ahmedabad, Mumbai" className={fieldClass('city')} />
                    {renderValidMark('city')}
                  </div>
                  {renderErrorMsg('city')}
                </div>
              </div>

              {/* Row 3: Loan Type + Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <ChevronDown size={11} /> Loan Category
                  </label>
                  <div className="relative">
                    <select name="loanType" value={formData.loanType} onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium outline-none focus:border-[#0B4F9C] focus:ring-2 focus:ring-[#0B4F9C]/10 transition-all cursor-pointer appearance-none"
                    >
                      {LOAN_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <IndianRupee size={11} /> Required Amount <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">₹</span>
                    <input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleInputChange} onBlur={() => handleBlur('loanAmount')} placeholder="e.g. 500000" className={`${fieldClass('loanAmount')} pl-8`} />
                    {touched.loanAmount && !errors.loanAmount && formData.loanAmount && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500"><CheckCircle size={15} /></motion.div>
                    )}
                  </div>
                  {renderErrorMsg('loanAmount')}
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare size={11} /> Special Requirements (Optional)
                </label>
                <textarea name="message" value={formData.message} onChange={handleInputChange} rows={3}
                  placeholder="Share credit history, turnover, or other details to help us find the best match..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium outline-none focus:border-[#0B4F9C] focus:ring-2 focus:ring-[#0B4F9C]/10 transition-all resize-none placeholder:text-slate-300"
                />
              </div>

              {/* Drag & Drop Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Upload size={11} /> Upload Documents (Optional)
                </label>
                <motion.div
                  ref={dropZoneRef}
                  animate={{
                    borderColor: isDragging ? '#0B4F9C' : '#e2e8f0',
                    backgroundColor: isDragging ? 'rgba(11,79,156,0.04)' : 'rgba(248,250,252,0.5)',
                    scale: isDragging ? 1.01 : 1,
                  }}
                  transition={{ duration: 0.15 }}
                  onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver} onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer flex flex-col items-center gap-2 group"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isDragging ? 'bg-[#0B4F9C] text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-[#0B4F9C]/10 group-hover:text-[#0B4F9C]'}`}>
                    <Upload size={17} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-600 group-hover:text-[#0B4F9C] transition-colors">
                      {isDragging ? 'Drop files here…' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Payslips, ITR, Bank Statements · PDF, PNG, JPG ≤ 5MB</p>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                </motion.div>

                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid gap-2 mt-1">
                      {files.map((file, index) => {
                        const key = `${file.name}-${file.size}`;
                        const progress = uploadProgress[key] ?? 100;
                        const isComplete = progress >= 100;
                        return (
                          <motion.div key={key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ delay: index * 0.05 }} className="rounded-xl border border-slate-100 bg-slate-50 overflow-hidden">
                            <div className="flex justify-between items-center p-2.5">
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isComplete ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                                  {isComplete ? <CheckCircle size={14} className="text-emerald-600" /> : <FileText size={14} className="text-[#0B4F9C]" />}
                                </div>
                                <div>
                                  <p className="text-[11px] font-bold text-slate-700 line-clamp-1 max-w-[180px]">{file.name}</p>
                                  <p className="text-[10px] text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB · {isComplete ? 'Ready' : `${Math.round(progress)}%`}</p>
                                </div>
                              </div>
                              <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(index); }} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer">
                                <X size={12} />
                              </button>
                            </div>
                            {!isComplete && (
                              <div className="h-1 bg-slate-200 mx-2.5 mb-2 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-[#0B4F9C] to-[#6366f1] rounded-full" />
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Consent */}
              <div className="flex flex-col gap-1 pt-1">
                <label className={`flex items-start gap-3 cursor-pointer text-xs font-medium leading-relaxed rounded-xl p-3 border transition-all ${formData.consent ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                  <input type="checkbox" checked={formData.consent} onChange={handleCheckboxChange} className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0B4F9C] focus:ring-[#0B4F9C] shrink-0 cursor-pointer" />
                  <span>I authorize <strong>Whitestone Fincorp</strong> and its banking partners to contact me via phone, email, SMS, or WhatsApp. I confirm the details provided are accurate.</span>
                </label>
                {renderErrorMsg('consent')}
              </div>

              {/* API Error */}
              <AnimatePresence>
                {submitStatus === 'ERROR' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-bold rounded-xl flex gap-2 items-center"
                  >
                    <ShieldAlert size={16} className="text-rose-500 shrink-0" />
                    <span>Connection error. Please retry or WhatsApp us directly at +91 98249 75488.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0B4F9C] via-[#1a5fb4] to-[#0B4F9C] hover:from-[#0a4485] hover:to-[#0a4485] text-white font-bold text-sm shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group btn-shine"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-700" />
                {isSubmitting ? (
                  <><Loader2 size={17} className="animate-spin" /><span>Saving & Opening WhatsApp…</span></>
                ) : (
                  <>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>Submit & Chat on WhatsApp</span>
                  </>
                )}
              </button>

              {/* Trust micro-line */}
              <p className="text-center text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
                <Lock size={9} className="text-[#00A86B]" />
                Lead saved to CRM first · 256-bit SSL · No spam · No hidden charges
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
